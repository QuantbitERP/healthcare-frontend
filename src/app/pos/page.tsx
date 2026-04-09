"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/buttons/Button";
import DataTableComponent from "@/components/DataTable";
import SearchInput from "@/components/form/SearchInput";
import SelectInput from "@/components/form/Select";
import PageHeader from "@/components/billbreakdown/PageHeader";
import { useAuth } from "@/context/AuthContext";
import POSProfileSelector from "@/components/pos/POSProfileSelector";
import { redirectToFrappeLogin } from "@/utils/sessionAuth";
import { authenticatedFetch } from "@/utils/apiHelper";
import { FRAPPE_BASE_URL } from "@/config/frappe";

export default function POS() {
  const API_BASE_URL = "https://192.168.7.221:4422/api/resource";
  const selectOptions = [
    { label: "Invoice ID", value: "name" },
    { label: "Customer Name", value: "customer" },
    { label: "Status", value: "status" },
  ];
  const [searchValue, setSearchValue] = useState<string>("");
  const [showPosProfileSelector, setShowPosProfileSelector] = useState(false);
  const [_forceShowProfileSelector, setForceShowProfileSelector] = useState(false);

  const [salesInvoices, setSalesInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<string>("itemCode");

  const [page, setPage] = useState(0); // For pagination
  const [hasFetchedInitialInvoices, setHasFetchedInitialInvoices] = useState(false);

  const { logout, isAuthenticated, posProfile, currentUser, setPosProfile, apiKey, apiSecret, csrfToken, checkAnyOpenPOS } = useAuth();
  const router = useRouter();

  const fetchSalesInvoices = useCallback(async (currentPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const offset = currentPage * 20; // 20 items per page
      // Filter to show only POS invoices (invoices with pos_profile)aries.
      const url = `${FRAPPE_BASE_URL}/api/resource/Sales Invoice?filters=[["pos_profile","!=",null]]&limit=20&offset=${offset}`;

      const response = await authenticatedFetch(url, {
        method: "GET",
        apiKey,
        apiSecret,
        csrfToken,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSalesInvoices((prevInvoices) => [...prevInvoices, ...data.data]);
      setFilteredInvoices((prevInvoices) => [...prevInvoices, ...data.data]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, apiKey, apiSecret]); // Dependencies for useCallback

  useEffect(() => {
    const checkOpeningEntryAndShowSelector = async () => {
      if (!isAuthenticated || !currentUser) {
        // Redirect to Frappe login with current URL as return address
        redirectToFrappeLogin();
        return;
      }

      // If we have a POS profile, check if there's an opening entry
      if (posProfile) {
        try {
          const openEntry = await checkAnyOpenPOS(posProfile);
          if (openEntry && openEntry.isOpen) {
            // Opening entry exists, don't show selector
            setShowPosProfileSelector(false);
            setForceShowProfileSelector(false);
            if (!hasFetchedInitialInvoices) {
              fetchSalesInvoices(0);
              setHasFetchedInitialInvoices(true);
            }
          } else {
            // No opening entry, show selector
            setForceShowProfileSelector(true);
            setShowPosProfileSelector(true);
          }
        } catch (error) {
          console.error("Error checking opening entry:", error);
          // On error, show selector to be safe
          setForceShowProfileSelector(true);
          setShowPosProfileSelector(true);
        }
      } else {
        // No POS profile selected, show selector
        setForceShowProfileSelector(true);
        setShowPosProfileSelector(true);
      }
    };

    checkOpeningEntryAndShowSelector();
  }, [isAuthenticated, posProfile, currentUser, router, fetchSalesInvoices, hasFetchedInitialInvoices, checkAnyOpenPOS]);

  const handlePOSProfileSelect = async (profile: string) => {
    setPosProfile(profile); // Handled in POSProfileSelector, kept for consistency
    
    // Check if there's an opening entry for the selected profile
    try {
      const openEntry = await checkAnyOpenPOS(profile);
      if (openEntry && openEntry.isOpen) {
        // Opening entry exists, hide selector
        setShowPosProfileSelector(false);
        setForceShowProfileSelector(false);
        // Reset invoices and pagination when profile changes
        setSalesInvoices([]);
        setFilteredInvoices([]);
        setPage(0);
        setHasFetchedInitialInvoices(false);
      } else {
        // No opening entry, redirect to opening page
        router.push('/pos/opening');
      }
    } catch (error) {
      console.error("Error checking opening entry:", error);
      // On error, redirect to opening page to be safe
      router.push('/pos/opening');
    }
  };

  const handleSearch = () => {
    if (searchValue === "") {
      setFilteredInvoices(salesInvoices);
      return;
    }
    const filtered = salesInvoices.filter((invoice) => {
      const value = String(invoice[filterType]).toLowerCase();
      return value.includes(searchValue.toLowerCase());
    });
    setFilteredInvoices(filtered);
  };

  const handleClick = (path: string) => {
    router.push(path);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
    fetchSalesInvoices(page + 1);
  };

  return (
    <div className="bg-white min-h-screen p-2">
      <div className="my-20">
        <PageHeader
          title="POS"
          icon="../assets/icons/BriefcaseIcon.svg"
          posProfile={posProfile || undefined}
          rightButtons={
            <div className="flex flex-row space-x-2">
              <Button
                type="primary-button"
                size="button-medium"
                onClick={() => handleClick("/new_bill")}
              > + New OPD Sale Bill
              </Button>
              <Button
                type="primary-button"
                size="button-medium"
                onClick={() => handleClick("/ipd-bill")}
              > + New IPD Bill
              </Button>

              <Button
                type="secondary-button"
                size="button-medium"
                onClick={() => setShowPosProfileSelector(true)}
              >
                Change POS Profile
              </Button>

              <Button
                type="secondary-button"
                size="button-medium"
                onClick={logout}
              >
                Logout
              </Button>

            </div>

          }
        />
      </div>
      {loading && <p>Loading sales invoices...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <div className="w-full">
          <div className="flex flex-row space-x-2 my-2">
            <SelectInput
              data={selectOptions}
              value={filterType}
              onValueChange={(value) => setFilterType(value as string)}
              placeholder="Select Filter Type"
            />
            <SearchInput
              placeholder={`Search by ${filterType}`}
              arrayData={[]}
              onSelect={() => handleSearch()}
              handleServiceSearchChange={(value) => setSearchValue(value)}
            />
          </div>
          <DataTableComponent
            pageName="Sales Invoices"
            isRowSelectable
            searchPlaceholder="Search Sales Invoices"
            data={filteredInvoices}
            columns={[
              { accessorKey: "name", header: "Invoice ID" },
              { accessorKey: "posting_date", header: "Date" },
              { accessorKey: "customer", header: "Customer" },
              { accessorKey: "grand_total", header: "Grand Total" },
              { accessorKey: "status", header: "Status" },
            ]}
            columnNames={{
              name: "Invoice ID",
              posting_date: "Date",
              customer: "Customer",
              grand_total: "Grand Total",
              status: "Status",
            }}
            filterCount={0}
            onSearch={() => { }}
            onFilterClick={() => { }}
          />
          <div className="flex justify-center my-4">
            <Button
              type="secondary-button"
              size="button-medium"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </Button>
          </div>
        </div>
      )}
      {showPosProfileSelector && (
        <POSProfileSelector
          isOpen={showPosProfileSelector}
          onSelect={handlePOSProfileSelect}
        />
      )}
    </div>
  );
}