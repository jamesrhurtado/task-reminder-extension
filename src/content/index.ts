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
      renderBanner(task.description)
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
  `

  document.head.appendChild(style)
  document.body.appendChild(overlay)

  const input = document.getElementById("focus-prompt-input") as HTMLInputElement
  const submitBtn = document.getElementById("focus-prompt-submit")!
  const skipBtn = document.getElementById("focus-prompt-skip")!

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
      completed: false
    }

    chrome.runtime.sendMessage({ type: "CREATE_TASK", task }, () => {
      hasActiveTask = true
      renderBanner(description)
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
