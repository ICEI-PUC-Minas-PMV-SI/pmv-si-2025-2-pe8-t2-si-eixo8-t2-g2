import { apiClient } from "./client";

export type Schedule = {
  id: string;
  alunoId: string;
  alunoName: string;
  subject: string;
  datetime: string;
  duration: string;
  status: "upcoming" | "in-progress" | "completed";
  isLocked?: boolean;
};

export type TimeSlot = {
  agendamentoId?: number;
  day: number;
  hour: number;
  isLocked: boolean;
  isScheduled: boolean;
  alunoName?: string;
};

export async function fetchAgendamentos(startDate: string, endDate: string) {
  try {
    return await fetch(
      `${apiClient.baseUrl}/agendamentos?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: apiClient.headers,
      }
    ).then((res) => {
      if (!res.ok) throw new Error("Falha ao buscar agendamentos");
      return res.json();
    });
  } catch (error) {
    console.error("Error fetching agendamentos:", error);
    throw new Error("Falha ao buscar agendamentos");
  }
}

export async function fetchAgendamentosFuturos() {
  try {
    return await fetch(`${apiClient.baseUrl}/agendamentos-futuros`, {
      method: "GET",
      headers: apiClient.headers,
    }).then((res) => {
      if (!res.ok) throw new Error("Falha ao buscar agendamentos futuros");
      return res.json();
    });
  } catch (error) {
    console.error("Error fetching agendamentos futuros:", error);
    throw new Error("Falha ao buscar agendamentos futuros");
  }
}

export async function createSchedule(data: {
  alunoId: string;
  paymentValue: number;
  paymentPaid: boolean;
  datetime: string;
}) {
  try {
    const response = await fetch(`${apiClient.baseUrl}/agendamentos`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: apiClient.headers,
    });

    if (!response.ok) {
      throw new Error(`Falha ao criar agendamento: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("[v0] Falha ao criar agendamento:", error);
    throw error;
  }
}

export async function cancelSchedule(id: number): Promise<void> {
  try {
    const response = await fetch (`${apiClient.baseUrl}/agendamentos/${id}`, {
      method: "DELETE",
      headers: apiClient.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete schedule: ${response.statusText}`);
    }
  } catch (error) {
    console.error("[v0] Error deleting schedule:", error);
    throw error;
  }
}
