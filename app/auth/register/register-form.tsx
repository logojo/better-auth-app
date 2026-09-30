"use client";

import { useRouter } from "next/navigation";
import type { SubmitEvent } from "react";

import { authClient } from "@/lib/auth-client";

import { AuthDivider } from "../components/auth-divider";
import { AuthField } from "../components/auth-field";
import { SocialSignInButtons } from "../components/social-sign-in-buttons";


export function RegisterForm() {
  const router = useRouter();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    console.log("Register:", { name, email, password });


    const { data, error } = await authClient.signUp.email({
          email, // user email address
          password, // user password -> min 8 characters by default
          name, // user display name
          callbackURL: "/dashboard" // enviar a verificar email
      }, {
          onRequest: (ctx) => {
             console.log('cargando');
          },
          onSuccess: (ctx) => {
             console.log('todo bien', ctx);
             router.push('/')
          },
          onError: (ctx) => {
              // display the error message
              alert(ctx.error.message);
          },
  });
  }

  return (
    <>
      <SocialSignInButtons />
      <AuthDivider />
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <AuthField
        id="name"
        label="Nombre"
        type="text"
        name="name"
        autoComplete="name"
      />
      <AuthField
        id="email"
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
      />
      <AuthField
        id="password"
        label="Contraseña"
        type="password"
        name="password"
        autoComplete="new-password"
      />
      <button
        type="submit"
        className="mt-1 h-11 rounded-lg bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Registrarse
      </button>
      </form>
    </>
  );
}
