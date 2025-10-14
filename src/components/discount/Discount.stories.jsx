import Discount from "./Discount";

export default {
  title: "Components/Discount",
  component: Discount,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
   
  },
};

const Template = (args) => <Discount {...args} />;

export const Default = Template.bind({});
Default.args = {
};
