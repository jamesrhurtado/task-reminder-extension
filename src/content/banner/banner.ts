export function renderBanner(description: string) {
  if (document.getElementById("focus-task-banner")) return

  const banner = document.createElement("div")
  banner.id = "focus-task-banner"

  const text = document.createElement("span")
  text.textContent = `🧠 Task: ${description}`

  const button = document.createElement("button")
  button.textContent = "✓ Complete"

  banner.appendChild(text)
  banner.appendChild(button)
  document.body.prepend(banner)

  button.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "COMPLETE_TASK_MANUALLY" })
    banner.remove()
  })
}
