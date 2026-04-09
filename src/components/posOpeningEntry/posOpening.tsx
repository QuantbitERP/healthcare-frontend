"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAuthHeaders } from "@/utils/sessionAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface BalanceDetail {
  mode_of_payment: string;
  opening_amount: number;
}

interface OpeningEntry {
  period_start_date: string;
  posting_date: string;
  company: string;
  pos_profile: string;
  user: string;
  status: string;
  balance_details: BalanceDetail[];
}

const POSOpeningEntry: React.FC = () => {
  const { posProfile, currentUser, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState<OpeningEntry>({
    company: "",
    pos_profile: posProfile || "",
    user: currentUser || "",
    period_start_date: new Date().toISOString().slice(0, 16),
    posting_date: new Date().toISOString().slice(0, 10),
    status: "Open",
    balance_details: [{ mode_of_payment: "", opening_amount: 0 }],
  });
  const [companies, setCompanies] = useState<string[]>([]);
  const [posProfiles, setPosProfiles] = useState<string[]>([]);
  const [modesOfPayment, setModesOfPayment] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for open POS Opening Entry and redirect if necessary
  useEffect(() => {
    console.log(isAuthenticated);
    console.log(posProfile);
    console.log(currentUser);
    if (!isAuthenticated || !posProfile || !currentUser) {
      router.push("/login");
      return;
    }

    // Since conflict checking now happens in POSProfileSelector on /pos page,
    // we can proceed directly with the opening entry form
  }, [isAuthenticated, posProfile, currentUser, router]);

  // Fetch Companies, POS Profiles, and Modes of Payment
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Companies
        // Use the same authentication logic as other functions
        const authHeaders = getAuthHeaders();
        // Convert HeadersInit to plain object for fetch compatibility
        const headers = typeof authHeaders === 'string' ? 
          JSON.parse(authHeaders) : 
          Array.isArray(authHeaders) ? 
            Object.fromEntries(authHeaders) : 
            authHeaders;
        
        const companyRes = await fetch(
          "https://192.168.7.221:4422/api/resource/Company?fields=[\"name\"]",
          {
            method: "GET",
            headers,
          }
        );
        if (companyRes.ok) {
          const companyData = await companyRes.json();
          setCompanies(companyData.data.map((c: any) => c.name));
        } else {
          console.error("Failed to fetch companies:", companyRes.status);
          setError("Failed to load companies.");
        }

        // Fetch POS Profiles
        const posRes = await fetch(
          "https://192.168.7.221:4422/api/resource/POS Profile?fields=[\"name\"]",
          {
            method: "GET",
            headers,
          }
        );
        if (posRes.ok) {
          const posData = await posRes.json();
          setPosProfiles(posData.data.map((p: any) => p.name));
        } else {
          console.error("Failed to fetch POS profiles:", posRes.status);
          setError("Failed to load POS profiles.");
        }

        // Fetch Modes of Payment
        const mopRes = await fetch(
          "https://192.168.7.221:4422/api/resource/Mode of Payment?fields=[\"name\"]",
          {
            method: "GET",
            headers,
          }
        );
        if (mopRes.ok) {
          const mopData = await mopRes.json();
          setModesOfPayment(mopData.data.map((m: any) => m.name));
        } else {
          console.error("Failed to fetch modes of payment:", mopRes.status);
          setError("Failed to load modes of payment.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load required data. Please try again.");
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handleInputChange = (field: keyof OpeningEntry, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBalanceDetailChange = (
    index: number,
    field: keyof BalanceDetail,
    value: string
  ) => {
    const updatedBalanceDetails = [...formData.balance_details];
    updatedBalanceDetails[index] = {
      ...updatedBalanceDetails[index],
      [field]: field === "opening_amount" ? parseFloat(value) || 0 : value,
    };
    setFormData((prev) => ({ ...prev, balance_details: updatedBalanceDetails }));
  };

  const addBalanceDetail = () => {
    setFormData((prev) => ({
      ...prev,
      balance_details: [
        ...prev.balance_details,
        { mode_of_payment: "", opening_amount: 0 },
      ],
    }));
  };

  const removeBalanceDetail = (index: number) => {
    if (formData.balance_details.length > 1) {
      setFormData((prev) => ({
        ...prev,
        balance_details: prev.balance_details.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.company ||
      !formData.pos_profile ||
      !formData.user ||
      !formData.period_start_date ||
      !formData.posting_date
    ) {
      setError("Please fill all required fields.");
      return;
    }
    if (
      formData.balance_details.some(
        (bd) => !bd.mode_of_payment || bd.opening_amount < 0
      )
    ) {
      setError(
        "Please ensure all balance details have a valid mode of payment and non-negative amount."
      );
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ? 
        JSON.parse(authHeaders) : 
        Array.isArray(authHeaders) ? 
          Object.fromEntries(authHeaders) : 
          authHeaders;
      
      const response = await fetch(
        "https://192.168.7.221:4422/api/resource/Opening Entry",
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            period_start_date: formData.period_start_date,
            posting_date: formData.posting_date,
            company: formData.company,
            pos_profile: formData.pos_profile,
            user: formData.user,
            status: "Open",
            balance_details: formData.balance_details.map(detail => ({
              mode_of_payment: detail.mode_of_payment,
              opening_amount: detail.opening_amount
            })),
            docstatus: 1, // Submit on creation
          }),
        }
      );

      const data = await response.json();
      console.log("Opening Entry response:", data);

      if (response.ok && data.data) {
        console.log("Opening Entry created:", data.data.name);
        setIsOpen(false);
        router.push("/pos"); // Redirect to POS page
      } else {
        console.error("Failed to create Opening Entry:", data);
        setError(data.message || "Failed to create Opening Entry.");
      }
    } catch (err) {
      console.error("Error creating Opening Entry:", err);
      setError("An error occurred while creating the Opening Entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Main Form Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Opening Entry</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company</Label>
                <Select
                  value={formData.company}
                  onValueChange={(value) => handleInputChange("company", value)}
                  disabled={loading}
                >
                  <SelectTrigger id="company">
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pos_profile">POS Profile</Label>
                <Select
                  value={formData.pos_profile}
                  onValueChange={(value) => handleInputChange("pos_profile", value)}
                  disabled={loading || !!posProfile} // Disable if posProfile is set
                >
                  <SelectTrigger id="pos_profile">
                    <SelectValue placeholder="Select POS Profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {posProfiles.map((profile) => (
                      <SelectItem key={profile} value={profile}>
                        {profile}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="user">Cashier</Label>
                <Input
                  id="user"
                  value={formData.user}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="period_start_date">Period Start Date</Label>
                <Input
                  id="period_start_date"
                  type="datetime-local"
                  value={formData.period_start_date}
                  onChange={(e) =>
                    handleInputChange("period_start_date", e.target.value)
                  }
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="posting_date">Posting Date</Label>
              <Input
                id="posting_date"
                type="date"
                value={formData.posting_date}
                onChange={(e) => handleInputChange("posting_date", e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <Label>Balance Details</Label>
              {formData.balance_details.map((detail, index) => (
                <div key={index} className="flex gap-2 items-center mt-2">
                  <Select
                    value={detail.mode_of_payment}
                    onValueChange={(value) =>
                      handleBalanceDetailChange(index, "mode_of_payment", value)
                    }
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Mode of Payment" />
                    </SelectTrigger>
                    <SelectContent>
                      {modesOfPayment.map((mop) => (
                        <SelectItem key={mop} value={mop}>
                          {mop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Opening Amount"
                    value={detail.opening_amount}
                    onChange={(e) =>
                      handleBalanceDetailChange(index, "opening_amount", e.target.value)
                    }
                    disabled={loading}
                    min="0"
                    step="0.01"
                  />
                  {formData.balance_details.length > 1 && (
                    <Button
                      variant="destructive"
                      onClick={() => removeBalanceDetail(index)}
                      disabled={loading}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addBalanceDetail}
                disabled={loading}
                className="mt-2"
              >
                Add Payment Mode
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsOpen(false)}
              variant="secondary"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default POSOpeningEntry;