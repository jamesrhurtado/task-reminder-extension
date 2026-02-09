import type { FocusTask } from "../shared/types"
import { storage } from "../shared/storage"

// Alarm names are prefixed with this to identify timer alarms
const ALARM_PREFIX = "task-timer-"

export function startTimer(task: FocusTask) {
  if (!task.timeLimit || !task.startedAt) return

  const site = task.site
  const alarmName = ALARM_PREFIX + site

  // Clear existing alarm if any
  stopTimer(site)

  const expirationTime = task.startedAt + (task.timeLimit * 60 * 1000)
  const timeUntilExpiration = expirationTime - Date.now()

  if (timeUntilExpiration <= 0) {
    // Already expired
    handleTimerExpiration(site)
    return
  }

  // Create alarm (delayInMinutes must be at least 1 minute for chrome.alarms)
  // For times less than 1 minute, we'll use the minimum
  const delayInMinutes = Math.max(timeUntilExpiration / (60 * 1000), 0.1)

  console.log(`[TIMER] Creating alarm for ${site} in ${delayInMinutes} minutes`)

  chrome.alarms.create(alarmName, {
    delayInMinutes: delayInMinutes
  })
}

export function stopTimer(site: string) {
  const alarmName = ALARM_PREFIX + site
  chrome.alarms.clear(alarmName, (wasCleared) => {
    if (wasCleared) {
      console.log(`[TIMER] Cleared alarm for ${site}`)
    }
  })
}

export async function handleTimerExpiration(site: string) {
  console.log(`[TIMER] Timer expired for site: ${site}`)

  // Mark task as completed
  const tasks = (await storage.get<Record<string, FocusTask>>("activeTasks")) || {}
  const task = tasks[site]

  console.log(`[TIMER] Task status:`, { task, completed: task?.completed })

  if (task && !task.completed) {
    tasks[site] = { ...task, completed: true }
    await storage.set("activeTasks", tasks)

    // Notify content script
    const tabs = await chrome.tabs.query({})
    console.log(`[TIMER] Found ${tabs.length} tabs, sending TIMER_EXPIRED message`)

    for (const tab of tabs) {
      if (tab.url && new URL(tab.url).hostname === site && tab.id) {
        console.log(`[TIMER] Sending TIMER_EXPIRED to tab ${tab.id} (${tab.url})`)
        chrome.tabs.sendMessage(tab.id, {
          type: "TIMER_EXPIRED",
          site
        }).catch((err) => {
          console.log(`[TIMER] Failed to send message to tab ${tab.id}:`, err)
        })
      }
    }
  } else {
    console.log(`[TIMER] Task not found or already completed, skipping notification`)
  }

  stopTimer(site)
}

// Check for any existing tasks with timers on startup
export async function initializeTimers() {
  const tasks = (await storage.get<Record<string, FocusTask>>("activeTasks")) || {}

  for (const task of Object.values(tasks)) {
    if (!task.completed && task.timeLimit && task.startedAt) {
      startTimer(task)
    }
  }
}

// Extract site name from alarm name
export function getSiteFromAlarmName(alarmName: string): string | null {
  if (alarmName.startsWith(ALARM_PREFIX)) {
    return alarmName.substring(ALARM_PREFIX.length)
  }
  return null
}
