import "./banner.css"

export function renderBanner(text: string) {
  if (document.getElementById("focus-task-banner")) return

  const banner = document.createElement("div")
  banner.id = "focus-task-banner"
  banner.innerText = `🎯 Your task: ${text}`

  document.body.prepend(banner)
}
