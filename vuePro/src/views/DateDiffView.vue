<script setup>
    import { ref } from 'vue'
    // import axios from 'axios'
    import http from '../components/http';
    import { useTheme } from "../components/dark-control";

    const { isDark, toggleTheme } = useTheme()

    const startDate = ref('')
    const endDate = ref('')
    const result = ref(null)
    const error = ref('')
    const loading = ref(false)

    const calculate = async () => {
        if (!startDate.value || !endDate.value) return
        if (new Date(startDate.value) > new Date(endDate.value)) {
            error.value = '开始日期不能晚于结束日期'
            return
        }
        error.value = ''
        loading.value = true
        try {
            const response = await http.post('/api/time/date-diff/', {
                start_date: startDate.value,
                end_date: endDate.value
            })
            result.value = response.data
        } catch (err) {
            error.value = err.response?.data?.error || '获取失败'
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
        <h2 class="page-title"><i class="bi bi-calendar-event"></i>日期间隔</h2>

        <div class="dashboard-card">
            <div class="tool-card-body">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label fw-bold">
                            <i class="bi bi-calendar-event me-2 text-info"></i>开始日期
                        </label>
                        <input v-model="startDate" type="date" class="tool-input" required max="2100-12-31"
                            min="1900-01-01" />
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold">
                            <i class="bi bi-calendar-check me-2 text-success"></i>结束日期
                        </label>
                        <input v-model="endDate" type="date" class="tool-input" required max="2100-12-31"
                            min="1900-01-01" />
                    </div>
                </div>

                <div class="mt-3 d-flex align-items-center">
                    <button class="tool-btn-outline" @click="calculate" :disabled="loading">
                        <i class="bi bi-calculator me-2"></i>计算
                    </button>
                    <div v-if="loading" class="spinner-border text-light ms-3"></div>
                </div>

                <p v-if="error" class="text-danger mt-2">
                    <i class="bi bi-exclamation-circle me-2"></i>{{ error }}
                </p>
            </div>
        </div>

        <div v-if="result" class="dashboard-card">
            <h5 class="mb-3 text-success">
                <i class="bi bi-clipboard-check me-2"></i>结果 (Results)
            </h5>
            <div class="d-flex flex-wrap gap-2">
                <span class="badge rounded-pill bg-primary fs-6 px-3 py-2">
                    <i class="bi bi-clock-history me-1"></i>天数: {{ result.days }}
                </span>
                <span class="badge rounded-pill bg-info text-dark fs-6 px-3 py-2">
                    <i class="bi bi-calendar3 me-1"></i>月数: {{ result.months }}
                </span>
                <span class="badge rounded-pill bg-warning text-dark fs-6 px-3 py-2">
                    <i class="bi bi-calendar2-check me-1"></i>年数: {{ result.years }}
                </span>
            </div>
            <p class="mt-3 text-muted">
                <i class="bi bi-chat-left-quote text-secondary me-2"></i>{{ result.natural }}
            </p>
        </div>

        <div class="info-card">
            <h5 class="text-info mb-2">
                <i class="bi bi-info-circle me-2"></i>说明
            </h5>
            <ul class="list-unstyled mb-0">
                <li class="mb-2 d-flex align-items-center">
                    <i class="bi bi-dot text-primary fs-5 me-2"></i>
                    选择 <strong>开始日期</strong> 和 <strong>结束日期</strong>，点击计算即可
                </li>
                <li class="mb-2 d-flex align-items-center">
                    <i class="bi bi-arrow-left-right text-success me-2"></i>
                    结果包含 <strong>天数</strong>、<strong>月数</strong> 和 <strong>年数</strong>
                </li>
                <li class="d-flex align-items-center">
                    <i class="bi bi-exclamation-triangle text-warning me-2"></i>
                    开始日期不能晚于结束日期
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped></style>
