import Dropdown from "./Dropdown";

export default {
  title: "Components/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    reasons: {
      control: "object",
      description: "List of objects with key and value properties",
      defaultValue: [
        { key: 1, value: "Corporate" },
        { key: 2, value: "General" },
        { key: 3, value: "VIP" },
        { key: 4, value: "Insurance" }
      ],
    },
    showButton: {
      control: "boolean",
      description: "Show or hide the add button",
      defaultValue: false,
    },
    showSearch: {
      control: "boolean",
      description: "Show or hide the search box",
      defaultValue: false,
    },
    buttonText: {
      control: "text",
      description: "Text for the add new button",
      defaultValue: "New Doctor",
    },
  },
};

const Template = (args) => <Dropdown {...args} />;

export const Default = Template.bind({});
Default.args = {
  reasons: [
    { key: 1, value: "Corporate" },
    { key: 2, value: "General" },
    { key: 3, value: "VIP" },
    { key: 4, value: "Insurance" }
  ],
  showSearch: false,
  showButton: false,
  buttonText: "New Doctor",
};
