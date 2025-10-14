import { KVPair } from "@/api-client";

export type TaxDtoRequest= {
    startDate: string;
    endDate: string;
    createdByList: Array<string>;
    modifiedByList:Array<string>;
    taxType: Array<number>;
    status:Array<number>;
    searchTerm: string;
    page: number;
    pageSize: number;
  } 

export type TaxItems=
{
    taxId: string;
    taxName: string;
    taxType: string;
    taxPercentage: number;
    status: string;
    modifiedOn:string;
    modifiedBy: string;
    createdDate:string;
    createdBy: string;
}

export type TaxResponse=
{
    data: {
      items: Array<TaxItems>
      metadata: {
        page:{
        currentPage: number;
        pageSize: number;
        totalPages: number;
        }
      }
    },
   
    isError: boolean,
    errorMessage: string| null,
    validationErrors: string|null,
    errorCode:string|null
  }

export type TaxSave ={
    model: {
      id: string;
      name: string;
      taxcode: number;
      isBlock: boolean|undefined;
      cesspercentage:number
      taxDetails:Array<taxDetails>;
    }
  }


  export type TaxByIdResponse = {
  data: {
    id: string;
    name: string;
    taxcode: number;
    isBlock: boolean;
    taxpercentage: number;
    cesspercentage: number;
    taxDetails:Array<taxDetails>;
  };
  isError: boolean;
  errorMessage: string | null;
  validationErrors: string | null;
  errorCode: string | null;
};

export type taxDetails={
    id: string|number,
    gsttaxid: string,
    taxpercentage: number,
    cesspercentage: number,
    applicabledate:string,
    cgstpercentage: number,
    cgstcesspercentage: number,
    sgstpercentage: number,
    sgstcesspercentage: number,
    igstpercentage: number,
    igstcesspercentage: number
}

export type DeleteTax={
    model: {
      id:Array<string>
    }
  }
export type TaxTypes={
    data: {
      items:Array<KVPair>;
    },
    isError: boolean;
    errorMessage: string|null;
    validationErrors: string|null;
    errorCode: string|null;
  }

  export type CreatedBy={
    data: {
      items: Array<KVPair>;
    },
    isError: boolean;
    errorMessage: string|null;
    validationErrors: string|null;
    errorCode: string|null;
  }
  export type ModifiedbyUser=
  { data: 
    {
    items:Array<KVPair>;
  },
  isError: boolean;
  errorMessage: string|null;
  validationErrors: string|null;
  errorCode: string|null;
}