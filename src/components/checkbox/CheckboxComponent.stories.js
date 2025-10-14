import CheckboxComponent from "./CheckboxComponent";

export default CheckboxComponent = {
  title: "Components/CheckboxComponent", // Grouping in Storybook
  component: CheckboxComponent,
  tags: ["autodocs"],

  parameters: {
    layout: "centered",
  },
  argTypes: {
    label: { control: "text" },
    checked: { control: "boolean" },
  },
};

const Template = (args) => <CheckboxComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: "Check",
  checked: false,
};
