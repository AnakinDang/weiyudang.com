export const DORA_LIVE_BRIDGE_URL = "https://dora.weiyudang.com";
export const DORA_RELAY_HEALTH_URL = "https://relay.weiyudang.com/health";
export const DORA_RELAY_WS_URL = "wss://relay.weiyudang.com/ws/events";

export type PublicDoraEventClientView = {
  event_id: string;
  created_at: string;
  event_type: "agent_work" | "handoff" | "tool_call" | "owner_review" | "alert" | "system";
  agent: string;
  state: "Planning" | "Working" | "Tool call" | "Handoff" | "Owner review" | "Completed" | "Attention" | "Demo";
  severity: "normal" | "info" | "warning";
  title: string;
};

export const publicSystemToneClasses = {
  normal: "is-normal",
  info: "is-info",
  private: "is-private"
} as const;

export const publicDoraTaskToneClasses = {
  "Owner review": "is-warning",
  Working: "is-info",
  Attention: "is-danger",
  Completed: "is-normal"
} as const;

export const publicDoraScheduleToneClasses = {
  Working: "is-info",
  "Owner review": "is-warning"
} as const;
