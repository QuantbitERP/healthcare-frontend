"use client";

import React, { useCallback, useEffect, useState, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";


// Redux
import type { AppDispatch, RootState } from "@/store";
import {
  fetchPaymentTypes,
  fetchCompanyList,
  fetchPaymentReceipts,
} from "@/store/payments_received/thunks";
import type { Payment } from "@/store/payments_received/types";

// UI Components
import Alerts from "@/components/alerts/Alerts";
import PageHeader from "@/components/PageHeader";
import ScoreCard from "./ScoreCard";
import { DataTable } from "./data-table";
import { Columns } from "./TableColumns";

// Date Picker
import type { DateRange } from "react-day-picker";


type AlertType = "cancel" | "submit" | false | null;

function BillingTable(): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.paymentReceived.paymentReceipts);
  const [meMode, setMeMode] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filteredData, setFilteredData] = useState<Payment[]>([]);
  const [alertType, setAlertType] = useState<AlertType>(null);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const memoizedSetFilteredData = useCallback(
    (data: Payment[] | ((prev: Payment[]) => Payment[])) => {
      setFilteredData(data);
    },
    []
  );
  // useEffect(() => {
  //   if (meMode) {
  //     const filteredByMe = receiptData.filter(
  //       (item) => item.modifiedBy === "Me" && item.createdBy === "Me"
  //     );
  //     setFilteredData(filteredByMe);
  //   } else {
  //     setFilteredData(receiptData);
  //   }
  // }, [meMode, receiptData]);

  useEffect(() => {
    dispatch(
      fetchPaymentTypes({
        version: "1",
        tenant: "",
      })
    );
    dispatch(
      fetchCompanyList({
        version: "1",
        tenant: "",
      })
    );
    dispatch(
      fetchPaymentReceipts({
        version: "1",
        tenant: "",
      })
    );
  }, [dispatch]);
  return (
    <div className="flex flex-col w-full mb-4">
      <PageHeader
        title="Patient/Company Receipt"
        icon="assets/icons/receipt-rupee.svg"
        rightButtons={
          <button
            onClick={() => router.push("/new_receipt")}
            className={`bg-primary text-white flex space-x-sm rounded-lg px-md py-sm hover:bg-primary-hover font-medium text-sm items-center cursor-pointer`}
          >
            <Image
              src={"assets/icons/LeadingIcon.svg"}
              alt="CreateBill icon"
              width={16}
              height={16}
            />
            New Receipt
          </button>
        }
      />

      <div className="w-full mx-auto mt-15">
        <div
          className={`
            mx-2 transition-transform ease-in-out duration-500 
            ${alertType ? "" : "h-0"}
          `}
        >
          {alertType === "cancel" && (
            <Alerts
              variant="success"
              heading="Success!"
              content="Bill Cancelled"
              open={true}
              onClick={undefined}
              className={undefined}
            />
          )}
          {alertType === "submit" && (
            <Alerts
              variant="success"
              heading="Submitted!"
              content="#BI10011006 Bill Submitted Succesfully."
              open={true}
              showButton
              buttonText="Assign a Patient"
              onClick={undefined}
              className={undefined}
            />
          )}
        </div>
        <div className="px-4">
          <ScoreCard date={date} />

          <div className="table-wrapper">
            <DataTable
              columns={Columns()}
              data={data}
              meModeProps={{ checked: meMode, setChecked: setMeMode }}
              dateProps={{ date, setDate }}
              setFilteredData={memoizedSetFilteredData}
              alertProps={{ alertType, setAlertType }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillingTable;
