import { ref, onMounted, watch } from 'vue'

export function useTheme() {
    const isDark = ref(false)

    // 初始化
    onMounted(() => {
        const saved = localStorage.getItem('theme')

        if (saved === 'dark') {
            isDark.value = true
        } else if (saved === 'light') {
            isDark.value = false
        } else {
            // 自动跟随系统
            isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
        }

        applyTheme()
    })

    // 切换主题
    const toggleTheme = () => {
        isDark.value = !isDark.value
    }

    // 监听变化 → 自动应用 + 持久化
    watch(isDark, () => {
        localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
        applyTheme()
    })

    const applyTheme = () => {
        const html = document.documentElement
        if (isDark.value) {
            html.classList.add('dark')
        } else {
            html.classList.remove('dark')
        }
    }

    return { isDark, toggleTheme }
}
