<script setup>
    import { ref } from 'vue'
    // import axios from 'axios'
    import http from '../components/http';
    import { useTheme } from "../components/dark-control";

    const { isDark, toggleTheme } = useTheme()

    const inputValue = ref('')
    const result = ref('')
    const error = ref('')

    const convert = async () => {
        if (!inputValue.value) return
        error.value = ''
        try {
            let toTimestamp = !/^\d+$/.test(inputValue.value)
            const response = await http.post('/api/time/timestamp-convert/', {
                input_value: inputValue.value,
                to_timestamp: toTimestamp
            })
            result.value = toTimestamp ? response.data.timestamp : response.data.datetime
        } catch (err) {
            error.value = err.response?.data?.error || '输入格式无效，请检查'
            result.value = ''
        }
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('已复制到剪贴板！')
        })
    }

    const clearAll = () => {
        inputValue.value = ''
        result.value = ''
        error.value = ''
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
        <h2 class="page-title"><i class="bi bi-clock"></i> 时间 ↔ 时间戳 转换工具</h2>
        <div class="dashboard-card">
            <div class="tool-card-body">
                <div class="mb-3">
                    <label class="form-label">输入值（日期时间 或 时间戳）</label>
                    <input v-model="inputValue" class="tool-input" placeholder="例如：2025-01-01T00:00:00 或 1672531200000">
                </div>

                <div class="d-flex gap-2 mb-3">
                    <button @click="convert" class="tool-btn">转换</button>
                    <button @click="clearAll" class="tool-btn-outline danger">清空</button>
                </div>

                <p v-if="error" class="error-text">{{ error }}</p>

                <div v-if="result" class="mt-3">
                    <h5>转换结果：</h5>
                    <div class="result-box">{{ result }}</div>
                    <button class="tool-btn-outline mt-2" @click="copyToClipboard(result)">
                        复制结果
                    </button>
                </div>


            </div>
        </div>

        <div class="info-card">
            <h5><i class="bi bi-info-circle"></i> 说明</h5>
            <ul>
                <li>输入日期时间（如 2025-01-01T00:00:00）。</li>
                <li>或输入时间戳（毫秒）。</li>
            </ul>
        </div>

    </div>
</template>

<style scoped></style>
