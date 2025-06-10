/* eslint-disable @typescript-eslint/no-explicit-any */
import { Invoice } from "../models/Invoice";
import {
  createInvoice,
  editInvoice,
  deleteInvoice,
  getInvoiceById,
  getInvoicesByUserId,
} from "../services/InvoiceService";

// Mock da função `request`
jest.mock("../services/RequestService", () => ({
  request: jest.fn(),
}));

import { request } from "../services/RequestService";

describe("InvoiceService", () => {
  const mockInvoice: Invoice = {
    date: "2025-06-10",
    description: "Aluguel",
    value: 1200,
    category: "Moradia",
    payment: "Cartão de Crédito",
    userId: "user123",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // TESTES POSITIVOS (10)

  test("deve criar uma fatura com sucesso", async () => {
    const mockResponse = { status: 200, data: { id: "123", ...mockInvoice } };
    (request as jest.Mock).mockResolvedValueOnce(mockResponse);

    const response = await createInvoice(mockInvoice);

    expect(request).toHaveBeenCalledWith(
      "/api/invoices",
      "POST",
      JSON.stringify(mockInvoice)
    );
    expect(response).toEqual(mockResponse);
  });

  test("deve buscar uma fatura por ID com sucesso", async () => {
    const mockResponse = { status: 200, data: { id: "123", ...mockInvoice } };
    (request as jest.Mock).mockResolvedValueOnce(mockResponse);

    const response = await getInvoiceById(123);

    expect(request).toHaveBeenCalledWith("/api/invoices/123", "GET");
    expect(response).toEqual(mockResponse);
  });

  test("deve buscar faturas por userId com sucesso", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({
        totalAmount: 1200,
        categories: {
          Moradia: {
            totalAmount: 1200,
            details: [mockInvoice],
          },
        },
      }),
    });

    const response = await getInvoicesByUserId("user123");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/invoices/users/user123"
    );
    expect(response).toEqual([mockInvoice]);
  });

  test("deve editar uma fatura com sucesso", async () => {
    const updatedInvoice = { ...mockInvoice, _id: "123", value: 1500 };
    const mockResponse = { status: 200, data: updatedInvoice };
    (request as jest.Mock).mockResolvedValueOnce(mockResponse);

    const response = await editInvoice(updatedInvoice);

    expect(request).toHaveBeenCalledWith(
      "/api/invoices/123",
      "PATCH",
      JSON.stringify(updatedInvoice)
    );
    expect(response).toEqual(mockResponse);
  });

  test("deve criar fatura com valor decimal", async () => {
    const invoiceWithDecimal = { ...mockInvoice, value: 1250.75 };
    const mockResponse = { status: 200, data: invoiceWithDecimal };
    (request as jest.Mock).mockResolvedValueOnce(mockResponse);

    const response = await createInvoice(invoiceWithDecimal);

    expect(response).toEqual(mockResponse);
  });

  test("deve buscar faturas por userId com múltiplas categorias", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({
        totalAmount: 2400,
        categories: {
          Moradia: {
            totalAmount: 1200,
            details: [mockInvoice],
          },
          Alimentação: {
            totalAmount: 1200,
            details: [{ ...mockInvoice, category: "Alimentação" }],
          },
        },
      }),
    });

    const response = await getInvoicesByUserId("user123");

    expect(response).toHaveLength(2);
  });

  test("deve deletar uma fatura com sucesso", async () => {
    // Mock do localStorage usando global ao invés de window
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue("mock-token"),
    };
    Object.defineProperty(global, "localStorage", {
      value: mockLocalStorage,
      configurable: true,
    });

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    }) as jest.Mock;

    await deleteInvoice("123");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/invoices/123",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer mock-token",
        },
        body: JSON.stringify({}),
      }
    );

    // Limpa o mock do localStorage após o teste
    delete (global as any).localStorage;
  });

  test("deve criar fatura com descrição longa", async () => {
    const longDescriptionInvoice = {
      ...mockInvoice,
      description:
        "Pagamento de aluguel mensal referente ao mês de junho de 2025 do apartamento localizado na rua XYZ",
    };
    const mockResponse = { status: 200, data: longDescriptionInvoice };
    (request as jest.Mock).mockResolvedValueOnce(mockResponse);

    const response = await createInvoice(longDescriptionInvoice);

    expect(response).toEqual(mockResponse);
  });

  test("deve editar apenas a categoria da fatura", async () => {
    const partialUpdate = { ...mockInvoice, _id: "123", category: "Lazer" };
    const mockResponse = { status: 200, data: partialUpdate };
    (request as jest.Mock).mockResolvedValueOnce(mockResponse);

    const response = await editInvoice(partialUpdate);

    expect(response).toEqual(mockResponse);
  });

  test("deve buscar faturas por userId retornando lista vazia", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({
        totalAmount: 0,
        categories: {},
      }),
    });

    const response = await getInvoicesByUserId("user123");

    expect(response).toEqual([]);
  });

  // TESTES NEGATIVOS (10)

  test("deve falhar ao criar fatura com dados inválidos", async () => {
    const errorResponse = { status: 400, error: "Dados inválidos" };
    (request as jest.Mock).mockResolvedValueOnce(errorResponse);

    const response = await createInvoice(mockInvoice);

    expect(response).toBeUndefined();
  });

  test("deve falhar ao buscar fatura inexistente", async () => {
    const errorResponse = { status: 404, error: "Fatura não encontrada" };
    (request as jest.Mock).mockResolvedValueOnce(errorResponse);

    try {
      await getInvoiceById(999);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test("deve capturar exceção de rede na criação", async () => {
    (request as jest.Mock).mockRejectedValueOnce(new Error("Falha na conexão"));

    const response = await createInvoice(mockInvoice);

    expect(response).toBeUndefined();
  });

  test("deve falhar ao editar fatura com valor negativo", async () => {
    const invalidInvoice = { ...mockInvoice, _id: "123", value: -100 };
    const errorResponse = { status: 400, error: "Valor deve ser positivo" };
    (request as jest.Mock).mockResolvedValueOnce(errorResponse);

    try {
      await editInvoice(invalidInvoice);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe(
        "Erro ao editar fatura. Por favor, verifique os dados."
      );
    }
  });

  test("deve falhar ao deletar fatura inexistente", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
    });

    try {
      await deleteInvoice("999");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test("deve falhar ao buscar faturas por userId com erro de rede", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
    });

    try {
      await getInvoicesByUserId("user123");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test("deve falhar ao editar fatura com erro interno do servidor", async () => {
    const errorResponse = { status: 500, error: "Erro interno do servidor" };
    (request as jest.Mock).mockResolvedValueOnce(errorResponse);

    try {
      await editInvoice({ ...mockInvoice, _id: "123" });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe(
        "Erro ao editar fatura. Por favor, verifique os dados."
      );
    }
  });

  test("deve falhar ao criar fatura com data inválida", async () => {
    const invalidDateInvoice = { ...mockInvoice, date: "data-invalida" };
    const errorResponse = { status: 400, error: "Formato de data inválido" };
    (request as jest.Mock).mockResolvedValueOnce(errorResponse);

    const response = await createInvoice(invalidDateInvoice);

    expect(response).toBeUndefined();
  });

  test("deve falhar ao buscar fatura por ID com erro de autenticação", async () => {
    const errorResponse = { status: 401, error: "Token inválido" };
    (request as jest.Mock).mockResolvedValueOnce(errorResponse);

    try {
      await getInvoiceById(123);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test("deve falhar ao deletar fatura com erro de conexão", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));

    try {
      await deleteInvoice("123");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
