import React from "react";
import RichTextEditor from "./RichTextEditor";

export default {
  title: "Components/RichTextEditor",
  component: RichTextEditor,
};

const Template = (args) => <RichTextEditor {...args} />;

export const Default = Template.bind({});
Default.args = {};
