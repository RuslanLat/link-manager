import { supabase } from '@/supabase'
import { useRequest } from '@/composables/useRequest'
import type { User, Session, AuthError, WeakPassword, Provider } from '@supabase/supabase-js'

type DataType = {
    user?: User | null;
    session?: Session | null;
    weakPassword?: WeakPassword;
    provider?: Provider;
    url?: string;
};

export function useAuth() {
    const { loading, errorMessage, handleRequest } = useRequest()

    async function singUp(email: string, password: string, firstName: string) {
        return await handleRequest<DataType, AuthError>(async () => {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            })
            await supabase.from('users').insert([{ id: data.user?.id, firstName, email }])
            if (error) throw error
            return data
        })

    }

    async function singIn(email: string, password: string) {
        return await handleRequest<DataType, AuthError>(async () => {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error
            return data
        })

    }

    async function resetPassword(password: string) {
        return await handleRequest<object, AuthError>(async () => {
            const { data, error } = await supabase.auth.resetPasswordForEmail(password, { redirectTo: 'https://latif-link-manager.netlify.app/reset-password' })
            if (error) throw error
            return data
        })

    }

    async function updatePassword(password: string) {
        return await handleRequest<DataType, AuthError>(async () => {
            const { data, error } = await supabase.auth.updateUser({ password })
            if (error) throw error
            return data as DataType
        })

    }

    async function singInWithGitHub() {
        return await handleRequest<DataType, AuthError>(async () => {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'github'
            })
            if (error) throw error
            return data
        })

    }

    async function signOut() {
        return await handleRequest<null, AuthError>(async () => {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            return null
        })

    }

    return { loading, errorMessage, singUp, singIn, resetPassword, updatePassword, singInWithGitHub, signOut }
}