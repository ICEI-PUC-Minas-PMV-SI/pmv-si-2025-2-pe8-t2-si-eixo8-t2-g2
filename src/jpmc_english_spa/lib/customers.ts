import { apiClient } from "./client";
import type { Customer } from "@/components/customers-table";

export async function getCustomers(): Promise<Customer[]> {
  try {
    return await fetch(`${apiClient.baseUrl}/alunos`, {
      method: "GET",
      headers: apiClient.headers,
    }).then((res) => {
      if (!res.ok) throw new Error("Falha ao buscar alunos");
      return res.json();
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("Falha ao buscar alunos");
  }
}

export async function createCustomer(
  data: Omit<Customer, "id" | "agendamentos" | "pagamentosAtrasados" | "registerDate">
): Promise<Customer> {
  try {
    const response = await fetch(`${apiClient.baseUrl}/alunos`, {
      method: "POST",
      headers: apiClient.headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create customer: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
}

export async function updateCustomer(
  id: string,
  data: Partial<
    Omit<Customer, "id" | "schedules" | "latePayments" | "scheduleDates">
  >
): Promise<Customer> {
  try {
    const response = await fetch(`${apiClient.baseUrl}/alunos/${id}`, {
      method: "PUT",
      headers: apiClient.headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update customer: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  try {
    const response = await fetch(`${apiClient.baseUrl}/alunos/${id}`, {
      method: "DELETE",
      headers: apiClient.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete customer: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
}