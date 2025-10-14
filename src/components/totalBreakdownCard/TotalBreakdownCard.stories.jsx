import { bool } from "prop-types";
import TotalBreakdownCard from "./TotalBreakdownCard";

export default{
    title:"Components/TotalBreakdownCard",
    component:TotalBreakdownCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
      },
      argTypes: {
         total: {
             control: "text",
             description: "Amount",
             defaultValue: "0",
           },
           concession: {
            control: "text",
            description: "Amount",
            defaultValue: "0",
          },
          balanceUtilized: {
            control: "text",
            description: "Amount",
            defaultValue: "0",
          },
          deposit: {
            control: "text",
            description: "Amount",
            defaultValue: "0",
          },
          gst: {
            control: "text",
            description: "Amount",
            defaultValue: "0",
          },
          outstandingAmount: {
            control: "text",
            description: "Amount",
            defaultValue: "0",
          },
          discount: {
            control: "text",
            description: "discount",
            defaultValue: "10",
          },
          primaryButtonText: {
            control: "text",
            description: "primaryButtonText",
            defaultValue: "Record Payment",
          },
          secondaryButtonText: {
            control: "text",
            description: "secondaryButtonText",
            defaultValue: "View Payment Receipt",
          },
          showDeposit:{
            control: "boolean",
            description: "show deposit value",
            defaultValue: "false",
          }
          
    }
}

const Template = (args) => <TotalBreakdownCard {...args} />

export const Card = Template.bind({});

Card.args = {
    total:"0",concession:"0", balanceUtilized:"0", deposit:"0", showDeposit: false, gst:"0", outstandingAmount:"0", discount:10, primaryButtonText:"Record Payment", secondaryButtonText:"View Payment Receipt",
}