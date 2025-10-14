import DatePicker from "./DatePicker";

export default{
    title:"Components/DatePicker",
    component:DatePicker,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
      },
}
const Template = () => <DatePicker/>;

export const Box = Template.bind({});
