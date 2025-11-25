import "dotenv/config";
import { initializeCJCronScheduler } from "../lib/cj-cron-scheduler";

console.log("🚀 Starting CJ Dropshipping Cron Scheduler...");
console.log("⏰ This will run trending products sync every midnight");
console.log("💡 Press Ctrl+C to stop the scheduler\n");

initializeCJCronScheduler();

process.on("SIGINT", () => {
	console.log("\n⏹️ Stopping CJ Dropshipping Cron Scheduler...");
	process.exit(0);
});

process.on("SIGTERM", () => {
	console.log("\n⏹️ Stopping CJ Dropshipping Cron Scheduler...");
	process.exit(0);
});

setInterval(() => {
	// keep alive
}, 1000);


