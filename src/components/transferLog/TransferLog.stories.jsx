import TransferLog from "./TransferLog";

export default {
  title: "Components/TransferLog",
  component: TransferLog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    amount: {
      control: "text",
      description: "Total amount",
      defaultValue: "₹20,945",
    },
    date: {
      control: "text",
      description: "Transaction date",
      defaultValue: "20-02-2025",
    },
    mode: {
      control: "text",
      description: "Payment mode",
      defaultValue: "Cash",
    },
    transaction: {
      control: "text",
      description: "Transaction ID",
      defaultValue: "CHE241241251",
    },
    bank: {
      control: "text",
      description: "Bank name",
      defaultValue: "ICICI",
    },
  },
};

const Template = (args) => <TransferLog {...args} />;

export const Default = Template.bind({});
Default.args = {
  amount: "₹20,945",
  date: "20-02-2025",
  mode: "Cash",
  transaction: "CHE241241251",
  bank: "ICICI",
};
