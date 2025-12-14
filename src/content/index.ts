import { renderBanner } from "./banner/banner"

const site = window.location.hostname
let hasActiveTask = false


chrome.runtime.sendMessage(
  { type: "GET_ACTIVE_TASK", site },
  (task) => {
    if (task && !task.completed) {
      hasActiveTask = true
      renderBanner(task.description)
    }
  }
)

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "TASK_CREATED") {
    hasActiveTask = true
  }
})

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "TASK_COMPLETED_UI") {
    hasActiveTask = false
  }
})


window.addEventListener("beforeunload", (event) => {
  if (!hasActiveTask) return

  // Required to trigger the confirmation dialog
  event.preventDefault()
  event.returnValue = ""
})

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && hasActiveTask) {
    chrome.runtime.sendMessage({
      type: "TASK_COMPLETED"
    })
  }
})
