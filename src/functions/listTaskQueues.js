const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const workspaceSid = process.env.TWILIO_WORKSPACE_SID;
const client = twilio(accountSid, authToken);

async function getWorkflowSid(taskQueueName) {
  const taskQueues = await client.taskrouter
    .workspaces(workspaceSid)
    .taskQueues.list({ limit: 20 });

  // Find the specific task queue by name or another identifier
  const taskQueue = taskQueues.find((tq) => tq.friendlyName === taskQueueName);

  if (taskQueue) {
    return taskQueue.workflowSid; // The workflow SID associated with the task queue
  } else {
    throw new Error("Task queue not found.");
  }
}

// Example usage:
getWorkflowSid("Your Task Queue Name").then((sid) => {
  console.log("Workflow SID:", sid);
}).catch((err) => {
  console.error(err.message);
});
