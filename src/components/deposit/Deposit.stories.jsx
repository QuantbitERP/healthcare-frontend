import Deposit from "./Deposit";

export default {
  title: "Components/Deposit",
  component: Deposit,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
   
  },
};

const Template = (args) => <Deposit {...args} />;

export const Default = Template.bind({});
Default.args = {
};
