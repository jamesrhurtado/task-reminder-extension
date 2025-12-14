export type FocusTask = {
  id: string
  site: string
  description: string
  createdAt: number
  completed: boolean
}

export type ExtensionMessage =
  | { type: "GET_ACTIVE_TASK"; site: string }
  | { type: "CREATE_TASK"; task: FocusTask }
