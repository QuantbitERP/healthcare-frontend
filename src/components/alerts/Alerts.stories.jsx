import Alert from "./Alerts";

export default {
  title: "Components/Alerts", // Grouping in Storybook
  component: Alert,
  tags: ["autodocs"],

  parameters: {
    layout: "centered",
  },
  heading: {
    control: "text",
    description: "Alert title ",
    defaultValue: "Alert title",
  },
  content: {
    control: "text",
    description: "Alert content",
    defaultValue: "Alert content",
  },
  /*
  button: {
    control: "boolean",
    description: "Button on the right",
    defaultValue: "true",
  },
  Duplicate
  */
  buttonText: {
    control: "text",
    description: "Button text",
    defaultValue: "Button",
  },
  button: {
    control: "boolean",
    description: "Button on the right",
    defaultValue: "true",
  },
  variant: {
    control: { type: "select" },
    options: ["secondary","success","primary","warning","danger"],
    description: "type of alert",
  },
  showCloseIcon: {
    control: "boolean",
    description: "Show close icon",
    defaultValue: false,
  },
  showButton: {
    control: "boolean",
    description: "Show button",
    defaultValue: false,
  },
  disappear: {
    control: "boolean",
    description: "Show alert",
    defaultValue: true,
  },
  open: {
    control: "boolean",
    description: "Show alert",
    defaultValue: true,
  },
};

const Template = (args) => <Alert {...args} />;

export const Default = Template.bind({});
Default.args = {
 heading:"Alert title", content:"Alert content", buttonText:"Button",
 variant:"success", showCloseIcon: false, showButton: false, disappear:true, open : true
};
