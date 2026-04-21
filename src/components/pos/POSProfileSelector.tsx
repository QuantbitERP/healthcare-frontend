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
}

interface POSProfileSelectorProps {
  isOpen: boolean;
  onSelect: (profile: string) => void;
}

const POSProfileSelector: React.FC<POSProfileSelectorProps> = ({
  isOpen,
  onSelect,
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
          const url = `https://demohims.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.api.get_pos_profiles_for_user`;

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
          `https://demohims.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.api.check_pos_opening_entry_conflict`,
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
              // User has their own open entry - redirect to POS page
              console.log("User has own open entry, redirecting to POS");
              setPosProfile(selectedProfile);
              onSelect(selectedProfile);
              router.push("/pos");
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

      // No conflicts, proceed to opening page
      console.log("No conflicts found, proceeding to opening page");
      setPosProfile(selectedProfile);
      onSelect(selectedProfile);
      router.push("/pos/opening");
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
      <Dialog open={isOpen && !showConflictDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select POS Profile</DialogTitle>
            <DialogDescription>
              Please select a POS profile to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : posProfiles.length > 0 ? (
              <RadioGroup
                onValueChange={setSelectedProfile}
                value={selectedProfile || ""}
              >
                {posProfiles.map((profile) => (
                  <div key={profile.name} className="flex items-center space-x-2">
                    <RadioGroupItem value={profile.name} id={profile.name} />
                    <Label htmlFor={profile.name}>
                      {profile.name}
                      {profile.warehouse ? ` (${profile.warehouse})` : ""}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <p>No POS profiles found.</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSelect} disabled={!selectedProfile || !currentUser}>
              Select
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default POSProfileSelector;