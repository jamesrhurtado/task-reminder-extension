import type { ExtensionMessage } from "../shared/types"
import { completeTaskForSite, getTaskForSite, saveTask } from "./taskManager"

chrome.runtime.onMessage.addListener((msg: ExtensionMessage, sender, sendResponse) => {
  (async () => {
    if (msg.type === "GET_ACTIVE_TASK") {
      const task = await getTaskForSite(msg.site)
      sendResponse(task)
    }

    if (msg.type === "CREATE_TASK") {
      await saveTask(msg.task)

      // Notify the current tab about the new task
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: "TASK_CREATED",
          task: msg.task
        }).catch(() => {
          // Tab might not have content script loaded yet, ignore error
        })
      }

      sendResponse({ success: true })
      return
    }

    if (msg.type === "TASK_COMPLETED") {
      await completeTaskForSite(sender.tab?.url)
    }

    if (msg.type === "COMPLETE_TASK_MANUALLY") {
    await completeTaskForSite(sender.tab?.url)

    if (sender.tab?.id) {
      chrome.tabs.sendMessage(sender.tab.id, {
        type: "TASK_COMPLETED_UI"
      })
    }
  }


  
  })()

  return true
})
