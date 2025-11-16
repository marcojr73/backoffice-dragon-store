function isDateAfterThePresent(arg: string | number | null) {
  if (!arg || typeof arg !== 'string') return false;
  if (!arg.match(/^\d{4}-\d{2}-\d{2}$/)) return false;

  const [year, month, day] = arg.split('-').map(Number);
  const selectedDate = new Date(year, month - 1, day); // month é 0-indexado
  const today = new Date();

  selectedDate.setHours(0, 0, 0, 0);
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
