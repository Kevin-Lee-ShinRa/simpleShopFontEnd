export function dateFormat(time, detail = false) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1 < 10
    ? '0' + (date.getMonth() + 1)
    : date.getMonth() + 1);
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  if (detail) {
    const hours = date.getHours() < 10
      ? '0' + date.getHours()
      : date.getHours();
    const minutes = date.getMinutes() < 10
      ? '0' + date.getMinutes()
      : date.getMinutes();
    return `${ year }-${ month }-${ day } ${ hours }:${ minutes }`;
  }
  return `${ year }-${ month }-${ day }`;
}