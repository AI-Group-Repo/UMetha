const { initializeCJCronScheduler } = require('../lib/cj-cron-scheduler');

console.log('🚀 Starting CJ Dropshipping Cron Scheduler...');
console.log('⏰ This will run trending products sync every midnight');
console.log('💡 Press Ctrl+C to stop the scheduler\n');

// Initialize the cron scheduler
initializeCJCronScheduler();

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n⏹️ Stopping CJ Dropshipping Cron Scheduler...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⏹️ Stopping CJ Dropshipping Cron Scheduler...');
  process.exit(0);
});

// Keep the process alive
setInterval(() => {
  // Just keep the process running
}, 1000);

