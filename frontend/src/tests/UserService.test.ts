import { userLogin, createUser } from "../services/UserService";
import { request } from "../services/RequestService";
import { User } from "../models/User";

// Mock da função `request`
jest.mock("../services/RequestService", () => ({
    request: jest.fn(),
}));

describe("UserService", () => {
    const mockUser: User = {
        name: "João Silva",
        email: "joao@example.com",
        password: "123456",
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    // TESTES POSITIVOS (10)

    test("deve realizar login com sucesso", async () => {
        const mockResponse = { status: 200, data: { token: "abc123", user: mockUser } };
        (request as jest.Mock).mockResolvedValueOnce(mockResponse);

        const response = await userLogin("joao@example.com", "123456");

        expect(request).toHaveBeenCalledWith(
            "/api/users/login",
            "POST",
            JSON.stringify({ email: "joao@example.com", password: "123456" })
        );
        expect(response).toEqual(mockResponse);
    });

    test("deve criar usuário com sucesso", async () => {
        const mockResponse = { status: 200, data: { id: "123", ...mockUser } };
        (request as jest.Mock).mockResolvedValueOnce(mockResponse);

        const response = await createUser(mockUser);

        expect(request).toHaveBeenCalledWith(
            "/api/users",
            "POST",
            JSON.stringify(mockUser)
        );
        expect(response).toEqual(mockResponse);
    });

    test("deve realizar login com email válido e senha forte", async () => {
        const mockResponse = { status: 200, data: { token: "strongToken123" } };
        (request as jest.Mock).mockResolvedValueOnce(mockResponse);

        const response = await userLogin("usuario@domain.com", "SenhaForte123!");

        expect(response).toEqual(mockResponse);
    });

    test("deve criar usuário com nome longo", async () => {
        const userWithLongName = {
            ...mockUser,
            name: "João Carlos da Silva Santos Oliveira"
        };
        const mockResponse = { status: 200, data: userWithLongName };
        (request as jest.Mock).mockResolvedValueOnce(mockResponse);

        const response = await createUser(userWithLongName);

        expect(response).toEqual(mockResponse);
    });

    test("deve realizar login com email em maiúsculas", async () => {
        const mockResponse = { status: 200, data: { token: "token123" } };
        (request as jest.Mock).mockResolvedValueOnce(mockResponse);

        const response = await userLogin("JOAO@EXAMPLE.COM", "123456");

        expect(response).toEqual(mockResponse);
    });

    test("deve criar usuário com email corporativo", async () => {
        const corporateUser = {
            ...mockUser,
            email: "funcionario@empresa.com.br"
        };
        const mockResponse = { status: 200, data: corporateUser };
        (request as jest.Mock).mockResolvedValueOnce(mockResponse);

        const response = await createUser(corporateUser);

        expect(response).toEqual(mockResponse);
    });

    test("deve realizar login retornando dados do usuário", async () => {
        const mockResponse = {
            status: 200,
            data: {
                token: "jwt123",
                user: { id: "456", name: "Maria", email: "maria@test.com" }
            }
        };
        (request as jest.Mock).mockResolvedValueOnce(mockResponse);

        const response = await userLogin("maria@test.com", "senha123");

        expect(response.data.user.name).toBe("Maria");
    });

    test("deve criar usuário com senha numérica", async () => {
        const numericPasswordUser = { ...mockUser, password: "123456789" };
        const mockResponse = { status: 200, data: numericPasswordUser };
        (request as jest.Mock).mockResolvedValueOnce(mockResponse);

        const response = await createUser(numericPasswordUser);

        expect(response).toEqual(mockResponse);
    });

    test("deve realizar login com resposta sem status explícito", async () => {
        const mockResponse = { data: { token: "validToken" } };
        (request as jest.Mock).mockResolvedValueOnce(mockResponse);

        const response = await userLogin("user@test.com", "password");

        expect(response).toEqual(mockResponse);
    });

    test("deve criar usuário com nome contendo acentos", async () => {
        const accentedUser = { ...mockUser, name: "José António" };
        const mockResponse = { status: 200, data: accentedUser };
        (request as jest.Mock).mockResolvedValueOnce(mockResponse);

        const response = await createUser(accentedUser);

        expect(response).toEqual(mockResponse);
    });

    // TESTES NEGATIVOS (10)

    test("deve falhar no login com credenciais inválidas", async () => {
        const errorResponse = { status: 401, error: "Credenciais inválidas" };
        (request as jest.Mock).mockResolvedValueOnce(errorResponse);

        await expect(userLogin("wrong@email.com", "wrongpass"))
            .rejects.toThrow("Email ou senha inválidos. Por favor, verifique suas credenciais.");
    });

    test("deve falhar na criação com dados inválidos", async () => {
        const errorResponse = { status: 400, error: "Dados inválidos" };
        (request as jest.Mock).mockResolvedValueOnce(errorResponse);

        await expect(createUser(mockUser))
            .rejects.toThrow("Erro ao criar usuário. Por favor, verifique os dados.");
    });

    test("deve falhar no login com resposta null", async () => {
        (request as jest.Mock).mockResolvedValueOnce(null);

        await expect(userLogin("test@test.com", "123456"))
            .rejects.toThrow("Email ou senha inválidos. Por favor, verifique suas credenciais.");
    });

    test("deve falhar na criação com resposta undefined", async () => {
        (request as jest.Mock).mockResolvedValueOnce(undefined);

        await expect(createUser(mockUser))
            .rejects.toThrow("Erro ao criar usuário. Por favor, verifique os dados.");
    });

    test("deve falhar no login com erro de rede", async () => {
        (request as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

        await expect(userLogin("test@test.com", "123456"))
            .rejects.toThrow("Email ou senha inválidos. Por favor, verifique suas credenciais.");
    });

    test("deve falhar na criação com erro de conexão", async () => {
        (request as jest.Mock).mockRejectedValueOnce(new Error("Connection failed"));

        await expect(createUser(mockUser))
            .rejects.toThrow("Erro ao criar usuário. Por favor, verifique os dados.");
    });

    test("deve falhar no login com status 500", async () => {
        const errorResponse = { status: 500, error: "Erro interno do servidor" };
        (request as jest.Mock).mockResolvedValueOnce(errorResponse);

        await expect(userLogin("user@test.com", "password"))
            .rejects.toThrow("Email ou senha inválidos. Por favor, verifique suas credenciais.");
    });

    test("deve falhar na criação com email já existente", async () => {
        const errorResponse = { status: 409, error: "Email já cadastrado" };
        (request as jest.Mock).mockResolvedValueOnce(errorResponse);

        await expect(createUser(mockUser))
            .rejects.toThrow("Erro ao criar usuário. Por favor, verifique os dados.");
    });

    test("deve falhar no login com resposta contendo error", async () => {
        const errorResponse = { data: {}, error: "Authentication failed" };
        (request as jest.Mock).mockResolvedValueOnce(errorResponse);

        await expect(userLogin("test@test.com", "123456"))
            .rejects.toThrow("Email ou senha inválidos. Por favor, verifique suas credenciais.");
    });

    test("deve falhar na criação com resposta contendo error", async () => {
        const errorResponse = { data: {}, error: "Validation failed" };
        (request as jest.Mock).mockResolvedValueOnce(errorResponse);

        await expect(createUser(mockUser))
            .rejects.toThrow("Erro ao criar usuário. Por favor, verifique os dados.");
    });
});