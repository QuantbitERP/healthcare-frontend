import React from 'react';
import ScaleDropdown from './ScaleDropdown';

export default {
  title: 'Components/ScaleDropdown',
  component: ScaleDropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

const Template = (args) => {
  const [selectedItem, setSelectedItem] = React.useState('');
  
  return (
    <div className="p-4">
      <ScaleDropdown 
        {...args} 
        selectedItem={selectedItem}
        onSelect={setSelectedItem}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  items: ['Corporate', 'General', 'VIP', 'Insurance'],
  placeholder: 'Select Category'
};

export const WithSearch = Template.bind({});
WithSearch.args = {
  items: ['Corporate', 'General', 'VIP', 'Insurance'],
  showSearch: true,
  placeholder: 'Search and Select'
};

export const WithButton = Template.bind({});
WithButton.args = {
  items: ['Corporate', 'General', 'VIP', 'Insurance'],
  showButton: true,
  buttonText: 'Add New Category',
  placeholder: 'Select or Add'
};

export const WithSearchAndButton = Template.bind({});
WithSearchAndButton.args = {
  items: ['Corporate', 'General', 'VIP', 'Insurance'],
  showSearch: true,
  showButton: true,
  buttonText: 'Add New Category',
  placeholder: 'Search, Select or Add'
}; 