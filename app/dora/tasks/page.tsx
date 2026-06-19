import type { Metadata } from "next";
import { DoraOfficeShell } from "@/components/DoraOfficeShell";
import { TaskBoard } from "@/app/dora/tasks/TaskBoard";
import { publicDoraTasks, publicDoraTaskStats } from "@/lib/dora-office";

export const metadata: Metadata = {
  title: "Doraemon Tasks",
  description: "Public-safe Doraemon Office task aggregation with opaque IDs, fixed titles, and no execution controls."
};

export default function DoraTasksPage() {
  return (
    <DoraOfficeShell
      active="/dora/tasks"
      title="Task Operations"
      summary="A public queue of sanitized task posture: opaque keys, fixed labels, owner-review signals, and no execution controls."
      showBoundaryStrip={false}
    >
      <TaskBoard tasks={publicDoraTasks} stats={publicDoraTaskStats} />
    </DoraOfficeShell>
  );
}
