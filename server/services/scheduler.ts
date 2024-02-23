import schedule from "node-schedule";

export function RunEveryHour(cb: any, runNow = false) {
  const rule = "0 * * * *"; // Runs every hour at the 0th minute
  // Create a job based on the rule
  const job = schedule.scheduleJob(rule, cb);
  if (runNow) job.invoke();
}
