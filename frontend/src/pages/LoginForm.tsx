import { useState } from "react";
import { useNavigate } from "react-router";
import { userLogin } from "../services/UserService";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await userLogin(email, password);

      if (response.token) {
        // Armazena o token e dados básicos do usuário
        localStorage.setItem("session", JSON.stringify({
          token: response.token,
          id: response.id
        }));
        navigate("/menu");
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erro ao fazer login");
      } else {
        setError("Ocorreu um erro desconhecido");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={submitForm} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full bg-slate-50 border border-slate-600 focus:border-slate-900 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full bg-slate-50 border border-slate-600 focus:border-slate-900 rounded-md px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 text-white font-medium rounded-md transition-colors ${
              isLoading
                ? "bg-slate-500 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-700"
            }`}
          >
            {isLoading ? "Carregando..." : "Entrar"}
          </button>
        </form>

        {/* Botão de criar usuário adicionado aqui */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/createuser")}
            className="text-slate-900 hover:text-slate-700 font-medium text-sm underline"
          >
            Criar conta
          </button>
        </div>
      </div>
    </div>
  );
}