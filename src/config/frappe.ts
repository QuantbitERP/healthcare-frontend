/**
 * Configuration for Frappe integration
 */

export const FRAPPE_CONFIG = {
    BASE_URL: "https://demohims.quantcloud.in",
    POS_NEW_BILL_PATH: "/pos/new_bill",
    LOGIN_PATH: "/login",
    API_PREFIX: "/api",
} as const;

export const FRAPPE_BASE_URL = FRAPPE_CONFIG.BASE_URL;

export const getFullUrl = (path: string) => {
    return `${FRAPPE_CONFIG.BASE_URL}${path}`;
};
