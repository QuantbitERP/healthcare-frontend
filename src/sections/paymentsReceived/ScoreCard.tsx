"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { DateRange } from "react-day-picker";

import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux"; // adjust this path
import { fetchCountSummary } from "@/store/payments_received/thunks";
import { AppDispatch, RootState } from "@/store";

type ScoreSubfield = {
  label: string;
  value: string | undefined;
};

type ScoreDataItem = {
  label: string;
  subfields: ScoreSubfield[];
};

type ScoreCardProps = {
  date: DateRange | undefined;
};

const ScoreCard: React.FC<ScoreCardProps> = ({ date }) => {

  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector(
    (state: RootState) => state.paymentReceived.countSummary
  );

  useEffect(() => {
    dispatch(fetchCountSummary({ version: "1",tenant: "", startDate: "2025-07-01", endDate: "2025-07-14" }));
  }, [dispatch]);
  console.log(data);
  const scoreData: ScoreDataItem[] = [
    {
      label: "Total Collection",
      subfields: [
        { label: "Patient", value: data?.totalCollectionPatient !== undefined ? String(data.totalCollectionPatient) : undefined },
        { label: "Company", value: data?.totalCollectionCompany !== undefined ? String(data.totalCollectionCompany) : undefined },
        { label: "Total", value: data?.totalCollection !== undefined ? String(data.totalCollection) : undefined },
      ],
    },
    {
      label: "No. of Receipts",
      subfields: [
        { label: "Patient", value: data?.receiptsPatient !== undefined ? String(data.receiptsPatient) : undefined },
        { label: "Company", value: data?.receiptsCompany !== undefined ? String(data.receiptsCompany) : undefined },
        { label: "Total", value: data?.totalReceipts !== undefined ? String(data.totalReceipts) : undefined },
      ],
    },
  ];

  // Placeholder for filtered data on a date range — you should compute this as needed
  const filteredScoreData: ScoreDataItem[] = scoreData;

  const isSameDay =
    date?.from &&
    date?.to &&
    format(date.from, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") &&
    format(date.to, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  const isFromTodayOnly =
    date?.from &&
    !date?.to &&
    format(date.from, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <div className="flex mt-md px-0 h-[96px] w-full">
      <div className="flex items-center text-sm font-normal border border-[#D9D9E0] px-4 py-2 rounded-s-lg space-x-sm w-[220px] score-card">
        <Image
          src={"/assets/icons/calendar.svg"}
          alt="Calendar icon"
          width={20}
          height={20}
        />
        <span className="truncate">
          {isSameDay || isFromTodayOnly
            ? "Today"
            : date?.from && date?.to
            ? `${format(date.from, "eee, LLL dd")} - ${format(
                date.to,
                "eee, LLL dd"
              )}`
            : date?.from
            ? format(date.from, "eee, LLL dd")
            : "Pick a date"}
        </span>
      </div>

      {(isSameDay ? scoreData : filteredScoreData).map((score, i, array) => (
        <div
          className={`flex flex-col flex-grow border-e border-[#D9D9E0] border-y space-y-sm w-16 px-4 py-3 ${
            i === array.length - 1 ? "rounded-e-lg" : ""
          }`}
          key={score.label}
        >
          <span className="font-medium text-sm">{score.label}</span>
          <div className="flex  space-x-18">
            {score.subfields.map((field) => (
              <div className="flex flex-col" key={field.label}>
                <span className="text-text-secondary font-normal text-xs">
                  {field.label}
                </span>
                <span className="font-bold text-lg">{field.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScoreCard;
