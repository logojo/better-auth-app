"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { OtpInput } from "../components/otp-input";
import { toast } from "sonner";

export function TwoFactorForm() {
  const router = useRouter()
  const [code, setCode] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Two factor code:", code);

    const { data, error } = await authClient.twoFactor.verifyTotp({
        code: code, // required, The otp code to verify.
        trustDevice: false, // If true, the device will be trusted for 30 days. It'll be refreshed on every sign in request within this time.
    });

    if( error ) {
      toast.error(error.message, {
                    icon: null,
                    position: 'top-center'
                  });
      return;
    }

    router.replace('/dashboard')


  }

  const isComplete = code.length === 6;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label
          htmlFor="code"
          className="text-center text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Código de verificación
        </label>
        <OtpInput id="code" name="code" value={code} onChange={setCode} />
        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          Introduce el código de 6 caracteres de tu app de autenticación.
        </p>
      </div>

      <button
        type="submit"
        disabled={!isComplete}
        className="h-11 rounded-lg bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Verificar
      </button>
    </form>
  );
}
