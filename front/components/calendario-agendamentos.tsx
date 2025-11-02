"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 8 AM to 8 PM
const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

type TimeSlot = {
  day: number
  hour: number
  isLocked: boolean
  isScheduled: boolean
  alumni?: string
  subject?: string
}

// Mock data for scheduled and locked times
const mockSchedule: TimeSlot[] = [
  { day: 0, hour: 9, isLocked: false, isScheduled: true, alumni: "John Doe"},
  { day: 0, hour: 14, isLocked: false, isScheduled: true, alumni: "Jane Smith"},
  { day: 1, hour: 10, isLocked: false, isScheduled: true, alumni: "Mike Johnson"},
  { day: 1, hour: 12, isLocked: true, isScheduled: false }, // Lunch break
  { day: 2, hour: 11, isLocked: false, isScheduled: true, alumni: "Sarah Williams"},
  { day: 2, hour: 12, isLocked: true, isScheduled: false }, // Lunch break
  { day: 3, hour: 15, isLocked: false, isScheduled: true, alumni: "David Brown"},
  { day: 3, hour: 12, isLocked: true, isScheduled: false }, // Lunch break
  { day: 4, hour: 9, isLocked: false, isScheduled: true, alumni: "Emily Davis"},
  { day: 4, hour: 12, isLocked: true, isScheduled: false }, // Lunch break
  { day: 5, hour: 10, isLocked: false, isScheduled: true, alumni: "Chris Wilson"},
  { day: 6, hour: 14, isLocked: false, isScheduled: true, alumni: "Lisa Anderson"},
]

export function CalendarioAgendamentos() {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)

  const getSlotData = (day: number, hour: number): TimeSlot | undefined => {
    return mockSchedule.find((slot) => slot.day === day && slot.hour === hour)
  }

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour > 12 ? hour - 12 : hour
    return `${displayHour}:00 ${period}`
  }

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl font-bold">Calendário Semanal</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentWeek(currentWeek - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[120px] text-center">Semana {currentWeek + 1}</span>
          <Button variant="outline" size="icon" onClick={() => setCurrentWeek(currentWeek + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Header with days */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-2 mb-2">
              <div className="text-xs font-medium text-muted-foreground"></div>
              {DAYS.map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Time slots */}
            <div className="space-y-1">
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-[80px_repeat(7,1fr)] gap-2">
                  <div className="text-xs text-muted-foreground flex items-center">{formatHour(hour)}</div>
                  {DAYS.map((_, dayIndex) => {
                    const slotData = getSlotData(dayIndex, hour)
                    const isLocked = slotData?.isLocked
                    const isScheduled = slotData?.isScheduled

                    return (
                      <button
                        key={`${dayIndex}-${hour}`}
                        onClick={() => setSelectedSlot(slotData || null)}
                        className={cn(
                          "h-14 rounded-md border transition-all text-xs p-2 text-left",
                          "hover:border-primary/50",
                          isLocked && "bg-muted/50 border-muted cursor-not-allowed hover:border-muted",
                          isScheduled && "bg-primary/10 border-primary/30 hover:bg-primary/20",
                          !isLocked && !isScheduled && "border-border hover:bg-accent/5",
                        )}
                        disabled={isLocked}
                      >
                        {isLocked && (
                          <div className="flex items-center justify-center h-full">
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          </div>
                        )}
                        {isScheduled && slotData && (
                          <div className="space-y-0.5">
                            <div className="font-medium text-primary truncate">{slotData.subject}</div>
                            <div className="text-[12px]">{slotData.alumni}</div>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-border bg-background"></div>
            <span className="text-xs text-muted-foreground">Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-primary/30 bg-primary/10"></div>
            <span className="text-xs text-muted-foreground">Agendado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-muted bg-muted/50 flex items-center justify-center">
              <Lock className="h-2 w-2 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">Bloqueado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
