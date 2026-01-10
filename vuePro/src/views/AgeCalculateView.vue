<script setup>
    import { ref, onUnmounted } from 'vue'
    // import axios from 'axios'
    import http from '../components/http';
    import { useTheme } from "../components/dark-control";

    const { isDark, toggleTheme } = useTheme()

    const birthdayDate = ref('')
    const birthdayTime = ref('00:00') // 默认时间
    const age = ref(null)
    const seconds = ref(0)
    const progress = ref(0)
    const error = ref('')
    const loading = ref(false)
    let interval

    const maxDate = new Date().toISOString().slice(0, 10) // 只取日期

    const calculate = async () => {
        if (!birthdayDate.value) {
            error.value = '请输入生日日期'
            return
        }
        error.value = ''
        loading.value = true

        let birthdayValue = `${birthdayDate.value}T${birthdayTime.value || '00:00'}:00`

        try {
            const response = await http.post('/api/time/age-calculate/', { birthday: birthdayValue })
            age.value = response.data
            seconds.value = age.value.seconds
            clearInterval(interval)
            interval = setInterval(() => {
                seconds.value++
                progress.value = (seconds.value % 60) / 60 * 100
            }, 1000)
        } catch (err) {
            error.value = err.response?.data?.error || '获取失败'
        } finally {
            loading.value = false
        }
    }

    onUnmounted(() => clearInterval(interval))
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
        <h2 class="page-title">
            <i class="bi bi-calendar-heart"></i> 年龄计算
        </h2>

        <div class="dashboard-card">
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label fw-bold">
                        <i class="bi bi-calendar-event me-2 text-info"></i>生日日期
                    </label>
                    <input v-model="birthdayDate" type="date" class="tool-input" :max="maxDate" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-bold">
                        <i class="bi bi-clock me-2 text-info"></i>时间
                    </label>
                    <input v-model="birthdayTime" type="time" class="tool-input">
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

        <div v-if="age" class="dashboard-card">
            <h5 class="mb-3 text-success">
                <i class="bi bi-clipboard-check me-2"></i>你已经过了
            </h5>
            <div class="d-flex flex-wrap gap-2">
                <span class="badge rounded-pill bg-primary fs-6 px-3 py-2">
                    <i class="bi bi-person-lines-fill me-1"></i>年龄: {{ age.age }} 年
                </span>
                <span class="badge rounded-pill bg-info text-dark fs-6 px-3 py-2">
                    <i class="bi bi-card-text me-1"></i>{{ age.detailed }}
                </span>
                <span class="badge rounded-pill bg-warning text-dark fs-6 px-3 py-2 tick-badge">
                    <i class="bi bi-stopwatch me-1"></i>秒数: {{ seconds }}
                </span>
            </div>
        </div>

        <div class="info-card">
            <h5 class="text-info mb-3">
                <i class="bi bi-info-circle me-2"></i>说明
            </h5>
            <ul class="list-unstyled mb-0">
                <li class="mb-2 d-flex align-items-center">
                    <i class="bi bi-dot text-primary fs-5 me-2"></i>
                    输入 <strong>生日日期</strong>，可选填时间，默认 <code>00:00</code>
                </li>
                <li class="mb-2 d-flex align-items-center">
                    <i class="bi bi-stopwatch-fill text-success me-2"></i>
                    页面会实时显示 <strong>秒数</strong> 并带进度条效果
                </li>
                <li class="d-flex align-items-center">
                    <i class="bi bi-exclamation-triangle text-warning me-2"></i>
                    生日必须早于当前时间
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>

    .badge {
        font-weight: 500;
        min-width: 140px;
        text-align: left;
    }

    .tick-badge {
        animation: tick 1s infinite;
    }

    @keyframes tick {
        0% {
            color: black;
        }

        50% {
            color: red;
        }

        100% {
            color: black;
        }
    }

</style>
