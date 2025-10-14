import ChecklistLarge from "./ChecklistLarge";

export default {
  title: "Components/ChecklistLarge",
  component: ChecklistLarge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    showSearch: {
      control: "boolean",
      description: "Show or hide the search box field",
      defaultValue: true,
    },
    items: {
      control: "array",
      description: "List of items to show as checkboxes",
      defaultValue: [
        "Rohan Patil",
        "Ananya Iyer",
        "Meera Kapoor",
        "Yash Rao",
        "Suman Mane",
        "Meeera Kapoor",
        "Kavya Nair",
      ],
    },
  },
};

const Template = (args) => <ChecklistLarge {...args} />;

export const Default = Template.bind({});
Default.args = {
  showSearch: true,
  items: ["Rohan Patil", "Ananya Iyer", "Meera Kapoor", "Yash Rao", "Suman Mane", "Meeera Kapoor", "Kavya Nair"],
};