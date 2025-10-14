import { format } from 'date-fns';

export const formatDate = (date: Date | string): string => {
const dateObj = new Date(date);

return format(dateObj, 'MMM dd, yyyy hh:mm a');
};