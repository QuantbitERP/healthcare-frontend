import { Meta, StoryFn } from "@storybook/react";
import PatientDetailsCard from "./PatientDetailsCard";
import { GetDraftBillByIdResponseDTO } from "@/services/api-client/models/GetDraftBillByIdResponseDTO";
import { Table } from "@tanstack/react-table";
import { GetBillServices } from "@/services/api-client/models/GetBillServices";


// Mock patient object
const mockPatient: GetDraftBillByIdResponseDTO = {
  id: "1",
  patientName: "Aarav Sharma",
  patientid: "HSHOP250024682",
  billId: "#BI0101101",
  patientGender: "Male",
  patientAgeYears: 35,
  patientMobileno: "+91 98765 43210",
  patientMrn: "MRN123456",
  billcompanyid: "COMP001",
  billcompanyTypeid: "TYPE001",
  schemeCompanyName: "Health Insurance Co.",
  schemeCompanyTypeName: "Corporate",
  billTotalAmount: 5000,
  billDiscountPercent: 10,
  billDiscountAmount: 500,
  createddate: "2024-01-15",
  createdBy: "Dr. Smith"
};

export default {
  title: "Components/PatientDetailsCardWithTable",
  component: PatientDetailsCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    patientName: {
      control: "text",
      description: "Patient's name",
      defaultValue: mockPatient.patientName,
    },
    patientid: {
      control: "text",
      description: "Unique Health ID number",
      defaultValue: mockPatient.patientid,
    },
    patientMobileno: {
      control: "text",
      description: "Patient's phone number",
      defaultValue: mockPatient.patientMobileno,
    },
    patientAge: {
      control: "number",
      description: "Patient's age",
      defaultValue: mockPatient.patientAgeYears,
    },
    patientGender: {
      control: "text",
      description: "Patient's gender",
      defaultValue: mockPatient.patientGender,
    },
    patientMrn: {
      control: "text",
      description: "Patient's MRN",
      defaultValue: mockPatient.patientMrn,
    },
    billId: {
      control: "text",
      description: "Bill ID",
      defaultValue: mockPatient.billId,
    },
    billcompanyid: {
      control: "text",
      description: "Bill company ID",
      defaultValue: mockPatient.billcompanyid,
    },
    billcompanyTypeid: {
      control: "text",
      description: "Bill company type ID",
      defaultValue: mockPatient.billcompanyTypeid,
    },
    schemeCompanyName: {
      control: "text",
      description: "Scheme company name",
      defaultValue: mockPatient.schemeCompanyName,
    },
    schemeCompanyTypeName: {
      control: "text",
      description: "Scheme company type name",
      defaultValue: mockPatient.schemeCompanyTypeName,
    },
    billTotalAmount: {
      control: "number",
      description: "Total bill amount",
      defaultValue: mockPatient.billTotalAmount,
    },
    billDiscountPercent: {
      control: "number",
      description: "Bill discount percentage",
      defaultValue: mockPatient.billDiscountPercent,
    },
    billDiscountAmount: {
      control: "number",
      description: "Bill discount amount",
      defaultValue: mockPatient.billDiscountAmount,
    },
    createddate: {
      control: "text",
      description: "Creation date",
      defaultValue: mockPatient.createddate,
    },
    createdBy: {
      control: "text",
      description: "Created by",
      defaultValue: mockPatient.createdBy,
    }
  }
} as Meta<typeof PatientDetailsCard>;

const Template: StoryFn<typeof PatientDetailsCard> = (args) => (
  <PatientDetailsCard
    {...args}
    patient={mockPatient}
    setOpen={() => {}}
    columns={[]}
    initialData={[]}
    table={{} as Table<GetBillServices>}
    dataProps={{ data: [], setData: () => {} }}
  />
);

export const Card = Template.bind({});
Card.args = {
  setOpen: () => {},
  patient: mockPatient,
  showInsuranceDetails: true,
  size: "small",
  columns: [],
  initialData: [],
  table: {} as Table<GetBillServices>,
  dataProps: { data: [], setData: () => {} }
};
