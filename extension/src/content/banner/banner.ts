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
  message.innerHTML = `<span class="emoji">🎉</span>Task Completed!`
  document.body.appendChild(message)

  // Remove after animation
  setTimeout(() => message.remove(), 2000)
}

function celebrateCompletion() {
  createConfetti()
  showCompletionMessage()
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function getTimerColor(percentRemaining: number): string {
  if (percentRemaining > 50) return '#4CAF50'
  if (percentRemaining > 20) return '#FF9800'
  return '#f44336'
}

export function renderBanner(description: string, timeLimit?: number, startedAt?: number) {
  if (document.getElementById("focus-task-banner")) return

  const banner = document.createElement("div")
  banner.id = "focus-task-banner"

  const text = document.createElement("span")
  text.className = "task-description"
  text.textContent = `🧠 Task: ${description}`

  // Timer display
  let timerDisplay: HTMLElement | null = null
  let timerInterval: number | null = null
  
  if (timeLimit && startedAt) {
    timerDisplay = document.createElement("div")
    timerDisplay.className = "timer-display"
    
    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000)
      const totalSeconds = timeLimit * 60
      const remaining = Math.max(0, totalSeconds - elapsed)
      const percentRemaining = (remaining / totalSeconds) * 100
      
      if (timerDisplay) {
        timerDisplay.innerHTML = `
          <div class="timer-bar-container">
            <div class="timer-bar" style="width: ${percentRemaining}%; background-color: ${getTimerColor(percentRemaining)}"></div>
          </div>
          <div class="timer-text" style="color: ${getTimerColor(percentRemaining)}">
            ⏱️ ${formatTime(remaining)} remaining
          </div>
        `
      }
      
      if (remaining === 0 && timerInterval) {
        clearInterval(timerInterval)
      }
    }
    
    updateTimer()
    timerInterval = window.setInterval(updateTimer, 1000)
  }

  const button = document.createElement("button")
  button.textContent = "✓ Complete"

  banner.appendChild(text)
  if (timerDisplay) {
    banner.appendChild(timerDisplay)
  }
  banner.appendChild(button)
  document.body.prepend(banner)

  button.addEventListener("click", () => {
    if (timerInterval) {
      clearInterval(timerInterval)
    }
    chrome.runtime.sendMessage({ type: "COMPLETE_TASK_MANUALLY" })
    banner.remove()
    celebrateCompletion()
  })
}
