import { NextResponse } from 'next/server'
import { headers } from 'next/headers';
import type { NextRequest } from 'next/server'

import { auth } from './lib/auth';
 
//* función proxy que me permite validar mis rutas para que no se pueda ingresar si no hay sesión
//* esto anteriormente era llamado un middlewere

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  //* tambien se puede manejar rutas por perfil de usuario
  if( !session )
      return NextResponse.redirect(new URL('/auth/login', request.url))

    return NextResponse.next();
}
 
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
 
export const config = {
   //* se puede mandar tambien un arreglo de rutas a proteger por el proxy
  //matcher: ['/about/:path*', '/dashboard/:path*'],
  matcher: '/dashboard/:path*',
}