import TotalBreakdownRefundCard from "./TotalBreakdownCard";

export default{
    title:"Components/TotalBreakdownRefundCard",
    component:TotalBreakdownRefundCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
      },
      argTypes: {
        amountPaid: {
             control: "text",
             description: "amountPaid",
             defaultValue: "₹1,770",
           },
           deposit: {
            control: "text",
            description: "deposit",
            defaultValue: "₹5,000",
          },
          amount: {
            control: "text",
            description: "Amount",
            defaultValue: "₹6,770",
          },
          discount: {
            control: "text",
            description: "discount",
            defaultValue: "10",
          },
          primaryButtonText: {
            control: "text",
            description: "primaryButtonText",
            defaultValue: "View Refund Voucher",
          },
          
    }
}

const Template = (args) => <TotalBreakdownRefundCard {...args} />

export const Card = Template.bind({});

Card.args = {
  amountPaid:"₹1,770", deposit:"₹5,000", discount:10, amount:"₹6,770", primaryButtonText:"View Refund Voucher",
}