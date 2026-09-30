import { AuthCard, AuthLink } from "../components/auth-card";
import { TwoFactorForm } from "./two-factor-form";

export const metadata = {
  title: "Verificación en dos pasos",
};

export default function TwoFactorPage() {
  return (
    <AuthCard
      title="Verificación en dos pasos"
      description="Introduce el código de 6 caracteres generado por tu app de autenticación."
      footer={
        <>
          ¿Problemas para acceder? <AuthLink href="/auth/login" label="Volver al login" />
        </>
      }
    >
      <TwoFactorForm />
    </AuthCard>
  );
}
