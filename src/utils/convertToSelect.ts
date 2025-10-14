type Option = {
  label: string;
  value: string;
};

type ConvertToSelectParams<T> = {
  array: T[];
  labelKey?: keyof T;
  valueKey?: keyof T;
};

export function ConvertToSelect<T extends Record<string, any>>({
  array,
  labelKey = 'name',
  valueKey = 'id',
}: ConvertToSelectParams<T>): Option[] {
  return (array||[]).map((item) => {
    const label =
      item[labelKey] ??
      item.name ??
      item.departmentValue ??
      item.subDepartmentValue ??
      item.serviceGroupName ??
      item.activeDeactiveStatusValue ??
      item.hospitalValue ??
      item.operationCategoryValue ??
      item.createdByName ??
      item.serviceCodeTypeName ??
      item.modifiedByName ??
      item.opdName ??
      item.label ??
      item.restrictionTypeName??
      item.additionalServiceGroupName??
      item.repeatableTypeName??
      item.timeDayName??
      item.compositeServicesName??
      item.value??
      'Unnamed';  

    const value =
      item[valueKey] ??
      item.id ??
      item.departmentId ??
      item.subDepartmentId ??
      item.serviceGroupId ??
      item.activeDeactiveStatusId ??
      item.hospitalId ??
      item.operationCategoryId ??
      item.createdById ??
      item.serviceCodeTypeId ??
      item.modifiedById ??
      item.opdId ??
      // item.value ??
      item.restrictionTypeId ??
      item.additionalServiceGroupId ??
      item.repeatableTypeId ??
      item.yearId ??
      item.compositeServicesId ??
      item.key ??
      'value';

    return {
      label: String(label),
      value: String(value),
    };
  });
}
