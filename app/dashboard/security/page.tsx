import { auth } from '@/lib/auth';
import { UserEmailInformation } from '../components/user-email-information';
import { TwoFactorSettings } from './components/two-factor-settings';
import { headers } from 'next/headers';

export const metadata = {
  title: 'Seguridad — Dashboard',
};

export default async function SecurityPage() {
  //* obteniendo la sesión del lado del servidor
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  //*verificando si esta activado el 2FA
  const isEnable2FA = session?.user.twoFactorEnabled || false;

  return (
    <>
      <header className="border-b border-zinc-200 bg-white px-8 py-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-start justify-between gap-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Seguridad
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Gestiona la autenticación en dos pasos y otras opciones de
              protección de tu cuenta.
            </p>
          </div>

          <UserEmailInformation />
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="max-w-3xl">
          <TwoFactorSettings isEnabled={ isEnable2FA } />
        </div>
      </main>
    </>
  );
}
