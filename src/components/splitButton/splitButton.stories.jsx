import React from "react";
import SplitButton from "./splitButton"; 

export default {
  title: "Components/SplitButton",
  component: SplitButton,  
  tags: ['autodocs'],
  parameters: {
      layout: 'centered',
    },
  
  argTypes: {
    type: {
      control: { type: "select" },
      options: [
        "primary-button", 
        "primary-outlined-button",
        "secondary-button", 
        "danger-button", 
      ],
      description: "Button style (color and appearance)",
    },
    size: {
      control: { type: "select" },
      options: [
        "xsmall", "small", "medium", "large", "xlarge",
      ],
      description: "Button size",
    },
    buttonText: {
      control: "text",
      description: "Button text",
      defaultValue: "Print",
    },
    listItems: {
      control: "array",
      description: "List of items",
      defaultValue: [
       "CompanyDetails",
       "Print"
      ],
    },
    listHeader:{
      control: "text",
      description: "List header",
      defaultValue: "Print",
    }
  },
};

export const Default = (args) => <SplitButton {...args} />;
Default.args = {
  type: "primary-button",
  size: "medium",
  buttonText:"Print",
  listHeader:"Print",
  listItems:["CompanyDetails", "Print"]
};

