import Dialog from "./Dialog";

export default {
  title: "Components/dialogWithDropdownButton",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: {
      control: "text",
      description: "The title displayed at the top of the dialogue box",
      defaultValue: "Cancel Bill?",
    },
    label: {
      control: "text",
      description: "The message shown inside the dialogue",
      defaultValue: "Bill cancellation is irreversible.",
    },
    showDropdown: {
      control: "boolean",
      description: "Show or hide the dropdown field",
      defaultValue: false,
    },
    dropdownLabel: {
      control: "text",
      description: "Label for the dropdown field",
      defaultValue: "Select a Reason",
    },
    reasons: {
      control: "array",
      description: "List of cancellation reasons",
      defaultValue: [
        "Incorrect Patient Details",
        "Incorrect Billing",
        "Duplicate Entry",
        "Other",
      ],
    },
    showTextbox: {
      control: "boolean",
      description: "Show or hide the textbox field",
      defaultValue: false,
    },
    textboxLabel: {
      control: "text",
      description: "Label for the textbox",
      defaultValue: "Remarks",
    },
    textboxPlaceholder: {
      control: "text",
      description: "Placeholder text for the textbox",
      defaultValue: "Error in patient name",
    },
    buttons: {
      control: "object",
      description: "List of buttons with their properties",
      defaultValue: [
        { text: "Cancel", type: "secondary-button", size: "button-medium", onClick: () => {} },
        { text: "Confirm", type: "danger-button", size: "button-medium", onClick: () => {} },
      ],
    },
  },
};

const Template = (args) => <Dialog {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "Cancel Bill?",
  label: "Bill cancellation is irreversible.",
  showDropdown: false,
  dropdownLabel: "Select a Reason",
  reasons: ["Incorrect Patient Details", "Incorrect Billing", "Duplicate Entry", "Other"],
  showTextbox: false,
  textboxLabel: "Remarks",
  textboxPlaceholder: "Error in patient name",
  buttons: [
    { text: "Cancel", type: "secondary-button", size: "button-medium", onClick: () => console.log("Cancelled") },
    { text: "Confirm", type: "danger-button", size: "button-medium", onClick: () => console.log("Confirmed") },
  ],
};
