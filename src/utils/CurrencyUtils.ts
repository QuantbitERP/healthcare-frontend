export const formatCurrency = (value: number, currency: string): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(value);
};

export const getCurrencySymbol = (
  currencyCode: string,
  locale: string = "en-US"
): string => {
  return (0)
    .toLocaleString(locale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, "")
    .trim();
};

interface DateRange {
  from: Date | null;
  to?: Date | null;
}

export const isSameDay = (date?: DateRange): boolean => {
  if (!date?.from) return false;

  const compareDate = date.to ?? date.from;
  const today = new Date();

  return (
    compareDate.getFullYear() === today.getFullYear() &&
    compareDate.getMonth() === today.getMonth() &&
    compareDate.getDate() === today.getDate()
  );
};

export function formatCreatedOnDate(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `Created on ${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
}
