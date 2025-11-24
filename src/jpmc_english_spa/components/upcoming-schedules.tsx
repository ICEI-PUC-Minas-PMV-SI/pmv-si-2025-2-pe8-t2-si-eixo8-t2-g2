"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchAgendamentosFuturos, type Schedule } from "@/lib/schedules";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 5;

export function UpcomingSchedules() {
  const [currentPage, setCurrentPage] = useState(1);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        setLoading(true);
        const data = await fetchAgendamentosFuturos();
        setSchedules(data || []);
      } catch (error) {
        console.error("[v0] Error loading schedules:", error);
        toast.error("Falha ao carregar agendamentos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadSchedules();
  }, []);

  const totalPages = Math.ceil(schedules.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSchedules = schedules.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", { month: "short", day: "numeric" });
  };

  const formatHour = (dateString: string) => {
    // Localize time formatting
    const date = new Date(new Date(dateString).getTime() - new Date(dateString).getTimezoneOffset() * 60000);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: Schedule["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-primary/10 text-primary border-primary/20";
      case "in-progress":
        return "bg-accent/10 text-accent border-accent/20";
      case "completed":
        return "bg-muted text-muted-foreground border-muted";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  const getStatusLabel = (status: Schedule["status"]) => {
    const statusMap: { [key: string]: string } = {
      scheduled: "Em breve",
      completed: "Concluído",
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <Card className="bg-card h-fit">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Próximos Agendamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">
              Carregando agendamentos...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card h-fit">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Próximos Agendamentos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {currentSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    <span>{schedule.alunoName}</span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn("text-xs", getStatusColor(schedule.status))}
                >
                  {getStatusLabel(schedule.status)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(schedule.datetime)}</span>
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatHour(schedule.datetime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1}-{Math.min(endIndex, schedules.length)} de{" "}
            {schedules.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
