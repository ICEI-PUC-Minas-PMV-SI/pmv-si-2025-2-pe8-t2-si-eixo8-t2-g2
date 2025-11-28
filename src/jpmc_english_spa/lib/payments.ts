import { apiClient } from "./client";

export type Payment = {
  id: number;
  aluno: string;
  value: number;
  agendamentoId: string;
  agendamentoDatetime: string;
  paid: boolean;
};

export async function fetchPayments(): Promise<Payment[]> {
  try {
    return await fetch(`${apiClient.baseUrl}/pagamentos`, {
      method: "GET",
      headers: apiClient.headers,
    }).then((res) => {
      if (!res.ok) throw new Error("Falha ao buscar pagamentos");
      return res.json();
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw new Error("Falha ao buscar pagamentos");
  }
}

export async function confirmPayment(paymentId: number) {
  try {
    return await fetch(`${apiClient.baseUrl}/pagamentos/${paymentId}`, {
      method: "PUT",
      headers: apiClient.headers,
    }).then((res) => {
      if (res.status !== 204) throw new Error("Falha ao confirmar pagamento");
      return;
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw new Error("Falha ao confirmar pagamento");
  }
}
