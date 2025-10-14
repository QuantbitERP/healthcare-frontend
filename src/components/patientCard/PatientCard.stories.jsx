import PatientCard from "./PatientCard";

export default{
    title:"Components/PatientCard",
    component:PatientCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
      },
      argTypes: {
        name: {
            control: "text",
            description: "Name",
            defaultValue: "Neha Deshmukh",
          },
          age: {
            control: "text",
            description: "age",
            defaultValue: "28",
          },
          sex: {
            control: "text",
            description: "sex",
            defaultValue: "Female",
          },
          phone: {
            control: "text",
            description: "phone",
            defaultValue: "+91-9096396014",
          }, 
          ABHAID: {
            control: "text",
            description: "phone",
            defaultValue: "12-2456-7544-2485",
          },
          
    }
}

const Template = (args) => <PatientCard {...args} />

export const Card = Template.bind({});

Card.args = {
    name:'Neha Deshmukh',
    age:"28",
    sex:"Female", 
    phone:"+91-9096396014",
    ABHAID:"12-2456-7544-2485"
}