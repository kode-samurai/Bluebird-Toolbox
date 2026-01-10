<script setup>
    import { ref } from 'vue'
    // import axios from 'axios'
    import http from '../components/http';
    import { useTheme } from "../components/dark-control";

    const { isDark, toggleTheme } = useTheme()

    const n = ref(10)
    const fib = ref([])
    const loading = ref(false)
    const error = ref('')
    const copySuccess = ref(false)

    const generate = async () => {
        if (loading.value || n.value > 100) return
        loading.value = true
        error.value = ''
        try {
            const response = await http.post('/api/math/fibonacci/', { n: n.value })
            fib.value = response.data.fibonacci
        } catch (err) {
            error.value = '生成失败，请检查输入'
        } finally {
            loading.value = false
        }
    }

    const clearAll = () => {
        n.value = 10
        fib.value = []
        error.value = ''
        copySuccess.value = false
    }

    const copyToClipboard = () => {
        if (!fib.value.length) return
        navigator.clipboard.writeText(fib.value.join(', '))
            .then(() => {
                copySuccess.value = true
                setTimeout(() => (copySuccess.value = false), 2000)
            })
            .catch(() => {
                error.value = '复制失败'
            })
    }

    const badgeColors = [
        'bg-danger',
        'bg-warning text-dark',
        'bg-success',
        'bg-info',
        'bg-primary',
        'bg-secondary',
        'bg-dark',
        'bg-pink', 
        'bg-purple'
    ]
</script>

<template>
    <div class="top-actions">
        <router-link to="/feedback" class="theme-toggle" aria-label="Bug 反馈">
            <i class="bi bi-cup-hot-fill"></i>
        </router-link>

        <button class="theme-toggle" @click="toggleTheme" aria-label="切换主题">
            <i :class="isDark ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill'"></i>
        </button>
    </div>

    <div class="page-container">
        <h2 class="page-title"><i class="bi bi-calculator"></i> 斐波那契数列生成器</h2>

        <div class="dashboard-card">
            <div class="tool-card-body">

                <div class="mb-3">
                    <label class="form-label">N（最大 100）</label>
                    <input v-model="n" type="number" min="1" max="100" required />
                </div>

                <div class="d-flex justify-content-between align-items-center mb-3">
                    <button @click="generate" class="btn btn-primary" :disabled="loading">
                        生成
                    </button>
                    <button @click="clearAll" class="btn btn-outline-danger">清空</button>
                </div>

                <div v-if="loading" class="text-center mb-2">
                    <div class="spinner-border text-primary"></div>
                </div>

                <p v-if="error" class="text-danger">{{ error }}</p>

                <div v-if="fib.length" class="mt-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="mb-0">结果：</h5>
                        <button @click="copyToClipboard" class="btn btn-sm btn-outline-secondary">
                            {{ copySuccess ? '已复制 ✅' : '复制结果' }}
                        </button>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                        <span v-for="(num, index) in fib" :key="index" class="badge rounded-pill"
                            :class="badgeColors[index % badgeColors.length]">
                            {{ num }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="info-card">
            <div class="card-body">
                <h5 class="card-title text-info">
                    <i class="bi bi-info-circle me-2"></i>说明
                </h5>
                <ul class="list-unstyled mb-0">
                    <li class="mb-2">
                        <i class="bi bi-arrow-right-circle text-primary me-2"></i>
                        从 <b>0, 1</b> 开始，后项 = 前两项之和
                    </li>
                    <li class="mb-2">
                        <i class="bi bi-list-ol text-success me-2"></i>
                        前几项：<b>0, 1, 1, 2, 3, 5, 8...</b>
                    </li>
                    <li>
                        <i class="bi bi-lightbulb text-warning me-2"></i>
                        广泛应用于数学、算法和自然规律
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>

    .bg-pink {
        background-color: #e83e8c !important;
        color: #fff !important;
    }

    .bg-purple {
        background-color: #6f42c1 !important;
        color: #fff !important;
    }

    .card-title {
        font-weight: 600;
    }

    ul li {
        font-size: 0.95rem;
        line-height: 1.6;
    }
</style>
