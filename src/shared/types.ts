export type FocusTask = {
  id: string
  site: string
  description: string
  createdAt: number
  completed: boolean
}

export type AutoPromptConfig = {
  domains: string[]
}

export type ExtensionMessage =
  | { type: "GET_ACTIVE_TASK"; site: string }
  | { type: "CREATE_TASK"; task: FocusTask }
  | { type: "TASK_COMPLETED" }
  | { type: "COMPLETE_TASK_MANUALLY" }
  | { type: "TASK_COMPLETED_UI" }
  | { type: "TASK_CREATED"; task: FocusTask }
  | { type: "GET_AUTO_PROMPT_DOMAINS" }
  | { type: "ADD_AUTO_PROMPT_DOMAIN"; domain: string }
  | { type: "REMOVE_AUTO_PROMPT_DOMAIN"; domain: string }

