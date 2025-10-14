import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Service, { ServiceProps } from './Service';

const meta: Meta<typeof Service> = {
  title: 'Components/Service',
  component: Service,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

const Template: StoryFn<ServiceProps> = (args) => <Service {...args} />;

export const Card = Template.bind({});
Card.args = {
  // onClose: () => console.log('Closed'),
  showHeader: false,
  header: 'Full Body Checkup',
  subHeader: 'ECG',
  serviceCode: '0000016',
  rate: '₹7,500',
  packageType: 'Health Checkup',
  dateAdded: '31-Dec-2024 12:30 PM',
  unit: 'Cardiology Department',
  serviceName: 'ECG',
  serviceRemark: 'Urgent Test',
  doctor: [
    'Neha Verma',
    'Ashish Shinde',
    'Sahil Chougale',
    'Sangram Chavan',
    'Vaibhav Gavas',
  ],
  size: 'small',
};
