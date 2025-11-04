function isDateAfterThePresent(arg: string | number | null) {
  if (!arg) return false;
  const selectedDate = new Date(arg);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
}

function isDateAfterThan(
  target: string | number | null,
  due?: string | number | null
) {
  if (!target) return false;
  if (!due) return true;
  const selectedDate = new Date(target);
  const targetDate = new Date(due);
  selectedDate.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  console.log(selectedDate >= targetDate);
  return selectedDate >= targetDate;
}

export const validations = { isDateAfterThePresent, isDateAfterThan };
