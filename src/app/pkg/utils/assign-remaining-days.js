export function assignRemainingDays(currentTime, days = 8) {
  let future_time = new Date(currentTime);
  let future_date = new Date(future_time.setDate(future_time.getDate() + days));
  let future = `${ future_date.getFullYear() }-${ future_date.getMonth() + 1 < 10
    ? '0' + (future_date.getMonth() + 1)
    : future_date.getMonth() + 1 }-${ future_date.getDate() } 00:00:00`;
  let current = new Date();
  let end = new Date(future);
  let sec = parseInt((end - current) / 1000);
  let day = Math.floor(sec / (60 * 60 * 24));
  let modulo = sec % (60 * 60 * 24);
  let hour = Math.floor(modulo / (60 * 60));
  return `${ day }天${ hour }时`;
}