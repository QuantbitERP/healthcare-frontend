"use client";
import React, { useState, UIEventHandler } from "react";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import Image from "next/image";

import Buttons from "@/components/buttons/Button";
import { columns, categoryColumns } from "./tableData";
import TransferDetailsTable from "./TransferDetailsTable";
// import {
//   fetchCategoryChangeTableData,
//   fetchFundTransferTableData,
// } from "@/store/employee_transfers/thunks";
// import { API_VERSION } from "@/utils/constants";
interface SubmitBillModalProps {
  type?: string;
  onClose: () => void;
}

const SubmitBillModal: React.FC<SubmitBillModalProps> = ({ type, onClose }) => {
  // const dispatch = useDispatch<AppDispatch>();
  const { data: fundTableData, loading } = useSelector(
    (state: RootState) => state.employeeFundTransferTable
  );
  const { data: categoryTableData, loading: catLoading } = useSelector(
    (state: RootState) => state.employeeCategoryChangeTable
  );

  const [showGradient, setShowGradient] = useState(true);

  // useEffect(() => {
  //   dispatch(
  //     fetchFundTransferTableData({
  //       version: API_VERSION,
  //     })
  //   );
  //   dispatch(
  //     fetchCategoryChangeTableData({
  //       version: API_VERSION,
  //     })
  //   );
  // }, [dispatch]);

  const handleScroll: UIEventHandler<HTMLDivElement> = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
    setShowGradient(!isAtBottom);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="w-full h-[95%] bg-white rounded-t-sm shadow-xl flex flex-col animate-slideUp">
        {/* Header */}
        <div className="w-full h-fit flex items-center px-6 py-4 border-b border-[#D9D9E0] gap-2">
          <Image
            src={"assets/icons/Notepad.svg"}
            width={24}
            height={24}
            alt="notepad"
          />
          <span className="text-[#1C2024] font-semibold text-base flex-1">
            {type}
          </span>
          <Buttons
            size="button-icon-small"
            type="secondary-button"
            variant="icon"
            iconSrc={"assets/icons/x.svg"}
            onClick={onClose}
            className={undefined}
          >
            {undefined}
          </Buttons>
        </div>

        {/* Body */}
        <div
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-54 py-4 flex flex-col gap-6 no-scrollbar"
        >
          {type === "Transfer Log" ? (
            <TransferDetailsTable
              data={fundTableData}
              columns={columns}
              loading={loading}
            />
          ) : (
            <TransferDetailsTable
              data={categoryTableData}
              columns={categoryColumns}
              loading={catLoading}
            />
          )}
        </div>

        {/* Footer */}
        <div className="relative w-full px-6 py-3 flex justify-end items-center border-t border-[#D9D9E0] gap-4">
          {showGradient && (
            <div className="absolute -top-4 left-0 right-0 h-4 bg-gradient-to-t from-[rgba(217,217,217,0.42)] to-transparent pointer-events-none z-50" />
          )}
          <Buttons
            size="button-small"
            type="secondary-button"
            variant="button"
            onClick={onClose}
            className={undefined}
          >
            Close
          </Buttons>
        </div>
      </div>
    </div>
  );
};

export default SubmitBillModal;
