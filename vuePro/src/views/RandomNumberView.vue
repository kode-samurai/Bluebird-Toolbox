<script setup>
    import { ref, computed, h } from 'vue'
    // import axios from 'axios'
    import http from '../components/http';
    import { useTheme } from "../components/dark-control";

    const { isDark, toggleTheme } = useTheme()

    const minValue = ref(0)
    const maxValue = ref(100)
    const count = ref(1)
    const numbers = ref([])
    const loading = ref(false)
    const error = ref('')
    const sortOrder = ref('none')
    const copyMessage = ref('')

    const generateNumbers = async () => {
        if (loading.value) return
        loading.value = true
        error.value = ''
        sortOrder.value = 'none'
        copyMessage.value = ''
        try {
            const response = await http.post('/api/random/numbers/', {
                min_value: minValue.value,
                max_value: maxValue.value,
                count: count.value
            })
            numbers.value = response.data.numbers
        } catch (err) {
            error.value = err.response?.data?.error || 'Error generating numbers'
        } finally {
            loading.value = false
        }
    }

    const sortedNumbers = computed(() => {
        if (sortOrder.value === 'asc') {
            return [...numbers.value].sort((a, b) => a - b)
        } else if (sortOrder.value === 'desc') {
            return [...numbers.value].sort((a, b) => b - a)
        }
        return numbers.value
    })

    const copyToClipboard = async () => {
        try {
            const text = sortedNumbers.value.join(', ')
            await navigator.clipboard.writeText(text)
            copyMessage.value = '✅ 已复制到剪贴板'
            setTimeout(() => (copyMessage.value = ''), 2000)
        } catch (e) {
            copyMessage.value = '❌ 复制失败'
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
        <h2 class="page-title"><i class="bi bi-dice-5"></i> 随机数生成器</h2>

        <div class="dashboard-card">
            <div class="tool-card-body">
                <form @submit.prevent="generateNumbers" :class="{ loading: loading }">
                    <div class="form-group">
                        <label>最小值</label>
                        <input v-model="minValue" type="number" required />
                    </div>
                    <div class="form-group">
                        <label>最大值</label>
                        <input v-model="maxValue" type="number" required />
                    </div>
                    <div class="form-group">
                        <label>数量</label>
                        <input v-model="count" type="number" min="1" required />
                    </div>

                    <div class="controls">
                        <button class="tool-btn-outline" type="submit" :disabled="loading">
                            {{ loading ? '生成中...' : '生成' }}
                        </button>
                    </div>

                    <p v-if="error" class="error">{{ error }}</p>
                </form>
            </div>
        </div>

        <div v-if="numbers.length" class="dashboard-card">
            <h4>生成结果</h4>
            <div class="sort-buttons">
                <button class="tool-btn-outline" @click="sortOrder = 'asc'">正序</button>
                <button class="tool-btn-outline" @click="sortOrder = 'desc'">倒序</button>
                <button class="tool-btn-outline" @click="sortOrder = 'none'">原始顺序</button>
                <button class="tool-btn-outline" @click="copyToClipboard">复制结果</button>
            </div>

            <ul class="result-list">
                <li v-for="(num, i) in sortedNumbers" :key="i">{{ num }}</li>
            </ul>
            <p v-if="copyMessage" class="copy-msg">{{ copyMessage }}</p>
        </div>

        <div class="info-card">
            <h5><i class="bi bi-info-circle"></i> 说明</h5>
            <ul>
                <li>可设置最小值和最大值，生成随机整数。</li>
                <li>支持一次生成多个结果。</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>

    .result-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin: 10px 0 0;
        padding: 0;
        list-style: none;
    }

    .result-list li {
        background: rgba(255, 255, 255, 0.1);
        padding: 8px 14px;
        border-radius: 8px;
        font-weight: bold;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .sort-buttons {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 12px;
    }

    .copy-msg {
        text-align: center;
        color: #00ff99;
        margin-top: 8px;
        font-size: 14px;
    }
</style>
