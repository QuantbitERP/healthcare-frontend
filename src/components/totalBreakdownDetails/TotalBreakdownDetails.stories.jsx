import Layout from "@/app/sidebarTest/page";
import TotalBreakdownDetails from "./TotalBreakdownDetails";

export default{
    title: "Components/TotalBreakdownDetails",
    component:TotalBreakdownDetails,
    tags: ['autodocs'],
    parameters:{
        layout: 'centered'
    },
    argTypes:{
        PatientPayabl: {
            control: "text",
            description: "Amount",
            defaultValue: "10,000",
          },
          CompanyPayable: {
            control: "text",
            description: "Amount",
            defaultValue: "5,000",
          },
          Concession: {
            control: "text",
            description: "Amount",
            defaultValue: "1,500",
          },
          Bill: {
            control: "text",
            description: "Amount",
            defaultValue: "945",
          },
          Service: {
            control: "text",
            description: "Amount",
            defaultValue: "945",
          },
          PackageAmount: {
            control: "text",
            description: "Amount",
            defaultValue: "2,000",
          },
          BalanceUtilized: {
            control: "text",
            description: "Amount",
            defaultValue: "3,000",
          },
          EmployeeBalance: {
            control: "text",
            description: "Amount",
            defaultValue: "2,000",
          },
          Deposit: {
            control: "text",
            description: "Amount",
            defaultValue: "1,000",
          },
          SubTotal: {
            control: "text",
            description: "Amount",
            defaultValue: "19,445",
          },
          GST: {
            control: "text",
            description: "Amount",
            defaultValue: "3,000",
          },
          CGST: {
            control: "text",
            description: "Amount",
            defaultValue: "1,500",
          },
          SGST: {
            control: "text",
            description: "Amount",
            defaultValue: "1,500",
          },
          TotalAmount: {
            control: "text",
            description: "Amount",
            defaultValue: "20,945",
          },
          showInsuranceDetails: {
            control: "boolean",
            description: "show Insurance Details",
            defaultValue: false,
          },
          InsuranceDeposit: {
            control: "text",
            description: "Insurance Deposit",
            defaultValue: "5,500",
          },
    }
}

const Template = (args) => <TotalBreakdownDetails {...args}/>

export const Card = Template.bind({});

Card.args = {
    PatientPayabl:"10,000", 
    CompanyPayable:"5,000", 
    Concession:"1,500", 
    Bill:"945", 
    Service:"945", 
    PackageAmount:"2,000", 
    BalanceUtilized:"3,000", 
    EmployeeBalance:"2,000",
    Deposit:"1,000", 
    SubTotal:"19,445", 
    GST:"3000", 
    CGST:"1,500", 
    SGST:"1,500", 
    TotalAmount:"20,945",
    showInsuranceDetails:false, 
    InsuranceDeposit:"5,500"
}