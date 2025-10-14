export function groupByFn<T extends Record<string, unknown>>(
  data: T[],
  key: keyof T
): Record<string, T[]> {
  return data.reduce((acc: Record<string, T[]>, item: T) => {
    const groupKey = String(item[key]); 
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {});
}
