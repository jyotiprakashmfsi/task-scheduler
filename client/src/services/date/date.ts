export const getLocalTimeString = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 19).replace('T', ' ');
  };

export const isOverdue = (endTime: string) => {
  const endDate = new Date(endTime).toISOString().slice(0, 19).replace('T', ' ');
  const now = getLocalTimeString(new Date());
  return endDate < now;
};