<script setup>
    import { ref } from 'vue'
    // import axios from 'axios'
    import http from '../components/http';
    import { useTheme } from "../components/dark-control";

    const { isDark, toggleTheme } = useTheme()

    const height = ref(0)
    const weight = ref(0)
    const bmi = ref('')
    const error = ref('')

    const calculate = async () => {
        if (height.value <= 0 || weight.value <= 0) {
            error.value = '请输入有效的身高和体重'
            bmi.value = ''
            return
        }
        error.value = ''
        try {
            const response = await http.post('/api/math/bmi/', { height_cm: height.value, weight_kg: weight.value })
            bmi.value = response.data.bmi
        } catch (err) {
            error.value = err.response?.data?.error || '计算出错，请稍后重试'
            bmi.value = ''
        }
    }

    const clearAll = () => {
        height.value = 0
        weight.value = 0
        bmi.value = ''
        error.value = ''
    }

    const bmiCategory = (bmiVal) => {
        if (!bmiVal) return ''
        if (bmiVal < 18.5) return '偏瘦'
        if (bmiVal < 24) return '正常'
        if (bmiVal < 28) return '超重'
        return '肥胖'
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
        <h2 class="page-title"><i class="bi bi-person-arms-up"></i> BMI 计算工具</h2>

        <div class="dashboard-card">
            <div class="tool-card-body">
                <div class="mb-3">
                    <label class="form-label">身高 (cm)</label>
                    <input v-model="height" type="number" min="0" placeholder="请输入身高">
                </div>

                <div class="mb-3">
                    <label class="form-label">体重 (kg)</label>
                    <input v-model="weight" type="number" min="0" placeholder="请输入体重">
                </div>

                <div class="d-flex justify-content-end gap-2 mb-3">
                    <button @click="calculate" class="btn btn-primary">计算</button>
                    <button @click="clearAll" class="btn btn-outline-secondary">清空</button>
                </div>

                <p v-if="error" class="text-danger">{{ error }}</p>

                <div v-if="bmi" class="mt-3">
                    <h5>BMI：{{ bmi }} （{{ bmiCategory(bmi) }}）</h5>
                </div>
            </div>
        </div>

        <div class="info-card">
            <h5 class="card-title text-info">BMI 指标说明</h5>
            <p class="mb-1">BMI（身体质量指数）= 体重(kg) ÷ 身高²(m²)</p>

            <div class="position-relative my-3">
                <div class="progress"
                    style="height: 30px; background: linear-gradient(to right, #0d6efd, #198754, #ffc107, #dc3545);">
                    <!-- 占位空进度条，颜色由 background 决定 -->
                    <div class="progress-bar" style="width: 100%; opacity: 0;"></div>
                </div>

                <div v-if="bmi" class="position-absolute top-0"
                    :style="{ left: Math.min(bmi, 40) / 40 * 100 + '%', transform: 'translateX(-50%)' }">
                    <span class="badge bg-dark">{{ bmi }}</span>
                </div>
            </div>

            <div class="d-flex justify-content-between mt-2">
                <span class="badge bg-primary">偏瘦 &lt; 18.5</span>
                <span class="badge bg-success">正常 18.5–23.9</span>
                <span class="badge bg-warning text-dark">超重 24–27.9</span>
                <span class="badge bg-danger">肥胖 ≥ 28</span>
            </div>

        </div>
    </div>
</template>

<style scoped>
    .progress-bar {
        font-size: 12px;
        line-height: 30px;
    }
</style>
