import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext"; // Adjust the import path as needed

import { FRAPPE_CONFIG } from "@/config/frappe";

const FRAPPE_BASE_URL = FRAPPE_CONFIG.BASE_URL;

// Cache keys for localStorage
const CACHE_KEYS = {
  WAREHOUSES: "frappe_cache_warehouses",
  BRANCHES: "frappe_cache_branches",
  KITS: "frappe_cache_kits",
  CLASSIFICATIONS: "frappe_cache_classifications",
  CUSTOMERS: "frappe_cache_customers",
  COMPANIES: "frappe_cache_companies",
  DEPARTMENTS: "frappe_cache_departments",
  LOCAL_BRANCHES: "frappe_cache_local_branches",
  SUB_DEPARTMENTS: "frappe_cache_sub_departments",
  DOCTORS: "frappe_cache_doctors",
  CACHE_TIMESTAMP: "frappe_cache_timestamp",
};

// Cache management functions
const getFromCache = (key: string): any[] | null => {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error(`Error reading cache for ${key}:`, error);
    return null;
  }
};

const saveToCache = (key: string, data: any[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(CACHE_KEYS.CACHE_TIMESTAMP, new Date().toISOString());
  } catch (error) {
    console.error(`Error saving cache for ${key}:`, error);
  }
};

export const clearAllCache = (): void => {
  if (typeof window === "undefined") return;
  try {
    Object.values(CACHE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
};

const buildFrappeApiUrl = (resource: string, fields: string[], filters?: any[]) => {
  const baseUrl = `${FRAPPE_BASE_URL}/api/resource/${encodeURIComponent(resource)}`;
  const params = new URLSearchParams();
  params.append("fields", JSON.stringify(fields));
  params.append("limit_page_length", "10000");
  if (filters && filters.length > 0) {
    params.append("filters", JSON.stringify(filters));
  }
  return `${baseUrl}?${params.toString()}`;
};
const makeFrappeApiCall = async (
  url: string,
  resourceName: string,
  apiKey: string,
  apiSecret: string,
  csrfToken?: string | null
) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (csrfToken) {
      headers["X-Frappe-CSRF-Token"] = csrfToken;
    }

    // Only add Authorization header if we have valid-looking keys
    // If the secret contains '*', it's likely masked by Frappe and invalid for autharies.
    const isMasked = (secret: string) => secret && secret.includes('***');

    if (apiKey && apiSecret && !isMasked(apiSecret)) {
      headers["Authorization"] = `token ${apiKey}:${apiSecret}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
      credentials: "include", // Crucial: send session cookies
      mode: "cors",
      cache: "no-cache",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`${resourceName} API Error Response:`, errorText);
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Authentication failed: ${response.status} - ${response.statusText}`);
      } else {
        throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
      }
    }

    const data = await response.json();

    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error("Invalid response format:", data);
      throw new Error("Invalid response format from API");
    }

    return data.data;
  } catch (error) {
    console.error(`Fetch ${resourceName} Error:`, error);
    throw error;
  }
};

// Custom hook to handle Frappe API calls with auth context and caching
export const useFrappeApi = () => {
  const { apiKey, apiSecret, currentUser, isInitialized, csrfToken } = useAuth();
  // We consider users authenticated if they have API keys OR if they have an active session (currentUser is set)aries.
  const isAuthenticated = isInitialized && (!!currentUser || (!!apiKey && !!apiSecret));

  // State to cache API results
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [kits, setKits] = useState<any[]>([]);
  const [classifications, setClassifications] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [localBranches, setLocalBranches] = useState<any[]>([]);
  const [subDepartments, setSubDepartments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const hasInitialized = useRef(false);


  // Fetch warehouses
  const fetchWarehouses = useCallback(async () => {
    // Check memory cache first
    if (warehouses.length > 0) {
      return warehouses;
    }

    // Check localStorage cache
    const cachedWarehouses = getFromCache(CACHE_KEYS.WAREHOUSES);
    if (cachedWarehouses && cachedWarehouses.length > 0) {
      setWarehouses(cachedWarehouses);
      return cachedWarehouses;
    }

    if (!isAuthenticated) {
      console.error("Not authenticated. Cannot fetch warehouses.");
      throw new Error("Authentication required to fetch warehouses.");
    }

    const WAREHOUSE_API_URL = `${FRAPPE_BASE_URL}/api/resource/Warehouse?fields=["name","warehouse_name"]&limit_page_length=10000`;

    try {
      const data = await makeFrappeApiCall(WAREHOUSE_API_URL, "Warehouses", apiKey!, apiSecret!, csrfToken);
      const warehouseData = data.map((warehouse: any) => ({
        name: warehouse.name,
        warehouse_name: warehouse.warehouse_name || warehouse.name,
        label: warehouse.warehouse_name || warehouse.name,
        value: warehouse.name,
      }));

      setWarehouses(warehouseData);
      saveToCache(CACHE_KEYS.WAREHOUSES, warehouseData);
      return warehouseData;
    } catch (error) {
      let errorMessage = "Error loading warehouses";
      if (error instanceof Error) {
        if (error.message.includes("401") || error.message.includes("unauthorized")) {
          errorMessage = "Invalid API credentials.";
        } else if (error.message.includes("403") || error.message.includes("forbidden")) {
          errorMessage = "Insufficient permissions.";
        } else if (error.message.includes("CORS")) {
          errorMessage = "Cross-origin request blocked.";
        } else if (error.message.includes("Network")) {
          errorMessage = "Network error.";
        } else {
          errorMessage = `${error.message}.`;
        }
      }
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, [isAuthenticated, apiKey, apiSecret, warehouses, isInitialized]);

  // Fetch branches
  const fetchBranches = useCallback(async () => {
    // Check memory cache first
    if (branches.length > 0) {
      return branches;
    }

    // Check localStorage cache
    const cachedBranches = getFromCache(CACHE_KEYS.BRANCHES);
    if (cachedBranches && cachedBranches.length > 0) {
      setBranches(cachedBranches);
      return cachedBranches;
    }

    if (!isAuthenticated) {
      console.error("Not authenticated. Cannot fetch branches.");
      throw new Error("Authentication required to fetch branches.");
    }

    const BRANCH_API_URL = `${FRAPPE_BASE_URL}/api/resource/Branch?fields=["name"]&limit_page_length=10000`;

    try {
      const data = await makeFrappeApiCall(BRANCH_API_URL, "Branches", apiKey!, apiSecret!, csrfToken);
      const branchData = data.map((branch: any) => ({
        name: branch.name,
        label: branch.name,
        value: branch.name,
      }));

      setBranches(branchData);
      saveToCache(CACHE_KEYS.BRANCHES, branchData);
      return branchData;
    } catch (error) {
      let errorMessage = "Error loading branches";
      if (error instanceof Error) {
        if (error.message.includes("401") || error.message.includes("unauthorized")) {
          errorMessage = "Invalid API credentials.";
        } else if (error.message.includes("403") || error.message.includes("forbidden")) {
          errorMessage = "Insufficient permissions.";
        } else if (error.message.includes("CORS")) {
          errorMessage = "Cross-origin request blocked.";
        } else if (error.message.includes("Network")) {
          errorMessage = "Network error.";
        } else {
          errorMessage = `${error.message}.`;
        }
      }
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, [isAuthenticated, apiKey, apiSecret, branches]);

  // Fetch kits
  const fetchKits = useCallback(async () => {
    if (!isAuthenticated) {
      console.error("Not authenticated. Cannot fetch kits.");
      throw new Error("Authentication required to fetch kits.");
    }

    if (kits.length > 0) {
      return kits;
    }

    const PRODUCT_BUNDLE_API_URL = `${FRAPPE_BASE_URL}/api/resource/Product Bundle?fields=["name","new_item_code","disabled"]&filters=[["disabled","!=",1]]`;

    try {
      const data = await makeFrappeApiCall(PRODUCT_BUNDLE_API_URL, "Product Bundles", apiKey!, apiSecret!, csrfToken);
      const kitData = data.map((kit: any) => ({
        name: kit.name,
        new_item_code: kit.new_item_code || kit.name,
        label: kit.name,
        value: kit.name,
      }));

      setKits(kitData);
      return kitData;
    } catch (error) {
      let errorMessage = "Error loading kits";
      if (error instanceof Error) {
        if (error.message.includes("401") || error.message.includes("unauthorized")) {
          errorMessage = "Invalid API credentials.";
        } else if (error.message.includes("403") || error.message.includes("forbidden")) {
          errorMessage = "Insufficient permissions.";
        } else if (error.message.includes("CORS")) {
          errorMessage = "Cross-origin request blocked.";
        } else if (error.message.includes("Network")) {
          errorMessage = "Network error.";
        } else {
          errorMessage = `${error.message}.`;
        }
      }
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, [isAuthenticated, apiKey, apiSecret, kits]);

  // Fetch classifications
  const fetchClassifications = useCallback(async () => {
    if (!isAuthenticated) {
      console.error("Not authenticated. Cannot fetch classifications.");
      throw new Error("Authentication required to fetch classifications.");
    }

    if (classifications.length > 0) {
      return classifications;
    }

    const CLASSIFICATION_API_URL = buildFrappeApiUrl("Classification", ["name"]);

    try {
      const data = await makeFrappeApiCall(CLASSIFICATION_API_URL, "Classifications", apiKey!, apiSecret!, csrfToken);
      const classificationData = data.map((classification: any) => ({
        name: classification.name,
        label: classification.name,
        value: classification.name,
      }));

      setClassifications(classificationData);
      return classificationData;
    } catch (error) {
      let errorMessage = "Error loading classifications";
      if (error instanceof Error) {
        if (error.message.includes("401") || error.message.includes("unauthorized")) {
          errorMessage = "Invalid API credentials.";
        } else if (error.message.includes("403") || error.message.includes("forbidden")) {
          errorMessage = "Insufficient permissions.";
        } else if (error.message.includes("CORS")) {
          errorMessage = "Cross-origin request blocked.";
        } else if (error.message.includes("Network")) {
          errorMessage = "Network error.";
        } else {
          errorMessage = `${error.message}.`;
        }
      }
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, [isAuthenticated, apiKey, apiSecret, classifications]);

  // Fetch customers
  const fetchCustomer = useCallback(async () => {
    if (!isAuthenticated) {
      console.error("Not authenticated. Cannot fetch Customer.");
      throw new Error("Authentication required to fetch Customer.");
    }

    if (customers.length > 0) {
      return customers;
    }

    const CUSTOMER_API_URL = buildFrappeApiUrl("Customer", ["name", "custom_is_self_paid"]);

    try {
      const data = await makeFrappeApiCall(CUSTOMER_API_URL, "Customer", apiKey!, apiSecret!, csrfToken);
      const customerData = data.map((customer: any) => ({
        name: customer.name,
        label: customer.name,
        value: customer.name,
        isSelfPaid: Boolean(customer.custom_is_self_paid),
      }));
      setCustomers(customerData);
      return customerData;
    } catch (error) {
      let errorMessage = "Error loading customers";
      if (error instanceof Error) {
        if (error.message.includes("401") || error.message.includes("unauthorized")) {
          errorMessage = "Invalid API credentials.";
        } else if (error.message.includes("403") || error.message.includes("forbidden")) {
          errorMessage = "Insufficient permissions.";
        } else if (error.message.includes("CORS")) {
          errorMessage = "Cross-origin request blocked.";
        } else if (error.message.includes("Network")) {
          errorMessage = "Network error.";
        } else {
          errorMessage = `${error.message}.`;
        }
      }
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, [isAuthenticated, apiKey, apiSecret, customers]);

  // Fetch companies
  const fetchCompany = useCallback(async () => {
    if (!isAuthenticated) {
      console.error("Not authenticated. Cannot fetch Company.");
      throw new Error("Authentication required to fetch Company.");
    }

    if (companies.length > 0) {
      return companies;
    }

    const COMPANY_API_URL = buildFrappeApiUrl("Company", ["name"]);

    try {
      const data = await makeFrappeApiCall(COMPANY_API_URL, "Company", apiKey!, apiSecret!, csrfToken);
      const companyData = data.map((company: any) => ({
        name: company.name,
        label: company.name,
        value: company.name,
      }));
      setCompanies(companyData);
      return companyData;
    } catch (error) {
      let errorMessage = "Error loading companies";
      if (error instanceof Error) {
        if (error.message.includes("401") || error.message.includes("unauthorized")) {
          errorMessage = "Invalid API credentials.";
        } else if (error.message.includes("403") || error.message.includes("forbidden")) {
          errorMessage = "Insufficient permissions.";
        } else if (error.message.includes("CORS")) {
          errorMessage = "Cross-origin request blocked.";
        } else if (error.message.includes("Network")) {
          errorMessage = "Network error.";
        } else {
          errorMessage = `${error.message}.`;
        }
      }
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, [isAuthenticated, apiKey, apiSecret, companies]);

  // Fetch branches (local)
  const fetchBranch = useCallback(async () => {
    if (localBranches.length > 0) {
      return localBranches;
    }

    const BRANCH_API_URL = buildFrappeApiUrl("Branch", ["name", "custom_hospital_id"]);

    try {
      const data = await makeFrappeApiCall(BRANCH_API_URL, "Branch", apiKey!, apiSecret!, csrfToken);
      const branchData = data.map((branch: any) => ({
        name: branch.name,
        label: branch.name,
        value: branch.name,
        custom_hospital_id: branch.custom_hospital_id,
      }));

      setLocalBranches(branchData);
      return branchData;
    } catch (error) {
      let errorMessage = "Error loading branches";
      if (error instanceof Error) {
        if (error.message.includes("401") || error.message.includes("unauthorized")) {
          errorMessage = "Invalid API credentials.";
        } else if (error.message.includes("403") || error.message.includes("forbidden")) {
          errorMessage = "Insufficient permissions.";
        } else if (error.message.includes("CORS")) {
          errorMessage = "Cross-origin request blocked.";
        } else if (error.message.includes("Network")) {
          errorMessage = "Network error.";
        } else {
          errorMessage = `${error.message}.`;
        }
      }
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, [isAuthenticated, apiKey, apiSecret, localBranches, isInitialized]);

  // Fetch departments
  const fetchDepartment = useCallback(async () => {
    if (!isAuthenticated) {
      console.error("Not authenticated. Cannot fetch departments.");
      throw new Error("Authentication required to fetch departments.");
    }

    if (departments.length > 0) {
      return departments;
    }

    const DEPARTMENT_API_URL = `${FRAPPE_BASE_URL}/api/resource/Department?fields=["name"]&filters=[["custom_is_store","=",1]]`;

    try {
      const data = await makeFrappeApiCall(DEPARTMENT_API_URL, "Departments", apiKey!, apiSecret!, csrfToken);
      const departmentData = data.map((department: any) => ({
        name: department.name,
        department_name: department.name,
        label: department.name,
        value: department.name,
      }));

      setDepartments(departmentData);
      return departmentData;
    } catch (error) {
      let errorMessage = "Error loading departments";
      if (error instanceof Error) {
        if (error.message.includes("401") || error.message.includes("unauthorized")) {
          errorMessage = "Invalid API credentials.";
        } else if (error.message.includes("403") || error.message.includes("forbidden")) {
          errorMessage = "Insufficient permissions.";
        } else if (error.message.includes("CORS")) {
          errorMessage = "Cross-origin request blocked.";
        } else if (error.message.includes("Network")) {
          errorMessage = "Network error.";
        } else {
          errorMessage = `${error.message}.`;
        }
      }
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, [isAuthenticated, apiKey, apiSecret, departments]);

  // Fetch sub-departments
  const fetchSubDepatment = useCallback(async () => {
    if (!isAuthenticated) {
      console.error("Not authenticated. Cannot fetch SubDepartment.");
      throw new Error("Authentication required to fetch Department.");
    }

    if (subDepartments.length > 0) {
      return subDepartments;
    }

    const SUB_DEPARTMENT_API_URL = buildFrappeApiUrl("Department", ["name"]);

    try {
      const data = await makeFrappeApiCall(SUB_DEPARTMENT_API_URL, "Sub Department", apiKey!, apiSecret!, csrfToken);
      const subdepartmentData = data.map((subDepartment: any) => ({
        name: subDepartment.name,
        label: subDepartment.name,
        value: subDepartment.name,
      }));

      setSubDepartments(subdepartmentData);
      return subdepartmentData;
    } catch (error) {
      let errorMessage = "Error loading sub-departments";
      if (error instanceof Error) {
        if (error.message.includes("401") || error.message.includes("unauthorized")) {
          errorMessage = "Invalid API credentials.";
        } else if (error.message.includes("403") || error.message.includes("forbidden")) {
          errorMessage = "Insufficient permissions.";
        } else if (error.message.includes("CORS")) {
          errorMessage = "Cross-origin request blocked.";
        } else if (error.message.includes("Network")) {
          errorMessage = "Network error.";
        } else {
          errorMessage = `${error.message}.`;
        }
      }
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, [isAuthenticated, apiKey, apiSecret, subDepartments]);

  // Fetch user default company
  const fetchUserDefaultCompany = useCallback(async () => {
    if (!isAuthenticated) {
      console.error("Not authenticated. Cannot fetch user default company.");
      throw new Error("Authentication required to fetch user default company.");
    }

    const url = `${FRAPPE_BASE_URL}/api/method/quantbit_hims_integration.api.pos_api.get_user_default_company`;

    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      if (csrfToken) {
        headers['X-Frappe-CSRF-Token'] = csrfToken;
      }

      const isMasked = (secret: string) => secret && secret.includes('***');
      if (apiKey && apiSecret && !isMasked(apiSecret)) {
        headers['Authorization'] = `token ${apiKey}:${apiSecret}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.message || null;
    } catch (error) {
      console.error('Error fetching user default company:', error);
      return null;
    }
  }, [isAuthenticated, apiKey, apiSecret]);

  // Fetch warehouse for sub-department
  const fetchWarehouseForSubdepartment = useCallback(async (subDepartment: string) => {
    if (!isAuthenticated) {
      console.error("Not authenticated. Cannot fetch warehouse for sub-department.");
      throw new Error("Authentication required to fetch warehouse for sub-department.");
    }

    const url = `${FRAPPE_BASE_URL}/api/method/quantbit_hims_integration.quantbit_hims_integration.api.get_warehouse_for_subdepartment`;

    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      const isMasked = (secret: string) => secret && secret.includes('***');
      if (apiKey && apiSecret && !isMasked(apiSecret)) {
        headers['Authorization'] = `token ${apiKey}:${apiSecret}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify({ sub_department: subDepartment }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.message?.warehouse || null;
    } catch (error) {
      console.error(`Error fetching warehouse for sub-department ${subDepartment}:`, error);
      return null;
    }
  }, [isAuthenticated, apiKey, apiSecret]);

  // Fetch doctors
  const fetchDoctors = useCallback(async (branch: string) => {
    if (!isAuthenticated) {
      console.warn("Not authenticated. Cannot fetch doctors.");
      return [];
    }

    if (!branch) {
      console.warn("Branch not selected. Cannot fetch doctors.");
      setDoctors([]);
      return [];
    }

    let actualBranch = branch;
    if (branch.includes("Department")) {
      console.warn("Department name passed instead of hospital ID. This may cause API errors.");
      actualBranch = branch;
    }

    const url = `${FRAPPE_BASE_URL}/api/method/quantbit_hims_integration.quantbit_hims_integration.doctor_api.get_doctor_list`;

    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      const isMasked = (secret: string) => secret && secret.includes('***');
      if (apiKey && apiSecret && !isMasked(apiSecret)) {
        headers['Authorization'] = `token ${apiKey}:${apiSecret}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify({ branch: actualBranch }),
      });

      if (!response.ok) {
        console.warn(`Fetch doctors returned status: ${response.status}`);
        setDoctors([]);
        return [];
      }

      const data = await response.json();
      const items = data?.message?.data?.items || data?.message?.items || [];
      const doctorData = items.map((doctor: any) => ({
        name: doctor.value || doctor.name || doctor.doctor_name || '',
        label: doctor.value || doctor.label || doctor.doctor_name || '',
        value: doctor.value || doctor.name || doctor.doctor_name || '',
      })).filter((d: any) => Boolean(d.value));

      setDoctors(doctorData);
      return doctorData;
    } catch (error) {
      console.error(`Error fetching doctors for branch ${actualBranch}:`, error);
      setDoctors([]);
      return [];
    }
  }, [isAuthenticated, apiKey, apiSecret]);

  // Automatically fetch data on mount if authenticated
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     fetchWarehouses();
  //     fetchBranches();
  //     fetchKits();
  //     fetchClassifications();
  //     fetchCustomer();
  //     fetchBranch();
  //     fetchCompany();
  //     fetchDepartment();
  //     fetchSubDepatment();
  //   }
  // }, [isAuthenticated, fetchWarehouses, fetchBranches, fetchKits, fetchClassifications, fetchCustomer, fetchCompany, fetchBranch, fetchDepartment, fetchSubDepatment]);


  useEffect(() => {
    if (!isAuthenticated) return;
    if (hasInitialized.current) return;

    hasInitialized.current = true;

    fetchWarehouses();
    fetchBranches();
    fetchKits();
    fetchClassifications();
    fetchCustomer();
    fetchBranch();
    fetchCompany();
    fetchDepartment();
    fetchSubDepatment();
  }, [isAuthenticated]);

  return {
    fetchWarehouses,
    fetchBranches,
    fetchKits,
    fetchClassifications,
    fetchCustomer,
    fetchCompany,
    fetchBranch,
    fetchDepartment,
    fetchSubDepatment,
    fetchUserDefaultCompany,
    fetchWarehouseForSubdepartment,
    fetchDoctors,
    buildFrappeApiUrl,
    clearAllCache,
    warehouses,
    branches,
    kits,
    classifications,
    companies,
    customers,
    localBranches,
    departments,
    subDepartments,
    doctors
  };
};