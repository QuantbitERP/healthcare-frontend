import PatientCard from "./PatientCard";

export default{
    title:"Components/PatientCardIPD",
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
          ward: {
            control: "text",
            description: "ward",
            defaultValue: "E/21/12",
          },
          company: {
            control: "text",
            description: "company",
            defaultValue: "Tata Steel",
          },
       
          
    }
}

const Template = (args) => <PatientCard {...args} />

export const Card = Template.bind({});

Card.args = {
   name:'Neha Deshmukh', ward:"E/21/12",  company:"Tata Steel"
}