// Utility for fetching user default branch
// import { useAuth } from "@/context/AuthContext";

export async function fetchUserDefaultBranch(apiKey: string, apiSecret: string) {
  const url = "https://demohims.quantcloud.in/api/method/quantbit_hims_integration.api.pos_api.get_user_default_branch";
  const authHeader = `token ${apiKey}:${apiSecret}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": authHeader,
    },
    credentials: "include"
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  return data.message || null;
}
