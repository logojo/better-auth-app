import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins"

import { Pool } from "pg";

export const auth = betterAuth({
    plugins: [ twoFactor() ],
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: true //por que la bd esta en la nube y tiene ssl activo, no se requiere en local
    }),

    //Email provider
    emailAndPassword: { 
        enabled: true, 
        requireEmailVerification: true
    }, 
    emailVerification: {
        sendOnSignIn: true,
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail:async( { user, url, token }) => {
            console.log('Send verification Email:', { user, url, token });
            //*aqui se ejecuta la funsión para enviar correo electronico a la persona
            //await sentCustomEmail( url );
        }
    },

    //proovedores
    socialProviders: { 
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        }, 
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    }, 
});