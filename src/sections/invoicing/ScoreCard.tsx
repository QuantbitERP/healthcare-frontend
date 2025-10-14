"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { DateRange } from "react-day-picker";

import { format } from "date-fns";
import { useBillCounts } from "@/hooks/useBillCounts";
import { BillCountsRequest } from "@/sections/invoicing/tableData";
import { t } from "@/utils/languages";

type ScoreSubfield = {
  label: string;
  value: number;
};

type ScoreDataItem = {
  label: string;
  subfields: ScoreSubfield[];
};

type ScoreCardProps = {
  date: DateRange | undefined;
  tableData?: any[]; // Real table data from invoicing page (kept for backward compatibility)
};


const ScoreCard: React.FC<ScoreCardProps> = ({ date }) => {
  // Memoize the API request to prevent infinite re-renders
  const apiRequest = useMemo((): BillCountsRequest | null => {
    if (!date?.from) return null;
    
    const startDate = date.from.toISOString();
    const endDate = date.to ? date.to.toISOString() : date.from.toISOString();
    
    return {
      startdate: startDate,
      enddate: endDate,
    };
  }, [date?.from, date?.to]);

  // Fetch bill counts from API
  const { data: countsData, loading, error } = useBillCounts(apiRequest);

  // Transform API data to score card format
  const transformApiDataToScoreData = (): ScoreDataItem[] => {
    if (!countsData?.items) {
      return [
        {
        label: t("actionLabels.opd"),
        subfields: [
          { label: t("actionLabels.pending"), value: 0 },
          { label: t("actionLabels.submitted"), value: 0 },
        ],
        },
        {
          label: t("actionLabels.ipd"),
          subfields: [
            { label: t("actionLabels.pending"), value: 0 },
            { label: t("actionLabels.submitted"), value: 0 },
          ],
        },
      ];
    }

    // Find OPD and IPD data from API response
    const opdData = countsData.items.find(item => item.visittype === t("actionLabels.opd"));
    const ipdData = countsData.items.find(item => item.visittype === t("actionLabels.ipd"));

    return [
      {
        label: t("actionLabels.opd"),
        subfields: [
          { label: t("actionLabels.pending"), value: opdData?.pendingcount || 0 },
          { label: t("actionLabels.submitted"), value: opdData?.completedcount || 0 },
        ],
      },
      {
        label: t("actionLabels.ipd"),
        subfields: [
          { label: t("actionLabels.pending"), value: ipdData?.pendingcount || 0 },
          { label: t("actionLabels.submitted"), value: ipdData?.completedcount || 0 },
        ],
      },
    ];
  };

  const scoreData = transformApiDataToScoreData();

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
            ? t("actionLabels.today")
            : date?.from && date?.to
            ? `${format(date.from, "eee, LLL dd")} - ${format(
                date.to,
                "eee, LLL dd"
              )}`
            : date?.from
            ? format(date.from, "eee, LLL dd")
            : t("actionLabels.pickADate")}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center flex-grow border-e border-[#D9D9E0] border-y rounded-e-lg">
          <div className="text-sm text-gray-500">Loading counts...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center flex-grow border-e border-[#D9D9E0] border-y rounded-e-lg">
          <div className="text-sm text-red-500">Error loading counts</div>
        </div>
      ) : (
        scoreData.map((score, i, array) => (
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
        ))
      )}
    </div>
  );
};

export default ScoreCard;
