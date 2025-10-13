import { useState } from "react";
import { useNavigate } from "react-router";
import { repository } from "@/data/repositories";
import LoginForm from "./components/login-form";

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
      const response = await repository.auth.login(email, password);

      if (response.success && response.data.token) {
        localStorage.setItem("session", JSON.stringify({
          token: response.data.token,
          id: response.data.id
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

  const handleCreateAccount = () => {
    navigate("/register");
  };

  return (
    <LoginForm
      email={email}
      password={password}
      error={error}
      isLoading={isLoading}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={submitForm}
      onCreateAccount={handleCreateAccount}
    />
  );
}