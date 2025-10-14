import { bool } from "prop-types";
import PatientDetailsCard from "./PatientDetailsCard";

export default{
    title:"Components/PatientDetailsCard",
    component:PatientDetailsCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
      },
      argTypes: {
      name: {
        control: "text",
        description: "Name",
        defaultValue: "Neha Deshmukh",
      },
      uhid: {
        control: "text",
        description: "The message shown below the name",
        defaultValue: "70 7463 2446 5247",
      },
      phone: {
        control: "text",
        description: "Phone number ",
        defaultValue: "+91-9096396014",
      },
      age: {
        control: "text",
        description: "age",
        defaultValue: "23",
      },
      sex: {
        control: "text",
        description: "sex",
        defaultValue: "Female",
      },
      aadharNumber: {
        control: "text",
        description: "aadhar number",
        defaultValue: "1589 2455 2564",
      },
      date: {
        control: "text",
        description: "date",
        defaultValue: "20/02/2025",
      },
      time: {
        control: "text",
        description: "time",
        defaultValue: "01:00 PM",
      },
      fullName: {
        control: "text",
        description: "Full Name",
        defaultValue: "Mrs. Neha Amit Deshmukh",
      },
      ipdNumber: {
        control: "text",
        description: "IPDNumber",
        defaultValue: "HSHIP250001667",
      },
      category: {
        control: "text",
        description: "Category",
        defaultValue: "Corporate",
      },
      company: {
        control: "text",
        description: "Company Name",
        defaultValue: "Tata Steel",
      },
      registrationDate: {
        control: "text",
        description: "RegistrationDate",
        defaultValue: "08/01/2025",
      },
      address: {
        control: "text",
        description: "address",
        defaultValue: "First Floor, Indu Dreams, 106 & 108, 3rd Lane, Rajarampuri, Kolhapur, Maharashtra 416008",
      },
      lastVisitDate: {
        control: "text",
        description: "lastVisitDate",
        defaultValue: "08/02/2025",
      },
      lastVisitTime: {
        control: "text",
        description: "lastVisitTime",
        defaultValue: "12:01:00 PM",
      },
      drName: {
        control: "text",
        description: "DrName",
        defaultValue: "DR. RAMESH RAO",
      },
      visitRemark: {
        control: "text",
        description: "visitRemark",
        defaultValue: "C/O Swelling On Legs - IP Department. 40K",
      },
      billingClass: {
        control: "text",
        description: "Billing Class",
        defaultValue: "Class B - Non AC",
      },

      creator: {
        control: "text",
        description: "creator",
        defaultValue: "Manish Malhotra",
      },
      visitType: {
        control: "text",
        description: "visit type",
        defaultValue: "OPD",
      },
      classType: {
        control: "text",
        description: "class type",
        defaultValue: "Premium",
      },
      showInsuranceDetails:{
        control: "boolean",
        description: "Show or hide insurance details",
        defaultValue: false,
      },
      patientPayable: {
        control: "text",
        description: "patient Payable",
        defaultValue: "₹1,500",
      },
      companyPayable: {
        control: "text",
        description: "company Payable",
        defaultValue: "₹5,000",
      },
      policyNumber: {
        control: "text",
        description: "policyNumber",
        defaultValue: "INS-987654321",
      },
      preAuthNo: {
        control: "text",
        description: "preAuthNo",
        defaultValue: "PREAUTH-456789",
      }, 
      approvedAmount: {
        control: "text",
        description: "approved Amount",
        defaultValue: "₹6,500",
      }, 
      approvedDate: {
        control: "text",
        description: "approved Date",
        defaultValue: "27-Mar-2025",
      }, 
      approvedBy: {
        control: "text",
        description: "approved By",
        defaultValue: "Dr. Ramesh Gupta",
      },
       size: {
      control: {
        type: "select",
      },
      options: ["small", "medium", "large"],
      description: "Size of the card",
      defaultValue: "small",
    },
    }
}

const Template = (args) => <PatientDetailsCard {...args} />

export const Card = Template.bind({});

Card.args = {
    name: "Neha Deshmukh",
    uhid: "70 7463 2446 5247",
    phone: "+91-9096396014",
    age : "23", 
    sex : "Female", 
    aadharNumber: "1589 2455 2564", 
    date: "20/02/2025", 
    time: "01:00 PM", 
    fullName: "Mrs. Neha Amit Deshmukh", 
    ipdNumber: "HSHIP250001667", 
    category: "Corporate", 
    company: "Tata Steel", 
    registrationDate: "08/01/2025", 
    address : "First Floor, Indu Dreams, 106 & 108, 3rd Lane, Rajarampuri, Kolhapur, Maharashtra 416008", 
    lastVisitDate: "08/02/2025", 
    lastVisitTime: "12:01:00 PM", 
    drName: "DR. RAMESH RAO", 
    visitRemark: "C/O Swelling On Legs - IP Department. 40K", 
    billingClass: "Class B - Non AC", 
    creator: "Manish Malhotra",
    visitType:"OPD", 
    classType:"Premium",
    showInsuranceDetails: false,
    patientPayable : "₹1,500",
    companyPayable:"₹5,000", 
    policyNumber:"INS-987654321", 
    preAuthNo:"PREAUTH-456789", 
    approvedAmount:"₹6,500", 
    approvedDate:"27-Mar-2025", 
    approvedBy:"Dr. Ramesh Gupta",
    size: "small",
}