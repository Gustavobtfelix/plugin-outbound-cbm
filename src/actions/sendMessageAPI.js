// src/components/SimpleButton/sendMessageAPI.js
import { Actions, Manager, Notifications } from "@twilio/flex-ui";

export const sendMessageAPI = async (sendOutboundParams) => {
  const manager = Manager.getInstance();
  // Extract necessary parameters from sendOutboundParams
  const workflow = sendOutboundParams.taskQueue || process.env.FLEX_APP_DEFAULT_TASK_QUEUE;
  const contact_method = sendOutboundParams.destination; // Assuming `body` holds the actual message content
  const workerSID = manager.workerClient.sid;
  
  try {
    const response = await fetch(
      'http://127.0.0.1:5000/call_to_action',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contact_method: contact_method,
            workerSID: workerSID,
        }),
      }
    );

    if (response.status === 204) {
      console.log('Message sent successfully: No content');
      Notifications.showNotification("outboundMessageSent", {
        message: 'Message sent successfully!',
      });
    } else if (response.ok) {
      const data = await response.json();
      console.log('Message sent successfully:', data);
      Notifications.showNotification("messageSentSuccess", {
        message: 'Message sent successfully!',
      });
    } else {
      console.error('Failed to send message:', response.statusText);
      Notifications.showNotification("messageSendFailed", {
        message: 'Failed to send message.',
      });
    }
  } catch (error) {
    console.error('Error sending message:', error);
    Notifications.showNotification("messageSendFailed", {
      message: 'An error occurred.',
    });
  }
};

// Registering the custom action
Actions.registerAction("SendMessageAPI", (payload) => {
  if (!payload.callerId) {
    payload.callerId = process.env.FLEX_APP_TWILIO_FROM_NUMBER;
  }

  const sendOutboundParams = {
    destination: payload.destination,
    taskQueue: payload.taskQueue || process.env.FLEX_APP_DEFAULT_TASK_QUEUE,
    callerId: payload.callerId,
    openChat: payload.openChat || false,
    routeToMe: payload.routeToMe || false,
  };

  sendMessageAPI(sendOutboundParams);
});
