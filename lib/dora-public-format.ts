const publicToolLabels = {
  browser_check: "Browser check"
} as const;

export function getPublicToolLabel(toolName?: string) {
  if (!toolName || !(toolName in publicToolLabels)) {
    return undefined;
  }

  return publicToolLabels[toolName as keyof typeof publicToolLabels];
}

export function formatPublicEventTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Shanghai"
  }).format(new Date(value));
}
