import ChecklistSmall from "./ChecklistSmall";

export default {
  title: "Components/ChecklistSmall",
  component: ChecklistSmall,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: {
      control: "text",
      description: "Title displayed at the top of the menu",
      defaultValue: "Select Items",
    },
    items: {
      control: "array",
      description: "List of items to show as checkboxes",
      defaultValue: [
        "Bill ID",
        "Bill",
        "Date",
        "Patient",
        "Company",
        "Net Amount",
        "Payment",
      ],
    },
  },
};

const Template = (args) => <ChecklistSmall {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "Show/Hide Columns",
  items: ["Bill ID", "Bill", "Date", "Patient", "Company", "Net Amount", "Payment"],
};