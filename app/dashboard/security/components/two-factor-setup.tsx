'use client';

import { useState } from 'react';
import QRCode from 'react-qr-code';
import { OtpInput } from '@/app/auth/components/otp-input';

type TwoFactorSetupProps = {
  totpUri: string;
  secretKey: string;
  backupCodes: string[];
  onComplete: ( code: string) => void;
  onCancel: () => void;
};

export function TwoFactorSetup({
  totpUri,
  secretKey,
  backupCodes,
  onComplete,
  onCancel,
}: TwoFactorSetupProps) {
  const [codesAcknowledged, setCodesAcknowledged] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [copyFeedback, setCopyFeedback] = useState<'secret' | 'codes' | null>(null);

  const isVerificationComplete = verificationCode.length === 6;
  const canComplete = codesAcknowledged && isVerificationComplete;

  async function handleCopySecret() {
    await navigator.clipboard.writeText(secretKey);
    setCopyFeedback('secret');
    setTimeout(() => setCopyFeedback(null), 2000);
  }

  async function handleCopyCodes() {
    await navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopyFeedback('codes');
    setTimeout(() => setCopyFeedback(null), 2000);
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Configura la autenticación en dos pasos
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Escanea el código QR con tu app de autenticación, guarda los códigos
          de respaldo y verifica que todo funciona con un código de tu app.
        </p>
      </div>

      <div className="space-y-8 p-6">
        <SetupStep
          step={1}
          title="Escanea el código QR"
          description="Abre Google Authenticator, Authy u otra app compatible y escanea este código."
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
              <QRCode
                value={totpUri}
                size={176}
                level="M"
                className="h-44 w-44"
              />
            </div>

            <div className="w-full max-w-sm space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                ¿No puedes escanear?
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Introduce esta clave manualmente en tu app de autenticación:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 font-mono text-sm tracking-wider text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50">
                  {secretKey}
                </code>
                <button
                  type="button"
                  onClick={handleCopySecret}
                  className="shrink-0 rounded-lg border border-zinc-300 px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  {copyFeedback === 'secret' ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            </div>
          </div>
        </SetupStep>

        <SetupStep
          step={2}
          title="Guarda tus códigos de respaldo"
          description="Si pierdes acceso a tu app de autenticación, podrás usar uno de estos códigos para iniciar sesión. Cada código solo funciona una vez."
        >
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
            <div className="flex gap-3">
              <WarningIcon />
              <p className="text-sm text-amber-900 dark:text-amber-200">
                Descarga o copia estos códigos ahora. No podrás verlos de nuevo
                después de completar la configuración.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {backupCodes.map((code) => (
              <div
                key={code}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-center font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              >
                {code}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopyCodes}
            className="mt-4 h-10 rounded-lg border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            {copyFeedback === 'codes' ? 'Códigos copiados' : 'Copiar todos los códigos'}
          </button>

          <label className="mt-5 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={codesAcknowledged}
              onChange={(event) => setCodesAcknowledged(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900/20 dark:border-zinc-600 dark:bg-zinc-900"
            />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              He guardado mis códigos de respaldo en un lugar seguro.
            </span>
          </label>
        </SetupStep>

        <SetupStep
          step={3}
          title="Verifica el código"
          description="Introduce el código de 6 caracteres que muestra tu app de autenticación para confirmar que la configuración es correcta."
        >
          <div className="max-w-sm">
            <OtpInput
              id="two-factor-verification-code"
              name="verificationCode"
              value={verificationCode}
              onChange={setVerificationCode}
            />
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
              El código cambia cada 30 segundos. Usa el que aparece ahora en tu
              app.
            </p>
          </div>
        </SetupStep>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-zinc-200 px-6 py-5 dark:border-zinc-800">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-lg border border-zinc-300 px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => onComplete( verificationCode ) }
          disabled={!canComplete}
          className="h-11 rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Completar configuración
        </button>
      </div>
    </section>
  );
}

type SetupStepProps = {
  step: number;
  title: string;
  description: string;
  children: React.ReactNode;
};

function SetupStep({ step, title, description, children }: SetupStepProps) {
  return (
    <div className="flex gap-4">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white dark:bg-zinc-50 dark:text-zinc-900"
        aria-hidden
      >
        {step}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function WarningIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
      />
    </svg>
  );
}
