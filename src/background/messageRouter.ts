import type { ExtensionMessage } from "../shared/types"
import { getTaskForSite, saveTask } from "./taskManager"

chrome.runtime.onMessage.addListener((msg: ExtensionMessage, _, sendResponse) => {
  (async () => {
    if (msg.type === "GET_ACTIVE_TASK") {
      const task = await getTaskForSite(msg.site)
      sendResponse(task)
    }

    if (msg.type === "CREATE_TASK") {
      await saveTask(msg.task)
      sendResponse({ success: true })
    }
  })()

  return true
})
