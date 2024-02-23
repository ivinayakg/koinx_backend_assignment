export async function TimeSleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function DateFromDateTimeString(dateTimeString: string) {
  const date = new Date(dateTimeString);
  const dateString = date.toISOString().split("T")[0];
  return dateString;
}
