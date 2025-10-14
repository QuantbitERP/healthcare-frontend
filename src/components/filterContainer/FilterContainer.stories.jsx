import FilterContainer from "./FilterContainer"

export default{
    title: "Components/FilterContainer",
    component: FilterContainer,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
      },
}

const Template = (args) => <FilterContainer{...args}/>;

export const Box = Template.bind({});
