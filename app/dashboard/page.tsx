import { auth } from '@/lib/auth';
import { StatCard } from './components/stat-card';
import { UserEmailInformation } from './components/user-email-information';
import { headers } from 'next/headers';

const recentActivity = [
  {
    id: '1',
    action: 'Nuevo registro',
    detail: 'usuario@ejemplo.com',
    time: 'Hace 5 min',
  },
  {
    id: '2',
    action: 'Inicio de sesión',
    detail: 'admin@ejemplo.com',
    time: 'Hace 12 min',
  },
  {
    id: '3',
    action: 'Sesión cerrada',
    detail: 'invitado@ejemplo.com',
    time: 'Hace 1 h',
  },
  {
    id: '4',
    action: 'Contraseña actualizada',
    detail: 'demo@ejemplo.com',
    time: 'Hace 3 h',
  },
];

//tomando la sesión de betterAuth del lado del servidor

export default async function  DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  return (
    <>
      <header className="border-b border-zinc-200 bg-white px-8 py-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-start justify-between gap-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Resumen
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Vista general de la aplicación. Los datos son de ejemplo para
              practicar el diseño.
            </p>
          </div>

          {/* Información del usuario */}
          <UserEmailInformation />
        </div>
      </header>

      <main className="flex-1 space-y-8 p-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Usuarios" value="128" hint="+12 esta semana" />
          <StatCard
            label="Sesiones activas"
            value="24"
            hint="En las últimas 24 h"
          />
          <StatCard label="Registros hoy" value="7" hint="Desde medianoche" />
          <StatCard
            label="Proveedores OAuth"
            value="2"
            hint="Google y GitHub"
          />
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Actividad para: { session?.user.name }
                </h2>
              </div>
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {recentActivity.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {item.action}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {item.detail}
                      </p>
                    </div>
                    <time className="shrink-0 text-xs text-zinc-500">
                      {item.time}
                    </time>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Estado del sistema
            </h2>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">
                  API de auth
                </span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Operativo
                </span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Base de datos
                </span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Conectada
                </span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Better Auth
                </span>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  En configuración
                </span>
              </li>
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-zinc-500">
              Cuando integres Better Auth, puedes reemplazar estos valores con
              datos reales de sesión y usuario.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
