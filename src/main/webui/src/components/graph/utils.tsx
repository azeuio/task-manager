export function toUserId(username: string) {
  return `user ${username}`;
}

export function toTaskId(taskId: number) {
  return `task ${taskId}`;
}

export function toStatusId(statusIndex: number) {
  return `status ${statusIndex}`;
}
