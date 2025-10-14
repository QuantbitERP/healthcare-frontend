export interface KVPair {
    key: string;
    value: string;
  }
  
  export interface CommonDropdownState {
    countries: KVPair[];
    states: KVPair[];
    districts: KVPair[];
    cities: KVPair[];
    statuses: KVPair[];
    loading: boolean;
    error: string | null;
  }