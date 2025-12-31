import { renderBanner } from "./banner/banner"

const site = window.location.hostname
let hasActiveTask = false
let isActuallyLeaving = false

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
  switch (msg.type) {
    case "TASK_CREATED":
      hasActiveTask = true
      renderBanner(msg.task.description)
      break

    case "TASK_COMPLETED_UI":
      hasActiveTask = false
      break
  }
})


window.addEventListener("beforeunload", (event) => {
  if (!hasActiveTask) return

  isActuallyLeaving = true
  event.preventDefault()
  event.returnValue = ""
})

document.addEventListener("visibilitychange", () => {
  if (
    document.visibilityState === "hidden" &&
    hasActiveTask &&
    isActuallyLeaving
  ) {
    chrome.runtime.sendMessage({ type: "TASK_COMPLETED" })
  }
})
