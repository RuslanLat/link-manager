import { ref, watch } from 'vue'

export function useTheme() {

    const checked = ref<boolean | null>(null)

    watch(checked, () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        checked.value
            ? document.documentElement.classList.add('app-dark')
            : document.documentElement.classList.remove('app-dark')
        localStorage.setItem('theme', checked.value ? 'dark' : 'ligth')
    })

    function getUserTheme() {
        const theme = localStorage.getItem('theme')
        if (theme) {
            checked.value = theme == 'dark'
        } else {
            checked.value = window.matchMedia('(prefers-color-scheme: dark)').matches
        }
    }

    return { checked, getUserTheme }
}