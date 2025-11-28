import { ScheduleCalendar } from "@/components/schedule-calendar"
import { UpcomingSchedules } from "@/components/upcoming-schedules"

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-balance mb-2">Agendamentos</h1>
          <p className="text-muted-foreground text-pretty">Visualize e gerencie os agendamentos de aulas dos alunos</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <ScheduleCalendar />
          <UpcomingSchedules />
        </div>
      </div>
    </div>
  )
}
