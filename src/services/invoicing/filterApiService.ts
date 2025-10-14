import { 
  FilterApiResponse, 
  FilterOption
} from '@/sections/invoicing/tableData';
import { API_TENANT } from '@/utils/constants';

// Generic filter API service
export class FilterApiService {
  private static baseUrl = process.env.NEXT_PUBLIC_BASEAPI_URL!;
  private static tenant = API_TENANT;

  // Generic method to fetch filter options
  private static async fetchFilterOptions<T>(endpoint: string): Promise<T[]> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
          'tenant': this.tenant,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: FilterApiResponse<FilterOption> = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'API returned an error');
      }

      return result.data.items as T[];
    } catch (error) {
      throw error;
    }
  }

  // Get Bill Status options
  static async getBillStatusOptions(): Promise<FilterOption[]> {
    return this.fetchFilterOptions<FilterOption>('/api/v1/Invoicing/GetBillStatusType');
  }

  // Get Bill Type options
  static async getBillTypeOptions(): Promise<FilterOption[]> {
    return this.fetchFilterOptions<FilterOption>('/api/v1/Invoicing/GetBillTypeEnum');
  }

  // Get Company options
  static async getCompanyOptions(): Promise<FilterOption[]> {
    return this.fetchFilterOptions<FilterOption>('/api/v1/Invoicing/PatientCompanies');
  }

  // Get Associate Company options
  static async getAssociateCompanyOptions(): Promise<FilterOption[]> {
    return this.fetchFilterOptions<FilterOption>('/api/v1/Invoicing/AssociateCompanies');
  }

  // Get Group By options
  static async getGroupByOptions(): Promise<FilterOption[]> {
    return this.fetchFilterOptions<FilterOption>('/api/v1/Invoicing/GetGroupByEnum');
  }

  // Transform filter options to LabelValue format for UI components
  static transformToLabelValue(options: FilterOption[]): Array<{ label: string; value: string }> {
    return options.map(option => ({
      label: option.value,
      value: option.key,
    }));
  }

  // Get all filter options at once
  static async getAllFilterOptions() {
    try {
      const [billStatus, billType, companies, associateCompanies, groupBy] = await Promise.all([
        this.getBillStatusOptions(),
        this.getBillTypeOptions(),
        this.getCompanyOptions(),
        this.getAssociateCompanyOptions(),
        this.getGroupByOptions(),
      ]);

      return {
        billStatus: this.transformToLabelValue(billStatus),
        billType: this.transformToLabelValue(billType),
        companies: this.transformToLabelValue(companies),
        associateCompanies: this.transformToLabelValue(associateCompanies),
        groupBy: this.transformToLabelValue(groupBy),
      };
    } catch (error) {
      throw error;
    }
  }
}
