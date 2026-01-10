<script setup>
    import { computed, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    // import { setTitle } from '@/utils/title'

    const route = useRoute()
    const router = useRouter()

    const title = computed(() => route.meta?.title || '功能即将上线')
    const desc = computed(() =>
        route.meta?.desc || '该工具正在开发中，敬请期待'
    )
	
    const goBack = () => {
        router.back()
    }
</script>

<template>
    <div class="page-container coming-soon">
        <div class="dashboard-card center">
            <h1 class="icon">🚧</h1>
            <h2 class="title">{{ title }}</h2>
            <p class="desc">{{ desc }}</p>

            <div class="actions">
                <button class="tool-btn-outline" @click="goBack">
                    返回
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .coming-soon {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 70vh;
    }

    .center {
        text-align: center;
    }

    .icon {
        font-size: 64px;
        margin-bottom: 0.5rem;
    }

    .title {
        margin: 0.5rem 0;
        font-weight: 600;
    }

    .desc {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
    }

    .actions {
        display: flex;
        justify-content: center;
    }
</style>
