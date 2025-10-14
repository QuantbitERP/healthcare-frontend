import React from "react"
import FullBodyCheckupCard from "./Card"

export default {
  title: "Components/fullBodyCheckup",
  component: FullBodyCheckupCard,
  tags: ["autodocs"],

  parameters: {
    layout: "centered"
  },

  argTypes: {
    header: {
      control: "text",
      description: "Header",
      defaultValue: "Full Body Checkup"
    },
    packageCode: {
      control: "text",
      description: "Package code",
      defaultValue: "FBC-001"
    },
    gender: {
      control: "text",
      description: "Gender",
      defaultValue: "Female"
    },
    department: {
      control: "text",
      description: "Department",
      defaultValue: "Cardiology"
    },
    packageType: {
      control: "text",
      description: "Package Type",
      defaultValue: "Health Checkup"
    },
    visitType: {
      control: "text",
      description: "Visit Type",
      defaultValue: "OPD"
    },
    duration: {
      control: "text",
      description: "Duration",
      defaultValue: "5 Days"
    },
    dateFrom: {
      control: "text",
      description: "Start date",
      defaultValue: "22-01-2025"
    },
    dateTo: {
      control: "text",
      description: "End date",
      defaultValue: "30-01-2025"
    },
    rate: {
      control: "text",
      description: "Rate",
      defaultValue: "₹1,500"
    },
    quantity: {
      control: "text",
      description: "Quantity",
      defaultValue: "1"
    },
    requisitionDate: {
      control: "text",
      description: "Requisition Date",
      defaultValue: "15-05-2025"
    },
    time: {
      control: "text",
      description: "Time",
      defaultValue: "10:15 AM"
    },
    concession: {
      control: "text",
      description: "Concession",
      defaultValue: "6%"
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "Size of the card",
      defaultValue: "small"
    }
  }
}

const Template = args => <FullBodyCheckupCard {...args} />

export const Card = Template.bind({})
Card.args = {
  header: "Full Body Checkup",
  packageCode: "FBC-001",
  gender: "Female",
  department: "Cardiology",
  packageType: "Health Checkup",
  visitType: "OPD",
  duration: "5 Days",
  dateFrom: "22-01-2025",
  dateTo: "30-01-2025",
  rate: "₹1,500",
  quantity: "1",
  requisitionDate: "15-05-2025",
  time: "10:15 AM",
  concession: "6%",
  size: "small"
}
