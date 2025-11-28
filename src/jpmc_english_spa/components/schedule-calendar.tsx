"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchAgendamentos, type TimeSlot } from "@/lib/schedules";
import { toast, Toaster } from "sonner";
import { AddScheduleModal } from "./add-schedule-modal";
import { DeleteScheduleModal } from "./delete-schedule-modal";

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8);
const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];

export function ScheduleCalendar() {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedHour, setSelectedHour] = useState(8);
  const [selectedDatetime, setSelectedDatetime] = useState<Date>(new Date());

  const getWeekStartDate = (weekOffset: number) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff + weekOffset * 7));
    return monday;
  };

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const weekStart = getWeekStartDate(currentWeek);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const formatDate = (date: Date) => date.toISOString().split("T")[0];
      const startDateStr = formatDate(weekStart);
      const endDateStr = formatDate(weekEnd);

      const schedules = await fetchAgendamentos(startDateStr, endDateStr);

      // Combine schedules and locked times into time slots
      const combinedSlots: TimeSlot[] = [];

      if (schedules && Array.isArray(schedules)) {
        console.log("found schedules:", schedules);
        schedules.forEach((schedule: any) => {
          combinedSlots.push({
            agendamentoId: schedule.id,
            day:
              new Date(
                new Date(schedule.datetime).getTime() -
                  new Date(schedule.datetime).getTimezoneOffset() * 60000
              ).getDay() - 1,
            hour: new Date(
              new Date(schedule.datetime).getTime() -
                new Date(schedule.datetime).getTimezoneOffset() * 60000
            ).getHours(),
            isLocked: false,
            isScheduled: true,
            alunoName: schedule.alunoName,
          });
        });
      }
      console.log("combinedSlots:", combinedSlots);
      setSlots(combinedSlots);
    } catch (error) {
      console.error("[v0] Error loading schedules:", error);
      toast.error("Falha ao carregar agendamentos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, [currentWeek]);

  const getSlotData = (day: number, hour: number): TimeSlot | undefined => {
    return slots.find((slot) => slot.day === day && slot.hour === hour);
  };

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  const getWeekLabel = () => {
    const weekStart = getWeekStartDate(currentWeek);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const formatDate = (date: Date) =>
      date.toLocaleDateString("pt-BR", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
  };

  const handleSlotClick = (day: number, hour: number) => {
    const slotData = getSlotData(day, hour);

    if (slotData?.isLocked) {
      return;
    }
    const scheduleDate = new Date();
    scheduleDate.setDate(getWeekStartDate(currentWeek).getDate() + day);
    scheduleDate.setHours(hour, 0, 0, 0);

    setSelectedDatetime(scheduleDate);
    setSelectedDay(day);
    setSelectedHour(hour);

    if (slotData?.isScheduled) {
      setSelectedSlot(slotData);
      setDeleteModalOpen(true);
    } else {
      setAddModalOpen(true);
    }
  };

  const handleAddSchedule = (data: { alunoName: string }) => {
    const newSlot: TimeSlot = {
      day: selectedDay,
      hour: selectedHour,
      isLocked: false,
      isScheduled: true,
      alunoName: data.alunoName,
    };
    setSlots([...slots, newSlot]);
  };

  const handleDeleteSchedule = () => {
    setSlots(
      slots.filter(
        (slot) => !(slot.day === selectedDay && slot.hour === selectedHour)
      )
    );
  };

  return (
    <>
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">
            Calendário Semanal
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentWeek(currentWeek - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[180px] text-center">
              {getWeekLabel()}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentWeek(currentWeek + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">
                Carregando agendamentos...
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  {/* Header with days */}
                  <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-2 mb-2">
                    <div className="text-xs font-medium text-muted-foreground"></div>
                    {DAYS.map((day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-semibold text-foreground"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Time slots */}
                  <div className="space-y-1">
                    {HOURS.map((hour) => (
                      <div
                        key={hour}
                        className="grid grid-cols-[80px_repeat(7,1fr)] gap-2"
                      >
                        <div className="text-xs text-muted-foreground flex items-center">
                          {formatHour(hour)}
                        </div>
                        {DAYS.map((_, dayIndex) => {
                          const slotData = getSlotData(dayIndex, hour);
                          const isLocked = slotData?.isLocked;
                          const isScheduled = slotData?.isScheduled;
                          return (
                            <button
                              key={`${dayIndex}-${hour}`}
                              onClick={() => handleSlotClick(dayIndex, hour)}
                              className={cn(
                                "h-14 rounded-md border transition-all text-xs p-2 text-left",
                                "hover:border-primary/50",
                                isLocked &&
                                  "bg-muted/50 border-muted cursor-not-allowed hover:border-muted",
                                isScheduled &&
                                  "bg-primary/10 border-primary/30 hover:bg-primary/20 cursor-pointer",
                                !isLocked &&
                                  !isScheduled &&
                                  "border-border hover:bg-accent/5 cursor-pointer"
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
                                  <div className="text-[10px] text-muted-foreground">
                                    {slotData.alunoName}
                                  </div>
                                </div>
                              )}
                            </button>
                          );
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
                  <span className="text-xs text-muted-foreground">
                    Disponível
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-primary/30 bg-primary/10"></div>
                  <span className="text-xs text-muted-foreground">
                    Agendado
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-muted bg-muted/50 flex items-center justify-center">
                    <Lock className="h-2 w-2 text-muted-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Bloqueado
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <Toaster />
      </Card>

      <AddScheduleModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        datetime={selectedDatetime}
        onAdd={handleAddSchedule}
      />
      <DeleteScheduleModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        alunoName={selectedSlot?.alunoName}
        onDelete={handleDeleteSchedule}
        agendamentoId={selectedSlot?.agendamentoId}
      />
    </>
  );
}
