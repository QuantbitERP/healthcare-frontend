import { Meta, StoryFn } from "@storybook/react";
import PatientRequisitionDetailsCard from "./PatientRequisitionDetailsCard";

export default {
  title: "Components/PatientRequisitionDetailsCard",
  component: PatientRequisitionDetailsCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    name: { control: "text" },
    uhid: { control: "text" },
    phone: { control: "text" },
    age: { control: "text" },
    sex: { control: "text" },
    aadharNumber: { control: "text" },
    date: { control: "text" },
    time: { control: "text" },
    fullName: { control: "text" },
    requisitionNo: { control: "text" },
    category: { control: "text" },
    company: { control: "text" },
    registrationDate: { control: "text" },
    address: { control: "text" },
    lastVisitDate: { control: "text" },
    lastVisitTime: { control: "text" },
    drName: { control: "text" },
    visitRemark: { control: "text" },
    billingClass: { control: "text" },
    showInsuranceDetails: { control: "boolean" },
    size: { control: { type: "select" }, options: ["small", "medium", "large"] },
  },
} as Meta<typeof PatientRequisitionDetailsCard>;

const Template: StoryFn<typeof PatientRequisitionDetailsCard> = (args) => (
  <PatientRequisitionDetailsCard {...args} onClose={() => { }} />
);

export const Default = Template.bind({});
Default.args = {
  size: "large",
};
