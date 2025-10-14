import StatusBadge from "./StatusBadge";

export default StatusBadge = {
  title: "Components/StatusBadgee", // Grouping in Storybook
  component: StatusBadge,
  tags: ['autodocs'],
  parameters: {
      layout: 'centered',
    },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger", "disabled"],
    },
  },
};

const Template = (args) => <StatusBadge {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  variant: "primary",
  text: "Outstanding",
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: "secondary",
  text: "Finalized",
};

export const Danger = Template.bind({});
Danger.args = {
  variant: "danger",
  text: "Unpaid",
};

export const Warning = Template.bind({});
Warning.args = {
  variant: "warning",
  text: "Pending",
};

export const Disabled = Template.bind({});
Disabled.args = {
  variant: "disabled",
  text: "Draft",
};
