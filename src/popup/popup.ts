import type { FocusTask } from "../shared/types"

const input = document.getElementById("taskInput") as HTMLInputElement
const button = document.getElementById("saveBtn")!

button.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab?.url) return

  const site = new URL(tab.url).hostname

  const task: FocusTask = {
    id: crypto.randomUUID(),
    site,
    description: input.value,
    createdAt: Date.now(),
    completed: false
  }

chrome.runtime.sendMessage({ type: "CREATE_TASK", task }, (response) => {
  if (response?.success) {
    window.close()
  }
})
})
