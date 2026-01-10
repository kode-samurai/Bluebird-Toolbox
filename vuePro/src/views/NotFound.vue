<script setup>
    // import { onMounted } from 'vue'
    import { useRouter } from 'vue-router'

    import { useTheme } from "../components/dark-control";

    const { isDark, toggleTheme } = useTheme()


    const router = useRouter()

    // onMounted(() => {
    //     setTitle('404 - 页面不存在')
    // })

    const messages = [
        '你似乎迷路了🤔',
        '这里什么都没有🤓',
        '该页面已消失在时间中',
        '该页面已经被丢进历史的垃圾堆了🫡'
    ]

    const msg = messages[Math.floor(Math.random() * messages.length)]

    const goHome = () => {
        router.push('/')
    }
</script>

<template>
    <button class="theme-toggle" @click="toggleTheme">
        <i :class="isDark ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill'"></i>
    </button>
    <div class="page-container not-found">
        <div class="dashboard-card center">
            <h1 class="code">404 Not Found</h1>
            <p class="desc">{{ msg }}</p>

            <div class="actions">
                <button class="tool-btn" @click="goHome">
                    返回首页
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .not-found {
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
        color: var(--primary);
    }

    .desc {
        margin: 1rem 0 1.5rem;
        color: var(--text-secondary);
        font-size: 1rem;
    }

    .actions {
        display: flex;
        justify-content: center;
    }
</style>
