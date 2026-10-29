"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface POSProfile {
  name: string;
  warehouse?: string;
  status?: string;
  is_open?: boolean;
  opened_by?: string;
  opening_entry?: string;
}

interface POSProfileSelectorProps {
  isOpen: boolean;
  onSelect: (profile: string) => void;
  onClose?: () => void;
}

const POSProfileSelector: React.FC<POSProfileSelectorProps> = ({
  isOpen,
  onSelect,
  onClose,
}) => {
  const [posProfiles, setPosProfiles] = useState<POSProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [conflictInfo, setConflictInfo] = useState<{ entryName: string; userName: string } | null>(null);
  const { isAuthenticated, apiKey, apiSecret, currentUser, setPosProfile, csrfToken, isInitialized } =
    useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for initialization before checking authentication
    if (!isInitialized) return;
    
    // Only fetch if authenticated (either via keys or session)aries.
    if (isOpen && isAuthenticated && currentUser) {
      const fetchPOSProfiles = async () => {
        try {
          console.log("Fetching POS Profiles for user:", currentUser);
          const url = `https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.api.get_pos_profiles_for_user`;

          const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "Accept": "application/json",
          };

          const isMasked = (secret: string | null | undefined) => secret ? secret.includes('***') : false;
          if (apiKey && apiSecret && !isMasked(apiSecret)) {
            headers["Authorization"] = `token ${apiKey}:${apiSecret}`;
          }

          if (csrfToken) {
            headers["X-Frappe-CSRF-Token"] = csrfToken;
          }

          const response = await fetch(url, {
            method: "POST",
            headers: headers,
            credentials: "include", // Ensure session cookies are sent
            body: JSON.stringify({ user: currentUser }),
          });

          console.log("POS Profile API Response Status:", response.status);
          const responseData = await response.json();
          console.log("POS Profile API Response Data:", responseData);

          if (response.ok) {
            const profiles: POSProfile[] = responseData.message || [];

            // Check if status is provided by API or fetch as fallback
            const hasStatus = profiles.some((p) => p.status !== undefined || p.is_open !== undefined);
            if (!hasStatus && profiles.length > 0) {
              try {
                const openResp = await fetch(
                  `https://gmcerp.quantcloud.in/api/resource/Opening%20Entry?filters=[["status","=","Open"],["docstatus","=","1"]]&fields=["name","pos_profile","user"]&limit_page_length=100`,
                  {
                    method: "GET",
                    headers,
                    credentials: "include",
                  }
                );
                if (openResp.ok) {
                  const openData = await openResp.json();
                  const openEntries = openData?.data || [];
                  const openMap = new Map<string, any>();
                  openEntries.forEach((entry: any) => {
                    if (entry.pos_profile) openMap.set(entry.pos_profile, entry);
                  });
                  profiles.forEach((p) => {
                    const entry = openMap.get(p.name);
                    if (entry) {
                      p.status = 'Open';
                      p.is_open = true;
                      p.opened_by = entry.user;
                      p.opening_entry = entry.name;
                    } else {
                      p.status = 'Closed';
                      p.is_open = false;
                    }
                  });
                }
              } catch (e) {
                console.error("Failed to fetch fallback open entries:", e);
              }
            }

            setPosProfiles(profiles);
            setError(
              profiles.length === 0
                ? "No POS profiles found for your account. Please contact your administrator."
                : null
            );
            // Auto-select if exactly one profile is available
            if (profiles.length === 1) {
              setSelectedProfile(profiles[0].name);
            }
          } else {
            console.error("Failed to fetch POS profiles. Status:", response.status);
            setError(responseData._error_message || "Failed to load POS profiles.");
            if (response.status === 401 && !apiKey) {
              // If we have no keys and session failed, redirect
              router.push("/login");
            }
          }
        } catch (error) {
          console.error("Error fetching POS profiles:", error);
          setError("An error occurred while fetching POS profiles.");
        }
      };

      fetchPOSProfiles();
    } else if (isOpen && !isAuthenticated) {
      console.log("User not authenticated, redirecting to login...");
      setError("Please log in to access POS profiles.");
      router.push("/login");
    }
  }, [isOpen, isAuthenticated, apiKey, apiSecret, currentUser, csrfToken, router, isInitialized]);

  const handleSelect = async () => {
    if (selectedProfile && currentUser) {
      // First check for conflicts using backend API
      try {
        console.log("Checking for POS conflicts before proceeding...");

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          "Accept": "application/json",
        };

        const isMasked = (secret: string | null | undefined) => secret ? secret.includes('***') : false;
        if (apiKey && apiSecret && !isMasked(apiSecret)) {
          headers["Authorization"] = `token ${apiKey}:${apiSecret}`;
        }

        if (csrfToken) {
          headers["X-Frappe-CSRF-Token"] = csrfToken;
        }

        const response = await fetch(
          `https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.api.check_pos_opening_entry_conflict`,
          {
            method: "POST",
            headers: headers,
            credentials: "include",
            body: JSON.stringify({
              pos_profile: selectedProfile,
              current_user: currentUser
            }),
          }
        );

        const result = await response.json();
        console.log("Backend conflict check result:", result);

        if (response.ok && result.message) {
          const conflictData = result.message;

          if (conflictData.has_conflict) {
            console.log("Conflict detected:", conflictData);

            if (conflictData.conflict_type === "own_entry") {
              // User has their own open entry - proceed with profile
              console.log("User has own open entry, proceeding with profile");
              setPosProfile(selectedProfile);
              onSelect(selectedProfile);
              if (typeof window !== "undefined" && (window.location.pathname === "/" || window.location.pathname.startsWith("/pos"))) {
                router.push("/pos");
              }
              return;
            } else if (conflictData.conflict_type === "other_user_entry") {
              // Another user has an open entry - show dialog
              console.log("Other user has open entry, showing dialog");
              setConflictInfo({
                entryName: conflictData.entry_name,
                userName: conflictData.user_name,
              });
              setShowConflictDialog(true);
              return;
            }
          }
        } else {
          console.error("Failed to check POS conflicts:", result);
          setError("Failed to check for conflicts. Please try again.");
          return;
        }
      } catch (error) {
        console.error("Error checking POS conflicts:", error);
        setError("Error checking for conflicts. Please try again.");
        return;
      }

      // No conflicts, proceed
      console.log("No conflicts found, proceeding");
      setPosProfile(selectedProfile);
      onSelect(selectedProfile);
      if (typeof window !== "undefined" && (window.location.pathname === "/" || window.location.pathname.startsWith("/pos"))) {
        router.push("/pos/opening");
      }
    } else if (!currentUser) {
      setError("User information not available. Please log in again.");
      router.push("/login");
    }
  };

  return (
    <>
      {/* Conflict Dialog */}
      <Dialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Opening Entry Already Open</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-700">
              Opening Entry <strong>{conflictInfo?.entryName}</strong> is already open for this POS Profile.
            </p>
            <p className="text-sm text-gray-700 mt-2">
              Created by: <strong>{conflictInfo?.userName}</strong>
            </p>
            <p className="text-sm text-red-600 mt-4">
              Please ask the user to close the existing entry before creating a new one.
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowConflictDialog(false);
                setSelectedProfile(null);
              }}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Selection Dialog */}
      <Dialog
        open={isOpen && !showConflictDialog}
        onOpenChange={(open) => {
          if (!open && onClose) onClose();
        }}
      >
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Select POS Profile</DialogTitle>
            <DialogDescription>
              Please select a POS profile to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-3 max-h-[60vh] overflow-y-auto pr-1">
            {error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : posProfiles.length > 0 ? (
              <RadioGroup
                onValueChange={setSelectedProfile}
                value={selectedProfile || ""}
                className="space-y-2.5"
              >
                {posProfiles.map((profile) => {
                  const isOpen = profile.status === "Open" || profile.is_open === true;
                  const isCurrentUsers =
                    profile.opened_by &&
                    currentUser &&
                    profile.opened_by.toLowerCase() === currentUser.toLowerCase();

                  return (
                    <label
                      key={profile.name}
                      htmlFor={profile.name}
                      className={`flex items-start justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedProfile === profile.name
                          ? "border-blue-500 bg-blue-50/40 ring-1 ring-blue-500/20"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/60"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem
                          value={profile.name}
                          id={profile.name}
                          className="mt-0.5"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-gray-900 leading-tight">
                            {profile.name}
                          </span>
                          {profile.warehouse && (
                            <span className="text-xs text-gray-500 mt-0.5">
                              {profile.warehouse}
                            </span>
                          )}
                          {isOpen && profile.opened_by && (
                            <span className="text-[11px] text-gray-500 mt-1">
                              Opened by:{" "}
                              <span className="font-medium text-gray-700">
                                {profile.opened_by}
                              </span>
                              {isCurrentUsers && (
                                <span className="ml-1 text-emerald-700 font-semibold">
                                  (You)
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="ml-2 flex-shrink-0">
                        {isOpen ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Open
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            <span className="w-1.5 h-1.5 mr-1.5 bg-gray-400 rounded-full"></span>
                            Closed
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </RadioGroup>
            ) : (
              <p className="text-sm text-gray-500">No POS profiles found.</p>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={handleSelect}
              disabled={!selectedProfile || !currentUser}
              className="px-6"
            >
              Select
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default POSProfileSelector;