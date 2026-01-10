<script setup>
    import { ref } from 'vue'
    // import axios from 'axios'
    import http from '../components/http';
    import { useTheme } from "../components/dark-control";

    const { isDark, toggleTheme } = useTheme()

    const m = ref(1)
    const n = ref(10)
    const sumOdd = ref(null)
    const sumEven = ref(null)
    const loading = ref(false)
    const error = ref('')

    const calculate = async () => {
        if (loading.value) return
        loading.value = true
        error.value = ''
        sumOdd.value = null
        sumEven.value = null
        if (Math.abs(n.value - m.value) > 1e6) {
            error.value = '范围过大 / Range too large'
            loading.value = false
            return
        }
        try {
            const response = await http.post('/api/math/sum-odd-even/', { m: m.value, n: n.value })
            sumOdd.value = response.data.sum_odd
            sumEven.value = response.data.sum_even
        } catch (err) {
            error.value = '计算出错 / Error'
        } finally {
            loading.value = false
        }
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
        <h2 class="page-title"><i class="bi bi-calculator"></i> 奇偶求和</h2>

        <div class="dashboard-card">
            <div class="tool-card-body">

                <form @submit.prevent="calculate">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label fw-bold">起始数 M</label>
                            <input v-model="m" type="number" required />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold">结束数 N</label>
                            <input v-model="n" type="number" required />
                        </div>
                    </div>
                    <div class="mt-3 d-flex justify-content-between align-items-center">
                        <button type="submit" class="btn btn-primary" :disabled="loading">
                            <i class="bi bi-calculator me-2"></i>计算
                        </button>
                        <div v-if="loading" class="spinner-border text-primary ms-3"></div>
                    </div>
                    <p v-if="error" class="text-danger mt-2"><i class="bi bi-exclamation-circle me-1"></i>{{ error }}
                    </p>
                </form>
            </div>
        </div>

        <div v-if="sumOdd !== null && sumEven !== null" class="dashboard-card">
            <h5 class="mb-3 text-success"><i class="bi bi-clipboard-check me-2"></i>结果 (Results)</h5>
            <div class="d-flex flex-wrap gap-2">
                <span class="badge rounded-pill bg-warning text-dark fs-6 px-3 py-2">
                    <i class="bi bi-circle-half me-1"></i>Sum Odd: {{ sumOdd }}
                </span>
                <span class="badge rounded-pill bg-info text-dark fs-6 px-3 py-2">
                    <i class="bi bi-slash-circle me-1"></i>Sum Even: {{ sumEven }}
                </span>
            </div>
        </div>

        <div class="info-card">
            <div class="card-body">
                <h5 class="text-info mb-3">
                    <i class="bi bi-info-circle me-2"></i>说明
                </h5>
                <ul class="list-unstyled mb-0">
                    <li class="mb-2 d-flex align-items-center">
                        <i class="bi bi-dot text-primary fs-5 me-2"></i>
                        输入区间 [M, N]，自动计算区间内奇数与偶数的总和
                    </li>
                    <li class="mb-2 d-flex align-items-center">
                        <i class="bi bi-star-fill text-warning me-2"></i>
                        例如：M=1, N=10 → 奇数和 = 25, 偶数和 = 30
                    </li>
                    <li class="d-flex align-items-center">
                        <i class="bi bi-lightning-charge-fill text-danger me-2"></i>
                        区间过大时会提示“范围过大 / Range too large”
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>

    .badge {
        font-weight: 500;
        min-width: 120px;
        text-align: center;
    }

</style>
