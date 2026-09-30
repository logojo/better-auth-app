"use client";

import type { SubmitEvent } from "react";
import { toast } from 'sonner';

import { authClient } from "@/lib/auth-client";

import { AuthDivider } from "../components/auth-divider";
import { AuthField } from "../components/auth-field";
import { SocialSignInButtons } from "../components/social-sign-in-buttons";

export function LoginForm() {

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    

    const { data, error } = await authClient.signIn.email({
            email,
            password,
            callbackURL: "/dashboard",            
            rememberMe: false
    }, {
        onRequest: () => {
          console.log('loading');
        },
        onSuccess: () => {
          console.log('success');
        },
        onError: async (ctx) => {
          if( ctx.error.status === 403 ) {

            toast.error('Email no verificado', {
              icon: null,
              position: 'top-center'
            });
            // enviando nuevamente el correo para verificacion de correo
            await authClient.sendVerificationEmail({
              email,
              callbackURL: '/' //se debe de crear pagina para mostrar verificar correo
            })
          }
          else if( ctx.error.status === 401)
              toast.error('Credenciales incorrectas', {
                icon: null,
                position: 'top-center'
              });
          else               
              toast.error('Ocurrio un error, contacte al administrdor', {
                  icon: null,
                  position: 'top-center'
                });
            
        }
    })
  }

  return (
    <>
      <SocialSignInButtons />
      <AuthDivider />
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
        autoComplete="current-password"
      />
      <button
        type="submit"
        className="mt-1 h-11 rounded-lg bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Entrar
      </button>

      </form>
    </>
  );
}
