import { DropDownWithButton } from "./DropDownWithButton";
import { Button } from "@/components/ui/button";
import verticalMenu from "@/assets/icons/DotsVertical.svg";
import Image from "next/image";
import { Meta, StoryFn } from "@storybook/react";

export default {
  title: "Components/DropDownWithButton",
  component: DropDownWithButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    trigger: {
      description: "Element used to trigger the dropdown",
      control: false,
    },
    menuRendering: {
      description: "Grouped list of dropdown items, ending with a Print button",
      control: "object",
      defaultValue: [
        {
          title: "",
          items: ["Lab", "RTS", "OTS Notes", "Discharge Summary", "Case Sheet"],
        },
      ],
    },
  },
} as Meta;

interface DropDownWithButtonStoryArgs {
  trigger: React.ReactNode;
  menuRendering: {
    title: string;
    items: string[];
  }[];
}

const Template: StoryFn<DropDownWithButtonStoryArgs> = (args) => <DropDownWithButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  trigger: (
    <Button variant="outline">
      <Image src={verticalMenu} alt="Options" className="w-6 h-6" />
    </Button>
  ),
  menuRendering: [
    {
      title: "",
      items: ["Lab", "RTS", "OTS Notes", "Discharge Summary", "Case Sheet"],
    },
  ],
};
