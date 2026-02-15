import { renderBanner } from "./banner/banner"

const site = window.location.hostname
let hasActiveTask = false
let isActuallyLeaving = false

// Check for existing task
chrome.runtime.sendMessage(
  { type: "GET_ACTIVE_TASK", site },
  (task) => {
    if (task && !task.completed) {
      hasActiveTask = true
      renderBanner(task.description, task.timeLimit, task.startedAt)
    } else {
      // No existing task, check if this site should auto-prompt
      checkAutoPrompt()
    }
  }
)

// Check if current site should show auto-prompt
function checkAutoPrompt() {
  chrome.runtime.sendMessage(
    { type: "GET_AUTO_PROMPT_DOMAINS" },
    (domains: string[]) => {
      if (!domains || domains.length === 0) return

      // Check if current site matches any auto-prompt domain
      const shouldPrompt = domains.some(domain => {
        return site === domain || site.endsWith('.' + domain)
      })

      if (shouldPrompt) {
        showTaskPrompt()
      }
    }
  )
}

// Show prompt modal for task input
function showTaskPrompt() {
  // Check if prompt already exists
  if (document.getElementById("focus-task-prompt")) return

  const overlay = document.createElement("div")
  overlay.id = "focus-task-prompt"
  overlay.innerHTML = `
    <div class="focus-prompt-modal">
      <h3>🧠 What's your task here?</h3>
      <p>Define your goal before continuing</p>
      <input type="text" id="focus-prompt-input" placeholder="e.g. Check messages and reply" autofocus />
      
      <div class="focus-time-section">
        <label>Time Limit (optional)</label>
        <div class="focus-time-presets">
          <button class="focus-time-btn" data-minutes="5">5 min</button>
          <button class="focus-time-btn" data-minutes="15">15 min</button>
          <button class="focus-time-btn" data-minutes="30">30 min</button>
          <button class="focus-time-btn" id="focus-custom-btn">Custom</button>
        </div>
        <input type="number" id="focus-custom-input" placeholder="Minutes" min="1" max="480" style="display: none;" />
        <div class="focus-selected-time" id="focus-selected-time"></div>
      </div>
      
      <div class="focus-prompt-actions">
        <button id="focus-prompt-submit">Set Task</button>
        <button id="focus-prompt-skip">Skip</button>
      </div>
    </div>
  `

  // Add styles
  const style = document.createElement("style")
  style.textContent = `
    #focus-task-prompt {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999999;
    }

    .focus-prompt-modal {
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      width: 90%;
    }

    .focus-prompt-modal h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 20px;
    }

    .focus-prompt-modal p {
      margin: 0 0 16px 0;
      color: #666;
      font-size: 14px;
    }

    .focus-prompt-modal input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      margin-bottom: 16px;
      box-sizing: border-box;
    }

    .focus-prompt-modal input:focus {
      outline: none;
      border-color: #4285f4;
    }

    .focus-prompt-actions {
      display: flex;
      gap: 8px;
    }

    .focus-prompt-actions button {
      flex: 1;
      padding: 10px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    #focus-prompt-submit {
      background: #4285f4;
      color: white;
    }

    #focus-prompt-submit:hover {
      background: #357ae8;
    }

    #focus-prompt-skip {
      background: #f5f5f5;
      color: #666;
    }

    #focus-prompt-skip:hover {
      background: #e8e8e8;
    }
    
    /* Time selection in modal */
    .focus-time-section {
      margin: 12px 0;
    }
    
    .focus-time-section label {
      display: block;
      margin-bottom: 6px;
      font-size: 12px;
      color: #666;
      font-weight: 500;
    }
    
    .focus-time-presets {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      margin-bottom: 6px;
    }
    
    .focus-time-btn {
      padding: 6px 4px;
      background: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .focus-time-btn:hover {
      background: #e8e8e8;
      border-color: #ccc;
    }
    
    .focus-time-btn.active {
      background: #4285f4;
      color: white;
      border-color: #4285f4;
    }
    
    #focus-custom-input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
      margin-bottom: 6px;
      box-sizing: border-box;
    }
    
    #focus-custom-input:focus {
      outline: none;
      border-color: #4285f4;
    }
    
    .focus-selected-time {
      font-size: 11px;
      color: #4285f4;
      font-weight: 500;
      min-height: 16px;
    }
  `

  document.head.appendChild(style)
  document.body.appendChild(overlay)

  const input = document.getElementById("focus-prompt-input") as HTMLInputElement
  const submitBtn = document.getElementById("focus-prompt-submit")!
  const skipBtn = document.getElementById("focus-prompt-skip")!

  // Time selection handling
  let selectedTimeLimit: number | undefined = undefined
  const timeBtns = overlay.querySelectorAll(".focus-time-btn")
  const customBtn = document.getElementById("focus-custom-btn")!
  const customInput = document.getElementById("focus-custom-input") as HTMLInputElement
  const selectedTimeDisplay = document.getElementById("focus-selected-time")!

  timeBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault()
      const minutes = btn.getAttribute("data-minutes")
      
      timeBtns.forEach(b => b.classList.remove("active"))
      
      if (btn === customBtn) {
        customInput.style.display = "block"
        customInput.focus()
        btn.classList.add("active")
        selectedTimeLimit = undefined
        selectedTimeDisplay.textContent = ""
      } else if (minutes) {
        btn.classList.add("active")
        customInput.style.display = "none"
        selectedTimeLimit = parseInt(minutes)
        selectedTimeDisplay.textContent = `⏱️ ${selectedTimeLimit} minutes`
      }
    })
  })

  customInput.addEventListener("input", () => {
    const value = parseInt(customInput.value)
    if (value && value > 0) {
      selectedTimeLimit = value
      selectedTimeDisplay.textContent = `⏱️ ${selectedTimeLimit} minutes`
    } else {
      selectedTimeLimit = undefined
      selectedTimeDisplay.textContent = ""
    }
  })

  input.focus()

  // Submit task
  const submitTask = () => {
    const description = input.value.trim()
    if (!description) return

    const task = {
      id: crypto.randomUUID(),
      site,
      description,
      createdAt: Date.now(),
      completed: false,
      timeLimit: selectedTimeLimit,
      startedAt: selectedTimeLimit ? Date.now() : undefined
    }

    chrome.runtime.sendMessage({ type: "CREATE_TASK", task }, () => {
      hasActiveTask = true
      renderBanner(description, selectedTimeLimit, selectedTimeLimit ? Date.now() : undefined)
      overlay.remove()
    })
  }

  submitBtn.addEventListener("click", submitTask)
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") submitTask()
  })

  skipBtn.addEventListener("click", () => {
    overlay.remove()
  })
}

// Dynamic warning messages for 80% threshold
const WARNING_MESSAGES = [
  { emoji: "⏰", text: "Hey, you said you were here for a reason", subtext: "20% of your time left" },
  { emoji: "🎯", text: "Focus up! Time is running out", subtext: "Stay locked in" },
  { emoji: "⚡", text: "Almost there! Don't lose momentum", subtext: "80% time elapsed" },
  { emoji: "🔥", text: "Time to finish strong", subtext: "The clock is ticking" },
  { emoji: "💪", text: "You've got this! Push through", subtext: "Final stretch ahead" },
  { emoji: "🚀", text: "Make these last minutes count", subtext: "Stay on target" },
  { emoji: "⌛", text: "Crunch time! Wrap it up", subtext: "Time flies when you're focused" },
  { emoji: "🎪", text: "The show must go on", subtext: "But not for much longer" },
  { emoji: "🧠", text: "Remember why you came here", subtext: "Finish what you started" },
  { emoji: "✨", text: "Sprint to the finish line", subtext: "You're in the home stretch" }
]

// Show timer warning message at 80%
function showTimerWarning() {
  console.log("[TIMER_WARNING] Showing timer warning message")

  // Pick a random message
  const randomMessage = WARNING_MESSAGES[Math.floor(Math.random() * WARNING_MESSAGES.length)]

  const message = document.createElement("div")
  message.className = "timer-warning-message"
  message.innerHTML = `
    <div class="timer-warning-content">
      <span class="emoji">${randomMessage?.emoji ?? "⏰"}</span>
      <div>${randomMessage?.text ?? "Time is running out"}</div>
      <div class="timer-warning-subtext">${randomMessage?.subtext ?? "Stay focused"}</div>
    </div>
  `

  const style = document.createElement("style")
  style.textContent = `
    .timer-warning-message {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      background: linear-gradient(135deg, #FF9800 0%, #FF5722 100%);
      color: white;
      padding: 24px 32px;
      border-radius: 16px;
      z-index: 9999999;
      box-shadow: 0 10px 40px rgba(255, 152, 0, 0.5);
      animation: timer-pop-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
      text-align: center;
    }

    .timer-warning-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .timer-warning-message .emoji {
      font-size: 48px;
      display: block;
    }

    .timer-warning-message > div {
      font-size: 20px;
      font-weight: bold;
    }

    .timer-warning-subtext {
      font-size: 14px !important;
      font-weight: normal !important;
      opacity: 0.95;
    }

    @keyframes timer-pop-in {
      0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
      }
      50% {
        transform: translate(-50%, -50%) scale(1.1);
      }
      100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
    }
  `

  document.head.appendChild(style)
  document.body.appendChild(message)

  setTimeout(() => message.remove(), 4000)
}

// Show timer expired message
function showTimerExpiredMessage() {
  console.log("[TIMER_EXPIRED] Showing timer expired message")
  const message = document.createElement("div")
  message.className = "timer-expired-message"
  message.innerHTML = `
    <div class="timer-expired-content">
      <span class="emoji">⏰</span>
      <div>Time's up!</div>
      <div class="timer-expired-subtext">Your focus session has ended</div>
    </div>
  `

  const style = document.createElement("style")
  style.textContent = `
    .timer-expired-message {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      padding: 24px 32px;
      border-radius: 16px;
      z-index: 9999999;
      box-shadow: 0 10px 40px rgba(240, 147, 251, 0.4);
      animation: timer-pop-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
      text-align: center;
    }

    .timer-expired-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .timer-expired-message .emoji {
      font-size: 48px;
      display: block;
    }

    .timer-expired-message > div {
      font-size: 20px;
      font-weight: bold;
    }

    .timer-expired-subtext {
      font-size: 14px !important;
      font-weight: normal !important;
      opacity: 0.9;
    }

    @keyframes timer-pop-in {
      0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
      }
      50% {
        transform: translate(-50%, -50%) scale(1.1);
      }
      100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
    }
  `

  document.head.appendChild(style)
  document.body.appendChild(message)

  setTimeout(() => message.remove(), 3000)
}

chrome.runtime.onMessage.addListener((msg) => {
  switch (msg.type) {
    case "TASK_CREATED":
      hasActiveTask = true
      renderBanner(msg.task.description, msg.task.timeLimit, msg.task.startedAt)
      break

    case "TASK_COMPLETED_UI":
      hasActiveTask = false
      break

    case "TIMER_WARNING":
      // Timer warning at 80%
      console.log("[TIMER_WARNING] Received message", { msgSite: msg.site, currentSite: site, hasActiveTask })
      if (msg.site === site && hasActiveTask) {
        console.log("[TIMER_WARNING] Conditions met, showing warning")
        showTimerWarning()
      } else {
        console.log("[TIMER_WARNING] Conditions not met, skipping")
      }
      break

    case "TIMER_EXPIRED":
      // Timer expired, auto-complete task
      console.log("[TIMER_EXPIRED] Received message", { msgSite: msg.site, currentSite: site, hasActiveTask })
      if (msg.site === site && hasActiveTask) {
        console.log("[TIMER_EXPIRED] Conditions met, showing message")
        hasActiveTask = false
        const banner = document.getElementById("focus-task-banner")
        if (banner) banner.remove()
        // Show timer expired notification
        showTimerExpiredMessage()
      } else {
        console.log("[TIMER_EXPIRED] Conditions not met, skipping")
      }
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
