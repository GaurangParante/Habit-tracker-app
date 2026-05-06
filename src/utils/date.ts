const pad = (value: number) => value.toString().padStart(2, '0');

export const toLocalDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
};

export const toLocalTimestamp = (date = new Date()) => date.toISOString();

export const startOfDay = (dateKey: string) => new Date(`${dateKey}T00:00:00`);

export const compareDateKeys = (left: string, right: string) =>
  startOfDay(left).getTime() - startOfDay(right).getTime();

export const isOverdue = (dueDate: string | null, today = toLocalDateKey()) =>
  dueDate !== null && compareDateKeys(dueDate, today) < 0;

export const formatReadableDate = (dateKey: string | null) => {
  if (!dateKey) {
    return 'No due date';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(startOfDay(dateKey));
};

export const getDateRange = (days: number, endDate = new Date()) => {
  return Array.from({length: days}, (_, index) => {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - index);
    return toLocalDateKey(date);
  }).reverse();
};

export const shiftDateKey = (dateKey: string, offsetDays: number) => {
  const date = startOfDay(dateKey);
  date.setDate(date.getDate() + offsetDays);
  return toLocalDateKey(date);
};
