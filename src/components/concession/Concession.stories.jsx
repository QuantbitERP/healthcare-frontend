import Concession from "./Concession";

export default {
  title: "Components/Concession",
  component: Concession,
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

const Template = (args) => <Concession {...args} />;

export const Default = Template.bind({});
Default.args = {
  amount: "₹20,945",
};
