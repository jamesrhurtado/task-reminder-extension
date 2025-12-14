import { renderBanner } from "./banner/banner"

const site = window.location.hostname

chrome.runtime.sendMessage(
  { type: "GET_ACTIVE_TASK", site },
  (task) => {
    if (task && !task.completed) {
      renderBanner(task.description)
    }
  }
)


chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "TASK_CREATED") {
    renderBanner(msg.task.description)
  }
})