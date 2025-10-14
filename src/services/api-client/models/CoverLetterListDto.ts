/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type CoverLetterListDto = {
    companyid: string,
    templateid: string,
    companyName: string,
    templateName: string,
    modifiedOn: string,
    modifiedBy: string,
    createdOn: string,
    createdBy: string
};
 export  type  CoverLetterListDtoResponse= {
    data: {
      items: CoverLetterListDto[],
      metadata: {
        page: {
          currentPage: 0,
          pageSize: 0,
          totalPages: 0
        }
      }
    },
    isError: boolean,
    errorMessage: string;
    validationErrors: [ { field: string,message: string}];
    errorCode: string;
  }
