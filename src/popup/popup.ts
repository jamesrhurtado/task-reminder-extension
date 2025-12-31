import type { FocusTask } from "../shared/types"

// Tab switching
const tabBtns = document.querySelectorAll(".tab-btn")
const taskTab = document.getElementById("taskTab")!
const domainsTab = document.getElementById("domainsTab")!

tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.getAttribute("data-tab")

    tabBtns.forEach(b => b.classList.remove("active"))
    btn.classList.add("active")

    if (tab === "task") {
      taskTab.classList.add("active")
      domainsTab.classList.remove("active")
    } else {
      taskTab.classList.remove("active")
      domainsTab.classList.add("active")
      loadDomains()
    }
  })
})

// Task creation
const taskInput = document.getElementById("taskInput") as HTMLInputElement
const saveBtn = document.getElementById("saveBtn")!

saveBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab?.url) return

  const site = new URL(tab.url).hostname

  const task: FocusTask = {
    id: crypto.randomUUID(),
    site,
    description: taskInput.value,
    createdAt: Date.now(),
    completed: false
  }

  chrome.runtime.sendMessage({ type: "CREATE_TASK", task }, (response) => {
    if (response?.success) {
      window.close()
    }
  })
})

// Domain management
const domainInput = document.getElementById("domainInput") as HTMLInputElement
const addDomainBtn = document.getElementById("addDomainBtn")!
const domainsList = document.getElementById("domainsList")!

addDomainBtn.addEventListener("click", async () => {
  const domain = domainInput.value.trim().toLowerCase()

  if (!domain) return

  // Remove protocol and path if user pasted a full URL
  const cleanDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]

  chrome.runtime.sendMessage({
    type: "ADD_AUTO_PROMPT_DOMAIN",
    domain: cleanDomain
  }, () => {
    domainInput.value = ""
    loadDomains()
  })
})

function loadDomains() {
  chrome.runtime.sendMessage({ type: "GET_AUTO_PROMPT_DOMAINS" }, (domains: string[]) => {
    domainsList.innerHTML = ""

    if (!domains || domains.length === 0) {
      domainsList.innerHTML = '<li class="empty-state">No auto-prompt domains configured</li>'
      return
    }

    domains.forEach(domain => {
      const li = document.createElement("li")
      li.innerHTML = `
        <span>${domain}</span>
        <button data-domain="${domain}">Remove</button>
      `

      li.querySelector("button")!.addEventListener("click", () => {
        chrome.runtime.sendMessage({
          type: "REMOVE_AUTO_PROMPT_DOMAIN",
          domain
        }, () => {
          loadDomains()
        })
      })

      domainsList.appendChild(li)
    })
  })
}

// Load domains on popup open if on domains tab
if (domainsTab.classList.contains("active")) {
  loadDomains()
}
