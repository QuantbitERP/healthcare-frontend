"use client";
import {
  GetBillDetailsDTOResultModel,
  GetDraftBillByIdResponseDTOResultModel,
} from "@/api-client";
import { InsertReceiptPayment } from "@/services/api-client";
import { GetBillConcessionDetails } from "@/services/api-client/models/GetBillConcessionDetails";
import { GetBillReceiptPaymentDetails } from "@/services/api-client/models/GetBillReceiptPaymentDetails";
import { GetBillServices } from "@/services/api-client/models/GetBillServices";
import { ChargesEstimationSaveServiceDto } from "@/services/api-client/models/ChargesEstimationSaveServiceDto";
import React, { createContext, useContext, useState } from "react";

export interface TableRowType {
  billCompanyconcessionId: string;
  concessioncategoryid: string;
  applicationuserid: string;
  concessionamount: number;
  concessionPercent: string;
  concessionremark: string;
  id: string | number;
  tagText: string;
  totalamt: string;
}
export type RowData = {
  id: string;
  description: string;
  amount: number | null | undefined;
};

type Filters = {
  category: { id: string | null; value: string | null };
  company: { id: string | null; value: string | null };
  visitType: { id: string | null; value: string | null };
  referralDoctor: { id: string | null; value: string | null };
  billingClasses: { id: string | null; value: string | null };

  
  admissionDate: string | null;   
  dischargeDate: string | null;   
  noOfDays: number | null;      
  consultationDoctor: { id: string | null; value: string | null };
  estimationType: { id: number | null; value: string | null };
  diagnosisNote: string | null;
  remark: string | null;
};

const initialFilters: Filters = {
  category: { id: null, value: null },
  company: { id: null, value: null },
  visitType: { id: null, value: null },
  referralDoctor: { id: null, value: null },
  billingClasses: { id: null, value: null },

  admissionDate: new Date().toISOString(),
  dischargeDate: null,
  noOfDays: 0,
  consultationDoctor: { id: null, value: null },
  estimationType: { id: null, value: null },
  diagnosisNote: "",
  remark: "",
};


interface GlobalTablesContextType {
  patientBillConcession: GetBillConcessionDetails[];
  setPatientBillConcession: React.Dispatch<
    React.SetStateAction<GetBillConcessionDetails[]>
  >;
  resetPatientBillConcession: () => void;
  patientRecordPayment: GetBillReceiptPaymentDetails[];
  setPatientRecordPayment: React.Dispatch<
    React.SetStateAction<GetBillReceiptPaymentDetails[]>
  >;
  resetPatientBillRecordPayment: () => void;
  patientRecordPaymentInUpdate: InsertReceiptPayment[];
  setPatientRecordPaymentInUpdate: React.Dispatch<
    React.SetStateAction<InsertReceiptPayment[]>
  >;
  patientBalanceUtilized: RowData[];
  setPatientBalanceUtilized: React.Dispatch<React.SetStateAction<RowData[]>>;
  patientServicesTable: GetBillServices[];
  setPatientServicesTable: React.Dispatch<
    React.SetStateAction<GetBillServices[]>
  >;
  patientServicesTableInEstimation: ChargesEstimationSaveServiceDto[];
  setPatientServicesTableInEstimation: React.Dispatch<
    React.SetStateAction<ChargesEstimationSaveServiceDto[]>
  >;
  filtersValues: Filters;
  setFiltersValues: React.Dispatch<React.SetStateAction<Filters>>;
  resetFilterValues: () => void;
  billRemark: string;
  setBillRemark: React.Dispatch<React.SetStateAction<string>>;
  paidBy: { key: string; value: string } | null;
  setPaidBy: React.Dispatch<
    React.SetStateAction<{ key: string; value: string } | null>
  >;
  paidByName: string;
  setPaidByName: React.Dispatch<React.SetStateAction<string>>;
  sponsoredbyName: string;
  setSponsoredbyName: React.Dispatch<React.SetStateAction<string>>;
  pendingPaybleAmount: number;
  setPendingPaybleAmount: React.Dispatch<React.SetStateAction<number>>;
  remainingPaybleAmount: number;
  setRemainingPaybleAmount: React.Dispatch<React.SetStateAction<number>>;
  billDataInRedux?:
    | GetBillDetailsDTOResultModel
    | GetDraftBillByIdResponseDTOResultModel
    |null
  setBillDataInRedux: React.Dispatch<
    React.SetStateAction<
      | GetBillDetailsDTOResultModel
      | GetDraftBillByIdResponseDTOResultModel
      |null
    >
  >;
  billList: string[];
  setBillList: React.Dispatch<React.SetStateAction<string[]>>;
  gstID: {key: string | null;
    value: string | null;} | null;
  setGSTID: React.Dispatch<
  React.SetStateAction<{ key: string | null;
    value: string | null } | null>
>;
}

const GlobalTablesContext = createContext<GlobalTablesContextType | null>(null);

export const GlobalTablesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [patientBillConcession, setPatientBillConcession] = useState<
    GetBillConcessionDetails[]
  >([]);
  const resetPatientBillConcession = () => setPatientBillConcession([]);
  
  const [patientRecordPayment, setPatientRecordPayment] = useState<
    GetBillReceiptPaymentDetails[]
  >([]);
  const resetPatientBillRecordPayment = () => setPatientRecordPayment([]);
  const [patientRecordPaymentInUpdate, setPatientRecordPaymentInUpdate] = useState<
  InsertReceiptPayment[]
  >([]);
  const [patientBalanceUtilized, setPatientBalanceUtilized] = useState<
    RowData[]
  >([]);
  const [patientServicesTable, setPatientServicesTable] = useState<
    GetBillServices[]
  >([]);
  const [patientServicesTableInEstimation, setPatientServicesTableInEstimation] = useState<
    ChargesEstimationSaveServiceDto[]
  >([]);
  const [filtersValues, setFiltersValues] = useState<Filters>(initialFilters);
  const resetFilterValues = () => setFiltersValues(initialFilters);
  const [billRemark, setBillRemark] = useState<string>("");
  const [paidBy, setPaidBy] = useState<{ key: string; value: string } | null>(
    null
  );
  const [gstID, setGSTID] = useState<{ key: string | null;
    value: string | null } | null>(
    null
  );
  const [pendingPaybleAmount,setpendingPaybleAmount]=useState<number>(0);
  const [remainingPaybleAmount,setRemainingPaybleAmount]=useState<number>(0);
  const [paidByName, setPaidByName] = useState<string>("");
  const [sponsoredbyName, setSponsoredbyName] = useState<string>("");
  const [billDataInRedux, setBillDataInRedux] = useState<
    | GetBillDetailsDTOResultModel
    | GetDraftBillByIdResponseDTOResultModel
    | undefined
  >(undefined);
  const [billList, setBillList] = useState<string[]>([]);

  return (
    <GlobalTablesContext.Provider
      value={{
        pendingPaybleAmount,
        setPendingPaybleAmount: setpendingPaybleAmount,
        remainingPaybleAmount,
        setRemainingPaybleAmount,
        patientBillConcession,
        setPatientBillConcession,
        resetPatientBillConcession,
        resetPatientBillRecordPayment,
        resetFilterValues,
        patientRecordPayment,
        setPatientRecordPayment,
        patientRecordPaymentInUpdate,
        setPatientRecordPaymentInUpdate,
        patientBalanceUtilized,
        setPatientBalanceUtilized,
        patientServicesTable,
        setPatientServicesTable,
        patientServicesTableInEstimation,
        setPatientServicesTableInEstimation,
        filtersValues,
        setFiltersValues,
        billRemark,
        setBillRemark,
        paidBy,
        setPaidBy,
        paidByName,
        setPaidByName,
        sponsoredbyName,
        setSponsoredbyName,
        billDataInRedux,
        setBillDataInRedux: setBillDataInRedux as React.Dispatch<
          React.SetStateAction<
            | GetBillDetailsDTOResultModel
            | GetDraftBillByIdResponseDTOResultModel
            | null
          >
        >,
        billList,
        setBillList,
        gstID,
        setGSTID,
      
      }}
    >
      {children}
    </GlobalTablesContext.Provider>
  );
};

export const useGlobalTables = () => {
  const context = useContext(GlobalTablesContext);
  if (!context) {
    throw new Error(
      "useGlobalTables must be used within a GlobalTablesProvider"
    );
  }
  return context;
};
