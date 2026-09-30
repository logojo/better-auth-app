import { AuthCard, AuthLink } from "../components/auth-card";
import { RegisterForm } from "./register-form";

export const metadata = {
  title: "Crear cuenta",
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Crear cuenta"
      description="Completa tus datos para registrarte."
      footer={
        <>
          ¿Ya tienes cuenta? <AuthLink href="/auth/login" label="Inicia sesión" />
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
