import CompanyDetails from "./CompanyDetails";

export default {
  title: "Components/companyDetails",
  component: CompanyDetails,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    company: {
      control: "text",
      description: "company",
      defaultValue: "Tata Steel",
    },
    insuranceNo: {
      control: "text",
      description: "Insurance Number",
      defaultValue: "20-02-2025",
    },
    claimNo: {
      control: "text",
      description: "claim number",
      defaultValue: "322984",
    },
    approvedAmount: {
      control: "text",
      description: "Approved Amount",
      defaultValue: "₹23309",
    },
    companyAmount: {
      control: "text",
      description: "Company Amount",
      defaultValue: "₹1,000",
    },
  /*
    company: {
      control: "text",
      description: "Company",
      defaultValue: "Tata Steel",
    },
    */
  },
};

const Template = (args) => <CompanyDetails {...args} />;

export const Default = Template.bind({});
Default.args = {
  company:"Tata Steel", 
  insuranceNo:"052763", 
  claimNo:"322984",
  approvedAmount:"₹23309", 
  companyAmount:"₹1,000",
};
