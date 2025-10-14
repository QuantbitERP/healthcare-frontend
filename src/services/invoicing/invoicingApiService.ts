import { InvoicingApiRequest, InvoicingApiResponse, InvoicingApiItem, TableDataType, InvoiceDetailsResponse, SubmitBillRequest, SubmitBillResponse, CoverLetterResponse, CoverLetterContentResponse, BillCountsRequest, BillCountsResponse } from '@/sections/invoicing/tableData';

// Delete request type
export interface DeleteInvoicingRequest {
  model: {
    ids: string[];
  };
}

export interface DeleteInvoicingResponse {
  data: any;
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any;
  errorCode: string | null;
}
import { API_VERSION, API_TENANT } from '@/utils/constants';

// Transform API response to match our table data structure
export const transformApiResponseToTableData = (apiItem: InvoicingApiItem): TableDataType => {
  return {
    id: apiItem.invId,
    invId: apiItem.invId,
    priorAuthId: apiItem.priorAuthId,
    billId: apiItem.billId,
    billNo: apiItem.billNo,
    patient: apiItem.patientName?.trim() || '',
    authId: apiItem.preAuthNo || '',
    uhid: apiItem.uhid,
    company: apiItem.company || '',
    associateCompany: apiItem.associateCompany || '',
    billType: apiItem.billType as "OPD" | "IPD",
    billStatus: apiItem.status as "Pending" | "Submitted",
    claimSendNo: apiItem.claimSendNo || '-',
    submittedBy: apiItem.submittedBy || '-',
    companyAmount: apiItem.companyAmount || 0,
    patientAmount: apiItem.patientAmount || 0,
    referralLetterNo: apiItem.referralLetterNo || '-',
    modifiedOn: apiItem.modifiedOn || '',
    priorAuthDoneBy: apiItem.priorAuthDoneBy || '',
    billFinalizedBy: apiItem.billFinalizedBy || '',
    submitDate: apiItem.submitDate || '',
    billAmount: apiItem.billAmount || 0,
    billDateandTime: apiItem.billDateandTime || undefined,
    preAuthNo: apiItem.preAuthNo,
    companyId: apiItem.companyId,
  };
};

// API Service for Invoicing
export class InvoicingApiService {
  private static version = API_VERSION;
  private static tenant = API_TENANT;

  // Get invoicing list with filters
  static async getInvoicingList(request: InvoicingApiRequest): Promise<{
    data: TableDataType[];
    metadata: {
      currentPage: number;
      pageSize: number;
      totalPages: number;
    };
  }> {
    try {
      const url = `${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/Invoicing/list`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'text/plain',
          'tenant': this.tenant,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: InvoicingApiResponse = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'API returned an error');
      }

      // Transform API data to table data format
      const transformedData = result.data.items.map(transformApiResponseToTableData);

      return {
        data: transformedData,
        metadata: {
          currentPage: result.data.metadata.page.currentPage,
          pageSize: result.data.metadata.page.pageSize,
          totalPages: result.data.metadata.page.totalPages,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Get default request object - defaults to current date
  static getDefaultRequest(): InvoicingApiRequest {
    const now = new Date();

    return {
      startDate: now.toISOString(),
      endDate: now.toISOString(),
      searchTerm: '',
      companyList: [],
      associateCompanyList: [],
      billStatus: [],
      billType: [],
      iscCverLetterAvailable: true,
      pageNumber: 1,
      pageSize: 100,
    };
  }

  // Build request from filters
  static buildRequestFromFilters(filters: {
    searchTerm?: string;
    startDate?: string;
    endDate?: string;
    billStatus?: string[];
    billType?: string[];
    company?: string[];
    associateCompany?: string[];
    isCoverLetterAvailable?: boolean;
    pageNumber?: number;
    pageSize?: number;
  }): InvoicingApiRequest {
    const defaultRequest = this.getDefaultRequest();
    
    return {
      ...defaultRequest,
      searchTerm: filters.searchTerm || '',
      startDate: filters.startDate || defaultRequest.startDate,
      endDate: filters.endDate || defaultRequest.endDate,
      billStatus: filters.billStatus || [],
      billType: filters.billType || [],
      companyList: filters.company || [],
      associateCompanyList: filters.associateCompany || [],
      iscCverLetterAvailable: filters.isCoverLetterAvailable || true,
      pageNumber: filters.pageNumber || 1,
      pageSize: filters.pageSize || 100,
    };
  }

  // Get invoice details by ID
  static async getInvoiceDetails(invoiceId: string): Promise<InvoiceDetailsResponse['data']> {
    try {
      const url = `${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/Invoicing/${invoiceId}`;
      
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

      const result: InvoiceDetailsResponse = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'API returned an error');
      }

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  // Submit bills
  static async submitBills(requestBody: SubmitBillRequest): Promise<SubmitBillResponse['data']> {
    try {
      const url = `${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/Invoicing`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
          'tenant': this.tenant,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: SubmitBillResponse = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'API returned an error');
      }

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete invoicing items
  static async deleteInvoicingItems(requestBody: DeleteInvoicingRequest): Promise<DeleteInvoicingResponse['data']> {
    try {
      const url = `${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/Invoicing`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
          'tenant': this.tenant,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: DeleteInvoicingResponse = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'API returned an error');
      }

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  // Get cover letters
  static async getCoverLetters(): Promise<CoverLetterResponse['data']> {
    try {
      const url = `${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/Invoicing/GetCoverLetter`;
      
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

      const result: CoverLetterResponse = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'API returned an error');
      }

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  // Get cover letter content by ID
  static async getCoverLetterContent(coverLetterId: string): Promise<CoverLetterContentResponse['data']> {
    try {
      const url = `${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/CoverLetter/${coverLetterId}`;
      
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

      const result: CoverLetterContentResponse = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'API returned an error');
      }

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get bill counts for OPD and IPD by date range
   */
  static async getBillCounts(request: BillCountsRequest): Promise<BillCountsResponse['data']> {
    try {
      const url = `${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/Invoicing/GetCounts`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: BillCountsResponse = await response.json();

      if (result.isError) {
        throw new Error(result.errorMessage || 'API returned an error');
      }

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Export selected invoicing records to Excel
   */
  static async exportToExcel(invIds: string[]): Promise<Blob> {
    try {
      // For now, we'll use the first invId as per the curl example
      // In the future, this might need to be updated to handle multiple IDs
      const invId = invIds[0];
      
      if (!invId) {
        throw new Error('No invoice ID provided for export');
      }

      const url = `${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/Invoicing/generate-pdf/${invId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'tenant': this.tenant,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Print selected invoicing records
   */
  static async printInvoicingRecords(invIds: string[]): Promise<Blob[]> {
    try {
      if (!invIds || invIds.length === 0) {
        throw new Error('No invoice IDs provided for printing');
      }

      const printPromises = invIds.map(async (invId) => {
        const url = `${process.env.NEXT_PUBLIC_BASEAPI_URL}/api/v1/Invoicing/generate-pdf/${invId}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'accept': '*/*',
            'tenant': this.tenant,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} for invoice ${invId}`);
        }

        return await response.blob();
      });

      const blobs = await Promise.all(printPromises);
      return blobs;
    } catch (error) {
      throw error;
    }
  }
}
