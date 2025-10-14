/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { ServiceGroupListResponseDto } from './ServiceGroupListResponseDto';
export type ServiceGroupListResponseDtoListResultModel = {
    items?: Array<ServiceGroupListResponseDto> | null;
    metadata: {
        page: {
          currentPage: number;
          pageSize: number;
          totalPages: number;
        }
      }
};

