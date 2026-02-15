import "./messageRouter"
import { initializeTimers, getSiteFromAlarmName, handleTimerExpiration, handleTimerWarning, isWarningAlarm } from "./timerManager"

console.log("Background running (Phase 1)")

// Initialize timers on startup
initializeTimers()

// Listen for alarm events (when timers expire or warnings fire)
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log(`[ALARM] Alarm fired: ${alarm.name}`)

  const site = getSiteFromAlarmName(alarm.name)
  if (site) {
    if (isWarningAlarm(alarm.name)) {
      handleTimerWarning(site)
    } else {
      handleTimerExpiration(site)
    }
  } else {
    console.log(`[ALARM] Unknown alarm: ${alarm.name}`)
  }
})

