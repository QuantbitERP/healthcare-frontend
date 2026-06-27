"use client";
import React, { useState } from "react";
import { JSX } from "react/jsx-runtime";

import { Input } from "@/components/ui/input";
import TableUtilToggle from "@/components/table-util-buttons/TableUtilToggle";
import TableUtilFilterButton from "@/components/table-util-buttons/TableUtilFilterButton";
import UtilDropDownButton from "@/components/table-util-buttons/UtilDropDownButton";
import { t } from "@/utils/languages";
import DateRangePicker from "@/components/DateRange/DateRangePicker";

function BillingTableFilters(): JSX.Element {
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <div className="flex justify-between items-center py-sm">
      <div className="input flex justify-center">
        <Input />
      </div>
      <div className="filters flex space-x-sm py-xs">
        <TableUtilToggle inputProps={{ checked, setChecked }} label={t("actionLabels.meMode")} />
        <TableUtilFilterButton
          icon={"assets/icons/FilterIcon.svg"}
          label={t("actionLabels.filters")}
          badgeCount={Number("2")}
        />
        <DateRangePicker
          dateProps={{
            date: { from: new Date(), to: new Date() },
            setDate: () => { },
          }}
        />

        <UtilDropDownButton
          leadingIcon={"assets/icons/columns.svg"}
          label={t("actionLabels.showColumns")}
          className="drop-down-button"
          isDatePicker={false}
          isActive={false}
        />
      </div>
    </div>
  );
}

export default BillingTableFilters;
