import React from "react";
import Avatar from "react-avatar";

interface PatientRequisitionCardProps {
    patientName?: string;
    uhid?: string;
    patientCategory?: string;
    mobileNumber?: string;
    consultingDoctor?: string;
    createdBy?: string;
    aadhaarNo?: string;
    age?: string;
    dept?: string;
    visitType?: string;
}

const PatientRequisitionCard: React.FC<PatientRequisitionCardProps> = ({
    patientName = "Roytr rossy doytdi",
    uhid = "15",
    patientCategory = "Regular",
    mobileNumber = "1234567890",
    consultingDoctor = "Dr. Smith",
    createdBy = "Administrator",
    aadhaarNo = "5678",
    age = "-",
    dept = "-",
    visitType = "-",
}) => {
    return (
        <div className="flex flex-col w-[280px] h-fit gap-3 p-4 rounded-lg border border-gray-300 bg-white shadow">
            {/* Header */}
            <div className="flex flex-row items-center gap-2">
                <Avatar name={patientName} size="32" round={true} />
                <div className="flex flex-col">
                    <span className="text-blue-600 font-semibold">{patientName}</span>
                    <span className="text-xs text-gray-500">UHID: {uhid}</span>
                </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium">{patientCategory}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Mobile:</span>
                    <span className="font-medium">{mobileNumber}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Doctor:</span>
                    <span className="font-medium">{consultingDoctor}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Created By:</span>
                    <span className="font-medium">{createdBy}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Aadhaar:</span>
                    <span className="font-medium">{aadhaarNo}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Age:</span>
                    <span className="font-medium">{age}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Dept:</span>
                    <span className="font-medium">{dept}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Visit Type:</span>
                    <span className="font-medium">{visitType}</span>
                </div>
            </div>
        </div>
    );
};

export default PatientRequisitionCard;
