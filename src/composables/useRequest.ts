import { ref } from 'vue'
import type { AuthError, PostgrestError } from '@supabase/supabase-js'

export function useRequest() {
    const loading = ref<boolean>(false)
    const errorMessage = ref('')

    const handleRequest = async <T, E extends AuthError | PostgrestError>(fn: () => Promise<T>): Promise<T> => {
        errorMessage.value = ''
        loading.value = true
        try {
            return await fn()
        } catch (error) {
            const err = error as E
            errorMessage.value = err.message
            throw error
        } finally {
            loading.value = false
        }
    }


    return { loading, errorMessage, handleRequest }
}