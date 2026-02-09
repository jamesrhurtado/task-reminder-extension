import "./messageRouter"
import { initializeTimers, getSiteFromAlarmName, handleTimerExpiration } from "./timerManager"

console.log("Background running (Phase 1)")

// Initialize timers on startup
initializeTimers()

// Listen for alarm events (when timers expire)
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log(`[ALARM] Alarm fired: ${alarm.name}`)

  const site = getSiteFromAlarmName(alarm.name)
  if (site) {
    handleTimerExpiration(site)
  } else {
    console.log(`[ALARM] Unknown alarm: ${alarm.name}`)
  }
})

