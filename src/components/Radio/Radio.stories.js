import Radio from "./Radio";

export default Radio = {
  title: "Components/Radio", // Grouping in Storybook
  component: Radio,
  tags: ["autodocs"],

  parameters: {
    layout: "centered",
  },
  argTypes: {
    items: [
      {
        label: { control: "text" },
        value: { control: "text" },
      },
    ],
  },
};

const Template = (args) => <Radio {...args} />;

export const Default = Template.bind({});
Default.args = {
  items: [
    {
      label: "Default",
      value: "default",
    },

    {
      label: "Comfortable",
      value: "comfortable",
    },
    {
      label: "Compact",
      value: "compact",
    },
  ],
};
