import { AuthCard, AuthLink } from "../components/auth-card";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Iniciar sesión"
      description="Introduce tu email y contraseña para acceder."
      footer={
        <>
          ¿No tienes cuenta? <AuthLink href="/auth/register" label="Regístrate" />
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
