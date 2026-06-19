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
    hourCycle: "h23",
    timeZone: "Asia/Shanghai"
  }).format(new Date(value));
}

export function formatPublicEventDateTime(value: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    hourCycle: "h23",
    timeZone: "Asia/Shanghai"
  }).formatToParts(new Date(value));
  const partMap = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${partMap.month}/${partMap.day} ${partMap.hour}:${partMap.minute}`;
}
