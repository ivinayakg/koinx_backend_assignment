export async function TimeSleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function DateFromDateTimeString(dateTimeString: string) {
  const inputDate = new Date(dateTimeString);
  const day = String(inputDate.getDate()).padStart(2, '0');
  const month = String(inputDate.getMonth() + 1).padStart(2, '0');
  const year = inputDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
}
