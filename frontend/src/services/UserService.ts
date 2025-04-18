import { User } from "../models/User";
import { request } from "./RequestService";

// Função realizar Login
export async function userLogin(email: string, password: string) {
    try {
        const response = await request("/api/users/login", "POST", JSON.stringify({ email, password }));

        // Verifica se a resposta contém um indicativo de sucesso (ex.: token ou usuário)
        if (!response || (response.status && response.status !== 200) || response.error) {
            throw new Error("Email ou senha inválidos. Por favor, verifique suas credenciais.");
        }
        return response; // Retorna a resposta apenas se o login for bem-sucedido
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        // Trata outros erros genéricos
        throw new Error("Email ou senha inválidos. Por favor, verifique suas credenciais.");
    }
}

// Função para criar usuário
export async function createUser(user :User) {
    try {
        const response = await request("/api/users", "POST", JSON.stringify(user));

        // Verifica se a resposta contém um indicativo de sucesso (ex.: token ou usuário)
        if (!response || (response.status && response.status !== 200) || response.error) {
            throw new Error("Erro ao criar usuário. Por favor, verifique os dados.");
        }
        return response; // Retorna a resposta apenas se o login for bem-sucedido

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        // Trata outros erros genéricos
        throw new Error("Erro ao criar usuário. Por favor, verifique os dados.");
    }
}