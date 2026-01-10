<script setup>
    import { useTheme } from "../components/dark-control";
    const { isDark, toggleTheme } = useTheme();
</script>

<template>
    <div class="top-actions">
        <button class="theme-toggle" @click="toggleTheme" aria-label="切换主题">
            <i :class="isDark ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill'"></i>
        </button>
    </div>

    <div class="page-container">
        <h2 class="page-title">
            <i class="bi bi-bug-fill"></i>
            Bug / 建议反馈
        </h2>

        <div class="dashboard-card">
            <p class="feedback-item mb-3">
                如果你在使用过程中遇到问题，或有改进建议，欢迎通过以下方式联系我：
            </p>

            <div class="feedback-list">
                <p class="feedback-item">
                    <i class="bi bi-envelope"></i>
                    微软邮箱：
                    <span>www.U2FsdGVkX1@outlook.com</span>
                </p>

                <p class="feedback-item">
                    <i class="bi bi-envelope-at"></i>
                    谷歌邮箱：
                    <span>wangnick31@gmail.com</span>
                </p>

                <a class="feedback-item feedback-link" href="https://github.com/yourname/your-repo" target="_blank"
                    rel="noopener noreferrer">
                    <i class="bi bi-github"></i>
                    GitHub 项目页
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .feedback-list {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }

    .feedback-item {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.8rem 1rem;
        border-radius: 0.75rem;
        background: var(--input-bg);
        border: 1px solid var(--input-border);
        color: var(--text-primary);
        font-size: 0.95rem;
    }

    .feedback-item span {
        font-weight: 500;
    }

    .feedback-link {
        text-decoration: none;
    }

    .feedback-link:hover {
        border-color: var(--input-focus-border);
        background: var(--input-hover-bg);
    }
    
</style>
