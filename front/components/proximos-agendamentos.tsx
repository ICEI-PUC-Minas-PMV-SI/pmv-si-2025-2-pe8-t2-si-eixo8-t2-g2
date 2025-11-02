"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Schedule = {
  id: string
  alumni: string
  date: string
  time: string
  status: "Em breve" | "in-progress" | "completed"
}

const mockSchedules: Schedule[] = [
  {
    id: "1",
    alumni: "John Doe",
    date: "2025-01-20",
    time: "9:00 AM",
    status: "Em breve",
  },
  {
    id: "2",
    alumni: "Jane Smith",
    date: "2025-01-20",
    time: "2:00 PM",
    status: "Em breve",
  },
  {
    id: "3",
    alumni: "Mike Johnson",
    date: "2025-01-21",
    time: "10:00 AM",
    status: "Em breve",
  },
  {
    id: "4",
    alumni: "Sarah Williams",
    date: "2025-01-22",
    time: "11:00 AM",
    status: "Em breve",
  },
  {
    id: "5",
    alumni: "David Brown",
    date: "2025-01-23",
    time: "3:00 PM",
    status: "Em breve",
  },
  {
    id: "6",
    alumni: "Emily Davis",
    date: "2025-01-24",
    time: "9:00 AM",
    status: "Em breve",
  },
  {
    id: "7",
    alumni: "Chris Wilson",
    date: "2025-01-25",
    time: "10:00 AM",
    status: "Em breve",
  },
  {
    id: "8",
    alumni: "Lisa Anderson",
    date: "2025-01-26",
    time: "2:00 PM",
    status: "Em breve",
  },
]

const ITEMS_PER_PAGE = 10

export function UpcomingSchedules() {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(mockSchedules.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentSchedules = mockSchedules.slice(startIndex, endIndex)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getStatusColor = (status: Schedule["status"]) => {
    switch (status) {
      case "Em breve":
        return "bg-primary/10 text-primary border-primary/20"
      case "in-progress":
        return "bg-accent/10 text-accent border-accent/20"
      case "completed":
        return "bg-muted text-muted-foreground border-muted"
      default:
        return "bg-muted text-muted-foreground border-muted"
    }
  }

  return (
    <Card className="bg-card h-fit">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Próximas aulas</CardTitle>
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
                    <span>{schedule.alumni}</span>
                  </div>
                </div>
                <Badge variant="outline" className={cn("text-xs", getStatusColor(schedule.status))}>
                  {schedule.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(schedule.date)}</span>
                  <Clock className="h-3.5 w-3.5" />
                  <span>{schedule.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  
      
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} - {Math.min(endIndex, mockSchedules.length)} de {mockSchedules.length}
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
  )
}
