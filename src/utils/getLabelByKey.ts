export function getLabelByKey<T>(
    options: T[] = [],
    key: string | undefined,
    keyField: keyof T,
    valueField: keyof T
  ): string {
    if (!key) return "";
    const found = options.find((opt) => String(opt[keyField]) === String(key));
    return (found?.[valueField] as string) ?? "";
  }
  