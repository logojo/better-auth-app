'use client';

import { authClient } from "@/lib/auth-client";

export const UserEmailInformation = () => {

  //* Obteniendo la sessión del lado del cliente
  const { 
        data: session, 
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession() 


    if( isPending) return <div>Cargando...</div>

    if( error) return <div> Error found { error.message } </div>

    if( !session) return <div> No session found </div>



  return (
    <div className="shrink-0 text-right">
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
        {session.user.name}
      </p>
      <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
        {session.user.email}
      </p>
    </div>
  );
};
