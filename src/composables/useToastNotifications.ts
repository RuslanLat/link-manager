import { useToast } from 'primevue/usetoast'

export function useToastNotifications() {
    const toast = useToast()

    function showToast(severity: string, summary: string, detail: string = 'Что-то пошло не так', life: number = 3000) {
        toast.add({ severity, summary, detail, life })
    }

    return { showToast }
}
