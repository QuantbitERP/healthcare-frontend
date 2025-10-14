import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Patient {
  id: number;
    name: string;
    uhid: string;
    billNumber: string;
    createdOn: string;
    status: string;
    payment: string;
    phone: string;
    age: string;
    sex?: string;
    ABHAID: string;
    address: string;
    category: string;
    company: string;
    registrationDate: string;
    lastVisitDate: string;
    lastVisitTime: string;
    drName: string;
    visitRemark: string;
    billingClass: string;
    creator: string;
    visitType: string;
    classType: string;
    showInsuranceDetails: boolean;
    patientPayable: string;
    companyPayable: string;
    policyNumber: string;
    preAuthNo: string;
    approvedAmount: string;
    approvedDate: string;
    approvedBy: string;
    vitalStatus: string;
}

interface PatientState {
  list: Patient[];
}

const initialState: PatientState = {
  list: [
    {
      id: 1,
      name: "Aarav Sharma",
      uhid: "HSHOP250024682",
      billNumber: "#BI0101101",
      createdOn: "02 Jan 2025 09:15 AM",
      status: "Draft",
      payment: "Paid",
      phone: "9876543210",
      age: "29",
      sex: "Male",
      ABHAID: "12-1111-2222-3333",
      address: "101 Tech Avenue, Pune",
      category: "Corporate",
      company: "InnoTech Solutions",
      registrationDate: "01/01/2025",
      lastVisitDate: "02/01/2025",
      lastVisitTime: "09:15 AM",
      drName: "Dr. Priya Iyer",
      visitRemark: "Routine OPD",
      billingClass: "Class A - AC",
      creator: "Dr. Priya Iyer",
      visitType: "OPD",
      classType: "Premium",
      showInsuranceDetails: true,
      patientPayable: "₹1,000",
      companyPayable: "₹1,000",
      policyNumber: "INS-1001",
      preAuthNo: "PREAUTH-5001",
      approvedAmount: "₹2,000",
      approvedDate: "05-Jan-2025",
      approvedBy: "Dr. Priya Iyer",
      vitalStatus: "alive",
    },
    {
      id: 2,
      name: "Rohan Patil",
      uhid: "HSHOP250024683",
      billNumber: "#BI0101102",
      createdOn: "02 Jan 2025 02:30 PM",
      status: "Finalised",
      payment: "Paid",
      phone: "9123456780",
      age: "32",
      sex: "Male",
      ABHAID: "12-2222-3333-4444",
      address: "22 Bridge Road, Nashik",
      category: "Corporate",
      company: "ByteForge",
      registrationDate: "01/01/2025",
      lastVisitDate: "02/01/2025",
      lastVisitTime: "02:30 PM",
      drName: "Dr. Arvind Mehta",
      visitRemark: "Flu symptoms - Medication given",
      billingClass: "Class B - Non AC",
      creator: "Dr. Arvind Mehta",
      visitType: "OPD",
      classType: "Regular",
      showInsuranceDetails: true,
      patientPayable: "₹1,500",
      companyPayable: "₹2,000",
      policyNumber: "INS-1002",
      preAuthNo: "PREAUTH-5002",
      approvedAmount: "₹3,500",
      approvedDate: "04-Jan-2025",
      approvedBy: "Dr. Arvind Mehta",
      vitalStatus: "alive",
    },
    {
      id: 3,
      name: "Ananya Iyer",
      uhid: "HSHOP250024684",
      billNumber: "#BI0101103",
      createdOn: "02 Jan 2025 06:45 PM",
      status: "Draft",
      payment: "Pending",
      phone: "9012345678",
      age: "28",
      sex: "Female",
      ABHAID: "12-3333-4444-5555",
      address: "15 Lake View, Nagpur",
      category: "Retail",
      company: "FutureStack",
      registrationDate: "02/01/2025",
      lastVisitDate: "02/01/2025",
      lastVisitTime: "06:45 PM",
      drName: "Dr. Rajesh Sharma",
      visitRemark: "Headache complaint",
      billingClass: "Class A - AC",
      creator: "Dr. Rajesh Sharma",
      visitType: "OPD",
      classType: "Regular",
      showInsuranceDetails: true,
      patientPayable: "₹800",
      companyPayable: "₹1,000",
      policyNumber: "INS-1003",
      preAuthNo: "PREAUTH-5003",
      approvedAmount: "₹1,800",
      approvedDate: "05-Jan-2025",
      approvedBy: "Dr. Rajesh Sharma",
      vitalStatus: "dead",
    },
    {
      id: 4,
      name: "Kavya Nair",
      uhid: "HSHOP250024685",
      billNumber: "#BI0101104",
      createdOn: "03 Jan 2025 11:10 AM",
      status: "Finalised",
      payment: "Paid",
      phone: "9812312345",
      age: "35",
      sex: "Female",
      ABHAID: "12-4444-5555-6666",
      address: "303 Green Valley, Bengaluru",
      category: "Corporate",
      company: "KPIT Technologies",
      registrationDate: "03/01/2025",
      lastVisitDate: "03/01/2025",
      lastVisitTime: "11:10 AM",
      drName: "Dr. Neha Verma",
      visitRemark: "Diabetes checkup",
      billingClass: "Class A - AC",
      creator: "Dr. Neha Verma",
      visitType: "OPD",
      classType: "Premium",
      showInsuranceDetails: true,
      patientPayable: "₹1,200",
      companyPayable: "₹1,000",
      policyNumber: "INS-1004",
      preAuthNo: "PREAUTH-5004",
      approvedAmount: "₹2,200",
      approvedDate: "04-Jan-2025",
      approvedBy: "Dr. Neha Verma",
      vitalStatus: "alive",
    },
  ],
};

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    setPatients(state, action: PayloadAction<Patient[]>) {
      state.list = action.payload;
    },
  },
});

export const { setPatients } = patientSlice.actions;
export default patientSlice.reducer;
