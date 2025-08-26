import { ref } from 'vue'

export function useMyRequest() {
    const loading = ref<boolean>(false)


    const handleRequest = async <T>(fn: () => Promise<T>): Promise<T> => {

        loading.value = true
        const result = await fn()
        loading.value = false
        return result
    }

    return { loading, handleRequest }
}