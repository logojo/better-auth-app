'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

const navItems = [
  { href: '/dashboard', label: 'Resumen' },
  { href: '/dashboard/security', label: 'Seguridad' },
  { href: '#', label: 'Usuarios' },
  { href: '#', label: 'Sesiones' },
  { href: '#', label: 'Ajustes' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter()

  const onLogout = async() => {
    await authClient.signOut({
      fetchOptions: {
        onRequest:() => {
          console.log('loading');
          
        },
        onSuccess: () => {
          //ya no es necesario indicar la ruta por que el proxy se esta encargando de eso
          //router.refresh();
          router.replace("/auth/login"); // redirect to home page
        },
        onError: ( ctx ) => {
          console.log('manejando el error', ctx.error );
          
        }
      },
    });

  }


  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-white px-4 py-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-8 px-2">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Admin
        </p>
        <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Dashboard
        </p>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={
                isActive
                  ? 'rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
                  : 'rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50'
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <Link
          href="/"
          className="block rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
        >
          Volver al inicio
        </Link>
        <Link
          href="/auth/login"
          className="mt-1 block rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
        >
          Iniciar sesión
        </Link>
        <button
          onClick={onLogout}
          type="button"
          className="mt-2 block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
