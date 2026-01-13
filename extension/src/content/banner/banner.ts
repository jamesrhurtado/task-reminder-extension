import "./banner.css"

function createConfetti() {
  const container = document.createElement("div")
  container.className = "confetti-container"
  document.body.appendChild(container)

  const colors = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#95e1d3", "#f38181", "#aa96da", "#fcbad3", "#a8d8ea"] as const
  const shapes = ["circle", "square", "ribbon"] as const

  // Create 50 confetti pieces
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div")
    const color = colors[Math.floor(Math.random() * colors.length)] ?? "#ff6b6b"
    const shape = shapes[Math.floor(Math.random() * shapes.length)] ?? "circle"
    confetti.className = `confetti ${shape}`
    confetti.style.backgroundColor = color
    confetti.style.left = `${Math.random() * 100}%`
    confetti.style.top = `${Math.random() * 50 - 10}%`
    confetti.style.animationDelay = `${Math.random() * 0.5}s`
    confetti.style.animationDuration = `${1 + Math.random() * 1}s`
    container.appendChild(confetti)
  }

  // Remove container after animation
  setTimeout(() => container.remove(), 2500)
}

function showCompletionMessage() {
  const message = document.createElement("div")
  message.className = "completion-message"
  message.innerHTML = `<span class="emoji">🎉</span>Task Complete!`
  document.body.appendChild(message)

  // Remove after animation
  setTimeout(() => message.remove(), 2000)
}

function celebrateCompletion() {
  createConfetti()
  showCompletionMessage()
}

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
    celebrateCompletion()
  })
}
