import { twoFactorClient } from "better-auth/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    plugins: [ twoFactorClient({
        twoFactorPage: '/auth/two-factor'
    }) ],
    baseURL: process.env.BETTER_AUTH_URL,
})