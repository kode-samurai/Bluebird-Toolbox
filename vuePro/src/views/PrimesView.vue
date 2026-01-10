<script setup>
    import { ref, computed } from 'vue'
    // import axios from 'axios'
    import http from '../components/http';
    import { useTheme } from "../components/dark-control";

    const { isDark, toggleTheme } = useTheme()

    const m = ref(1)
    const n = ref(100)
    const primes = ref([])
    const loading = ref(false)
    const error = ref('')
    const page = ref(1)
    const pageSize = 50
    const copySuccess = ref(false)

    const paginatedPrimes = computed(() =>
        primes.value.slice((page.value - 1) * pageSize, page.value * pageSize)
    )
    const totalPages = computed(() => Math.ceil(primes.value.length / pageSize))

    const findPrimes = async () => {
        if (loading.value) return
        loading.value = true
        error.value = ''
        page.value = 1
        try {
            const response = await http.post('/api/math/primes/', {
                m: m.value,
                n: n.value,
            })
            primes.value = response.data.primes
        } catch (err) {
            error.value = '查询出错，请检查输入'
        } finally {
            loading.value = false
        }
    }

    const nextPage = () => {
        if (page.value < totalPages.value) page.value++
    }
    const prevPage = () => {
        if (page.value > 1) page.value--
    }

    const getBadgeColor = (index) => {
        const colors = [
            'bg-primary text-light',
            'bg-success text-light',
            'bg-info text-dark',
            'bg-warning text-dark',
            'bg-danger text-light',
        ]
        return colors[index % colors.length]
    }

    const copyToClipboard = (all = false) => {
        const numbers = all ? primes.value : paginatedPrimes.value
        const text = numbers.join(', ')
        navigator.clipboard.writeText(text).then(() => {
            copySuccess.value = true
            setTimeout(() => (copySuccess.value = false), 2000)
        })
    }
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
        <h2 class="page-title"><i class="bi bi-calculator"></i> 区间素数生成器</h2>

        <div class="dashboard-card">
            <div class="tool-card-body">
                <div class="mt-3">
                    <form @submit.prevent="findPrimes" :class="{ loading: loading }">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">起始数 M</label>
                                <input v-model="m" type="number" class="form-control" required />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">结束数 N</label>
                                <input v-model="n" type="number" class="form-control" required />
                            </div>
                        </div>
                        <div class="d-flex justify-content-end mt-3">
                            <button type="submit" class="btn btn-primary" :disabled="loading">
                                <i class="bi bi-search me-1"></i>查询
                            </button>
                        </div>
                        <div v-if="loading" class="text-center mt-3">
                            <div class="spinner-border text-primary"></div>
                        </div>
                        <p v-if="error" class="text-danger mt-2">{{ error }}</p>
                    </form>
                </div>

                <div v-if="primes.length" class="mt-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="text-success mb-0">
                                <i class="bi bi-list-ol me-2"></i>结果 ({{ primes.length }} 个质数)
                            </h5>
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-secondary btn-sm" @click="copyToClipboard(false)">
                                    <i class="bi bi-clipboard"></i> 复制本页
                                </button>
                                <button class="btn btn-outline-secondary btn-sm" @click="copyToClipboard(true)">
                                    <i class="bi bi-clipboard-check"></i> 复制全部
                                </button>
                            </div>
                        </div>
                        <div v-if="copySuccess" class="text-success small mb-2">
                            <i class="bi bi-check-circle"></i> 已复制到剪贴板
                        </div>

                        <div class="d-flex flex-wrap gap-2">
                            <span v-for="(prime, index) in paginatedPrimes" :key="index"
                                class="badge rounded-pill px-3 py-2 text-center" :class="getBadgeColor(index)"
                                style="min-width: 60px;">
                                {{ prime }}
                            </span>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <button class="btn btn-outline-secondary btn-sm" @click="prevPage" :disabled="page === 1">
                                <i class="bi bi-arrow-left"></i> 上一页
                            </button>
                            <span class="text-muted">第 {{ page }} / {{ totalPages }} 页</span>
                            <button class="btn btn-outline-secondary btn-sm" @click="nextPage"
                                :disabled="page === totalPages">
                                下一页 <i class="bi bi-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="info-card">
            <div class="card-body">
                <h5 class="text-info mb-3">
                    <i class="bi bi-info-circle me-2"></i>质数简介
                </h5>
                <ul class="list-unstyled mb-0">
                    <li class="mb-2 d-flex align-items-center">
                        <i class="bi bi-dot text-primary fs-5 me-2"></i>
                        质数是大于 1 且只能被 1 和自身整除的自然数
                    </li>
                    <li class="mb-2 d-flex align-items-center">
                        <i class="bi bi-star-fill text-warning me-2"></i>
                        前几个质数为：2, 3, 5, 7, 11, 13 ...
                    </li>
                    <li class="d-flex align-items-center">
                        <i class="bi bi-shield-lock-fill text-success me-2"></i>
                        质数在密码学、数据加密等领域有广泛应用
                    </li>
                </ul>
            </div>
        </div>

    </div>
</template>
