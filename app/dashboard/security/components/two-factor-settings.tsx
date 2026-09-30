'use client';

import { useState } from 'react';

import { authClient } from '@/lib/auth-client';

import { PasswordConfirmModal } from './password-confirm-modal';
import { TwoFactorSetup } from './two-factor-setup';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


type TwoFactorSettingsProps = {
  isEnabled?: boolean;
};

type SetupData = {
  totpUri: string;
  secretKey: string;
  backupCodes: string[];
};

// Datos de ejemplo para el diseño. Se reemplazarán por la respuesta del servidor.
// const MOCK_SETUP_DATA: SetupData = {
//   totpUri:
//     'otpauth://totp/DemoApp:usuario@ejemplo.com?secret=JBSWY3DPEHPK3PXP&issuer=DemoApp',
//   secretKey: 'JBSWY3DPEHPK3PXP',
//   backupCodes: [
//     '8f3a-2b1c',
//     'd4e5-6f7a',
//     '1c2d-3e4f',
//     '9a8b-7c6d',
//     '5e4f-3a2b',
//     '7c8d-9e0f',
//     '2b3c-4d5e',
//     '6f7a-8b9c',
//   ],
// };

export function TwoFactorSettings({ isEnabled = false }: TwoFactorSettingsProps) {
  const router = useRouter();
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [modalAction, setModalAction] = useState<'enable' | 'disable'>('enable');
  const [setupData, setSetupData] = useState<SetupData | null>(null);

  function handleOpenPasswordModal(action: 'enable' | 'disable') {
    setModalAction(action);
    setShowPasswordModal(true);
  }

  function handleClosePasswordModal() {
    setShowPasswordModal(false);
  }

  async function handlePasswordConfirmed(_password: string) {
    setShowPasswordModal(false);
    console.log({ _password });
    

    if (modalAction === 'enable') {
      //* Activando el twoFactorAuthentication para esta cuenta
      const { data, error } = await authClient.twoFactor.enable({
            password: _password, // required, The user’s password. Required for email/password accounts.
            method: "totp", // The 2FA method to enable.
            issuer: "better-auth-app", // Custom issuer for the TOTP URI. Defaults to the app name in your auth config.
        }
      );
  

      if( error ) {
        toast.error(error.message, {
                      icon: null,
                      position: 'top-center'
                    });
        return;
      }

    
      setSetupData({
        totpUri: data.totpURI,
        secretKey: data.totpURI,
        backupCodes: data.backupCodes
      });

      return;
    }

    //*desactivar 2FA
    const { data, error } = await authClient.twoFactor.disable({
        password: _password, // The user's password (required for credential accounts)
    });

   if( error ) {
      toast.error(error.message, {
                    icon: null,
                    position: 'top-center'
                  });
      return;
    }

     toast.success('2FA desactiva correctamente', {
                    icon: null,
                    position: 'top-center'
                  });

    setSetupData(null);
    router.refresh();
  }

  function handleCancelSetup() {
    setSetupData(null);
  }

  async function handleCompleteSetup( verificationCode : string ) {
    
    //* verificando el codigo para el two factor authentication
    const { data, error } = await authClient.twoFactor.verifyTotp({
        code: verificationCode, // required, The otp code to verify.
        trustDevice: false, // If true, the device will be trusted for 30 days. It'll be refreshed on every sign in request within this time.
    });

    if( error ) {
      toast.error(error.message, {
                    icon: null,
                    position: 'top-center'
                  });
      return;
    }
    console.log(data);

    toast.success('2FA activado correctamente!!!', {
                    icon: null,
                    position: 'top-center'
                  });
    
    setSetupData(null);
    router.refresh();
  }

  const modalCopy =
    modalAction === 'enable'
      ? {
          title: 'Confirma tu contraseña',
          description:
            'Antes de activar la autenticación en dos pasos, necesitamos verificar que eres tú.',
          confirmLabel: 'Activar 2FA',
        }
      : {
          title: 'Confirma tu contraseña',
          description:
            'Antes de desactivar la autenticación en dos pasos, necesitamos verificar que eres tú.',
          confirmLabel: 'Desactivar 2FA',
        };

  return (
    <div className="space-y-6">
      <StatusCard isEnabled={isEnabled} />

      {setupData ? (
        <TwoFactorSetup
          totpUri={setupData.totpUri}
          secretKey={setupData.secretKey}
          backupCodes={setupData.backupCodes}
          onComplete={handleCompleteSetup}
          onCancel={handleCancelSetup}
        />
      ) : !isEnabled ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            ¿Por qué activar 2FA?
          </h2>
          <ul className="mt-4 space-y-3">
            {[
              'Protege tu cuenta aunque alguien conozca tu contraseña.',
              'Añade un segundo factor con una app como Google Authenticator o Authy.',
              'Reduce el riesgo de accesos no autorizados a tu panel.',
            ].map((benefit) => (
              <li
                key={benefit}
                className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400"
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  aria-hidden
                >
                  ✓
                </span>
                {benefit}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => handleOpenPasswordModal('enable')}
            className="mt-6 h-11 rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Activar autenticación en dos pasos
          </button>
        </section>
      ) : (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            La autenticación en dos pasos está activa en tu cuenta.
          </p>
          <button
            type="button"
            onClick={() => handleOpenPasswordModal('disable')}
            className="mt-4 h-11 rounded-lg border border-zinc-300 px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Desactivar autenticación en dos pasos
          </button>
        </section>
      )}

      <PasswordConfirmModal
        isOpen={showPasswordModal}
        onClose={handleClosePasswordModal}
        onConfirm={handlePasswordConfirmed}
        title={modalCopy.title}
        description={modalCopy.description}
        confirmLabel={modalCopy.confirmLabel}
      />
    </div>
  );
}

function StatusCard({ isEnabled }: { isEnabled: boolean }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800"
            aria-hidden
          >
            <ShieldIcon />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Autenticación en dos pasos (2FA)
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {isEnabled
                ? 'Tu cuenta requiere un código de verificación al iniciar sesión.'
                : 'La autenticación en dos pasos no está configurada en tu cuenta.'}
            </p>
          </div>
        </div>
        <span
          className={
            isEnabled
              ? 'rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
          }
        >
          {isEnabled ? 'Activo' : 'Desactivado'}
        </span>
      </div>
    </section>
  );
}

function ShieldIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-6 w-6 text-zinc-700 dark:text-zinc-300"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
      />
    </svg>
  );
}
