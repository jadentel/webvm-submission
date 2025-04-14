// src/lib/claudeService.js
import Anthropic from '@anthropic-ai/sdk';

// We'll use module-level variables here.
// In a larger app, you might integrate this into a React Context or use Redux/Zustand.
let client = null;
let messages = [];
let stopFlag = false;

/**
 * Set the API key and initialize the Anthropic client.
 * @param {string} key - The API key.
 */
export function setApiKey(key) {
  client = new Anthropic({
    apiKey: key,
    dangerouslyAllowBrowser: true
  });
  // Reset message history.
  messages = [];
  localStorage.setItem("anthropic-api-key", key);
  // (Optionally, record analytics events here.)
}

/**
 * Clear the API key.
 */
export function clearApiKey() {
  localStorage.removeItem("anthropic-api-key");
  // In a full implementation, update your UI state (via context or props) to reflect that an API key is required.
}

/**
 * Internal helper to add a message.
 * @param {string} role - Who sent the message (e.g. 'user' or 'assistant').
 * @param {any} content - The text or structured content.
 */
function addMessageInternal(role, content) {
  messages.push({ role, content });
  // In React you might want to store this in state or call a callback to re-render.
}

/**
 * Send the current message list to Claude.
 * The function uses the Anthropic SDK to call Claude and then processes the response.
 * @param {Function} handleTool - Callback to handle any tool commands.
 */
export async function sendMessages(handleTool, writeOutput) {
    try {
      const tool = { type: "bash_20250124", name: "bash" };
  
      const config = {
        max_tokens: 2048,
        messages,
        system: "You are running on a virtualized machine. Wait extra time after operations to compensate for slowdown.",
        model: 'claude-3-7-sonnet-20250219',
        tools: [tool],
        tool_choice: { type: "auto", disable_parallel_tool_use: true },
        betas: ["computer-use-2025-01-24"]
      };
  
      const response = await client.beta.messages.create(config);
  
      if (stopFlag) {
        return;
      }
  
      // Process each part of the API response.
      for (const c of response.content) {
        if (c.type === "text") {
          addMessageInternal(response.role, c.text);
          if (writeOutput) {
            writeOutput(`Claude replied: ${c.text}\r\n`);
          }
        } else if (c.type === "tool_use") {
          addMessageInternal(response.role, [c]);
          const toolResult = await handleTool(c.input);
          const responseObj = { type: "tool_result", tool_use_id: c.id };
          if (toolResult instanceof Error) {
            console.warn(`Tool error: ${toolResult.message}`);
            responseObj.content = toolResult.message;
            responseObj.is_error = true;
          } else {
            responseObj.content = toolResult;
          }
          addMessageInternal("user", [responseObj]);
          if (stopFlag) return;
          // Recursively process further tool commands.
          sendMessages(handleTool, writeOutput);
        } else if (c.type === "thinking") {
          addMessageInternal(response.role, [c]);
          if (writeOutput) {
            writeOutput("Claude is thinking...\r\n");
          }
        } else {
          console.warn(`Invalid response type: ${c.type}`);
        }
      }
    } catch (e) {
      console.error("Error in sendMessages:", e);
      if (e.status === 401) {
        addMessageInternal('error', 'Invalid API key');
        clearApiKey();
      } else {
        addMessageInternal('error', e.error?.error?.message || e.message);
      }
      if (writeOutput) {
        writeOutput(`Error: ${e.error?.error?.message || e.message}\r\n`);
      }
    }
}
  

/**
 * Public method to send a user message and then invoke Claude.
 * @param {string} text - The user’s text.
 * @param {Function} handleTool - Callback to handle any tool commands.
 */
export function addMessage(text, handleTool, writeOutput) {
    addMessageInternal('user', text);
    sendMessages(handleTool, writeOutput);
  }
  

/**
 * Clear the message history.
 */
export function clearMessageHistory() {
  messages = [];
}

/**
 * Stop processing further messages.
 */
export async function forceStop() {
  stopFlag = true;
  // In a React context, you might want to return a promise that resolves when the UI stops the activity.
  return new Promise((resolve) => {
    // This is a simple example of how you might wait until a state variable (e.g. loading) becomes false.
    setTimeout(() => {
      stopFlag = false;
      resolve();
    }, 1000);
  });
}
