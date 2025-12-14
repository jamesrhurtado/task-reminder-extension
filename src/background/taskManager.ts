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
