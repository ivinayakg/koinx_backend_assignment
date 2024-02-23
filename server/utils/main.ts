export async function TimeSleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
