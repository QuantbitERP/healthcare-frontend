import Document from "./Document";

export default {
  title: "Components/Document",
  component: Document,
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
  },
};

const Template = (args) => <Document {...args} />;

export const Default = Template.bind({});
Default.args = {
  amount: "₹20,945",
};
