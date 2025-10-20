// Script to manually start the Supabase MCP server
const { spawn } = require("child_process");
const path = require("path");

console.log("Starting Supabase MCP server...");

// Your Supabase access token is hardcoded here
const SUPABASE_ACCESS_TOKEN = "sbp_64c1fee1158c40a372b3d6c4323355a9b09475ef";

const mcpServer = spawn("npx", ["@supabase/mcp-server-supabase"], {
  env: {
    ...process.env,
    SUPABASE_ACCESS_TOKEN,
  },
});

mcpServer.stdout.on("data", (data) => {
  console.log(`MCP Server output: ${data}`);
});

mcpServer.stderr.on("data", (data) => {
  console.error(`MCP Server error: ${data}`);
});

mcpServer.on("close", (code) => {
  console.log(`MCP Server process exited with code ${code}`);
});

console.log("MCP Server started. Press Ctrl+C to stop.");
