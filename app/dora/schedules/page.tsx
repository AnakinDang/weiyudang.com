import type { Metadata } from "next";
import { DoraOfficeShell } from "@/components/DoraOfficeShell";
import { ScheduleBoard } from "@/app/dora/schedules/ScheduleBoard";
import { publicScheduleBoundaries, publicSchedules } from "@/lib/dora-office";

export const metadata: Metadata = {
  title: "Doraemon Schedules",
  description: "Public-safe Doraemon Office schedule rhythm with no scheduler command strings, local paths, prompts, or controls."
};

export default function DoraSchedulesPage() {
  return (
    <DoraOfficeShell
      active="/dora/schedules"
      title="Schedules"
      summary="A public rhythm of recurring Doraemon Office workflows with coarse cadence, next window, and safe state labels."
      showBoundaryStrip={false}
    >
      <ScheduleBoard schedules={publicSchedules} boundaries={publicScheduleBoundaries} />
    </DoraOfficeShell>
  );
}
