import { useState } from "react";
import { useNavigate } from "react-router";
import { repository } from "@/data/repositories";
import RegisterForm from "./components/register-form";

interface User {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await repository.auth.createUser(user);

      if (response.success) {
        // Redireciona para login após criação bem-sucedida
        navigate("/login");
      } else {
        throw new Error("Erro ao criar usuário");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erro ao criar usuário");
      } else {
        setError("Ocorreu um erro desconhecido");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserChange = (newUser: User) => {
    setUser(newUser);
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <RegisterForm
      user={user}
      error={error}
      isLoading={isLoading}
      onUserChange={handleUserChange}
      onSubmit={handleSubmit}
      onBackToLogin={handleBackToLogin}
    />
  );
}
