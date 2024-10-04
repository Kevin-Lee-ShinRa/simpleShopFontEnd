export function countRemainingDaysInMonth() {
  let currentDay = new Date();
  let month = currentDay.getMonth();
  let hour = currentDay.getHours() + 1;
  currentDay.setMonth(month + 1);
  currentDay.setDate(0);
  const day = currentDay.getDate() - new Date().getDate();
  return `${ day }天${ 24 - hour }小时`;
}