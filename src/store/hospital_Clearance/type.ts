import { DepartmentClearanceItem } from '@/services/api-client/services/HospitalClearanceService';
import { CommonResponse } from '@/services/api-client/models/DoctorDto';

export interface HospitalClearanceState {
  departmentClearance: DepartmentClearanceItem[];
  metadata: {
    page: {
      currentPage: number;
      pageSize: number;
      totalPages: number;
    };
  };
  loading: boolean;
  error: string | null;
  hospital:CommonResponse
}
