<script setup>
    import { onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { useTheme } from "../components/dark-control"
    const { isDark, toggleTheme } = useTheme()

    const router = useRouter()

    const messages = [
        '服务器开小差了，请稍后再试',
        '服务器挂了，正在全力抢修🥵',
        '🗿服务器已扑街，全力抢修中...'
    ]

    const msg = messages[Math.floor(Math.random() * messages.length)]

    const reload = () => {
        location.reload()
    }

    const goHome = () => {
        router.push('/')
    }
</script>

<template>
    <button class="theme-toggle" @click="toggleTheme">
        <i :class="isDark ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill'"></i>
    </button>
    <div class="page-container error-page">
        <div class="dashboard-card center">
            <h1 class="code"> 50X </h1>
            <p class="desc">{{ msg }}</p>

            <div class="actions">
                <button class="tool-btn" @click="reload">刷新页面</button>
                <button class="tool-btn-outline" @click="goHome">返回首页</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .error-page {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 70vh;
    }

    .center {
        text-align: center;
    }

    .code {
        font-size: 96px;
        font-weight: 800;
        margin: 0;
        letter-spacing: 4px;
        color: var(--danger);
    }

    .desc {
        margin: 1rem 0 1.5rem;
        color: var(--text-secondary);
    }

    .actions {
        display: flex;
        gap: 12px;
        justify-content: center;
    }
</style>
