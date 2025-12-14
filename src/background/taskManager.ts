import type { FocusTask } from "../shared/types"
import { storage } from "../shared/storage"

const TASK_KEY = "activeTasks"

export async function getTaskForSite(site: string): Promise<FocusTask | null> {
  const tasks = (await storage.get<Record<string, FocusTask>>(TASK_KEY)) || {}
  return tasks[site] ?? null
}

export async function saveTask(task: FocusTask) {
  const tasks = (await storage.get<Record<string, FocusTask>>(TASK_KEY)) || {}
  tasks[task.site] = task
  await storage.set(TASK_KEY, tasks)
}

export async function completeTaskForSite(url?: string) {
  if (!url) return

  const site = new URL(url).hostname
  const task = await getTaskForSite(site)

  if (!task) return
  if (task.completed) return

  const completedTask = {
    ...task,
    completed: true
  }

  await saveTask(completedTask)
}
