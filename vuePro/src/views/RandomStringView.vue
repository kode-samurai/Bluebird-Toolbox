<script setup>
    import { ref } from 'vue'
    // import axios from 'axios'
    import http from '../components/http';
    import { useTheme } from "../components/dark-control";

    const { isDark, toggleTheme } = useTheme()

    const length = ref(8)
    const count = ref(1)
    const includeUpper = ref(true)
    const includeLower = ref(true)
    const includeDigits = ref(true)
    const includeSpecial = ref(false)
    const includePunctuation = ref(false)
    const customCharset = ref('')
    const showCustom = ref(false)
    const strings = ref([])
    const loading = ref(false)
    const error = ref('')

    const toggleCustom = () => {
        showCustom.value = includeSpecial.value
    }

    const generateStrings = async () => {
        if (loading.value) return
        loading.value = true
        error.value = ''
        try {
            const response = await http.post('/api/random/strings/', {
                length: length.value,
                count: count.value,
                include_upper: includeUpper.value,
                include_lower: includeLower.value,
                include_digits: includeDigits.value,
                include_special: includeSpecial.value,
                include_punctuation: includePunctuation.value,
                custom_charset: customCharset.value
            })
            strings.value = response.data.strings
        } catch (err) {
            error.value = err.response?.data?.error || '生成失败，请重试'
        } finally {
            loading.value = false
        }
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => alert('已复制到剪贴板'))
    }

    const copyAll = () => {
        if (strings.value.length) {
            const allText = strings.value.join('\n')
            navigator.clipboard.writeText(allText).then(() => alert('所有结果已复制到剪贴板'))
        }
    }

    const passwordStrength = (str) => {
        let score = 0
        if (str.length >= 8) score += 20
        if (/[A-Z]/.test(str)) score += 20
        if (/[a-z]/.test(str)) score += 20
        if (/\d/.test(str)) score += 20
        if (/[^A-Za-z0-9]/.test(str)) score += 20
        return Math.min(score, 100)
    }

    const strengthClass = (score) => {
        if (score < 40) return 'weak'
        if (score < 80) return 'medium'
        return 'strong'
    }

    const strengthLabel = (score) => {
        if (score < 40) return '弱'
        if (score < 80) return '中'
        return '强'
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
        <h2 class="page-title"><i class="bi bi-shuffle"></i> 随机字符串生成器</h2>

        <div class="dashboard-card">
            <div class="tool-card-body">
                <form @submit.prevent="generateStrings" :class="{ loading: loading }">
                    <label>长度（最大 100）</label>
                    <input v-model="length" type="number" min="1" max="100" required />

                    <label>数量</label>
                    <input v-model="count" type="number" min="1" required />

                    <label class="form-check"><input v-model="includeUpper" type="checkbox" /> 大写字母</label><br />
                    <label class="form-check"><input v-model="includeLower" type="checkbox" /> 小写字母</label><br />
                    <label class="form-check"><input v-model="includeDigits" type="checkbox" /> 数字</label><br />
                    <label class="form-check"><input v-model="includePunctuation" type="checkbox" /> 标点符号</label><br />
                    <label class="form-check"><input v-model="includeSpecial" type="checkbox" @change="toggleCustom" />
                        特殊符号</label>

                    <div v-if="showCustom">
                        <label>自定义字符集</label>
                        <input v-model="customCharset" type="text" />
                    </div>

                    <div class="controls">
                        <button class="tool-btn-outline" type="submit" :disabled="loading">
                            {{ loading ? '生成中...' : '生成' }}
                        </button>
                    </div>

                    <p v-if="error" class="error-text">{{ error }}</p>
                </form>
            </div>
        </div>

        <div v-if="strings.length" class="dashboard-card">
            <div class="result-header">
                <h3>生成结果</h3>
                <button @click="copyAll" class="tool-btn">复制全部</button>
            </div>
            <ul class="results">
                <li v-for="(str, index) in strings" :key="index" class="result-item">
                    <div class="result-line">
                        <span class="result-text">{{ str }}</span>
                        <button @click="copyToClipboard(str)" class="tool-btn">复制</button>
                    </div>
                    <div class="strength-bar">
                        <div class="bar" :class="strengthClass(passwordStrength(str))"
                            :style="{ width: passwordStrength(str) + '%' }"></div>
                    </div>
                    <small>强度：{{ strengthLabel(passwordStrength(str)) }}</small>
                </li>
            </ul>
        </div>

        <div class="info-card">
            <h5><i class="bi bi-info-circle"></i> 说明</h5>
            <ul>
                <li>支持自定义字符集（数字、字母、符号）。</li>
                <li>可设置长度并一次生成多个。</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
    .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .results {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .result-item {
        margin-bottom: 1rem;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
    }

    .result-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .strength-bar {
        height: 6px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.2);
        margin: 6px 0;
    }

    .bar {
        height: 100%;
        border-radius: 4px;
        transition: width 0.3s ease;
    }

    .bar.weak {
        background: #e53935;
    }

    .bar.medium {
        background: #fdd835;
    }

    .bar.strong {
        background: #43a047;
    }

    .error-text {
        color: #ff6b6b;
        margin-top: 0.5rem;
    }

    .form-check {
        display: flex;
        align-items: center;
        gap: 0.55rem;
        cursor: pointer;
    }

    .form-check input[type="checkbox"] {
        appearance: none;
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        border: 2px solid #ccc;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.1);
        position: relative;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .dark .form-check input[type="checkbox"] {
        border-color: rgba(255, 255, 255, 0.4);
        background: rgba(255, 255, 255, 0.07);
    }

    .form-check input[type="checkbox"]:checked {
        background: #007bff;
        border-color: #007bff;
    }

    .dark .form-check input[type="checkbox"]:checked {
        background: #00c27a;
        border-color: #00c27a;
    }

    .form-check input[type="checkbox"]::after {
        content: "✔";
        position: absolute;
        font-size: 14px;
        color: #fff;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0.2s ease;
    }

    .form-check input[type="checkbox"]:checked::after {
        transform: translate(-50%, -50%) scale(1);
    }

    input[type="number"] {
        width: 100%;
        padding: 0.6rem 0.8rem;
        border-radius: 0.6rem;
        border: 1px solid var(--input-border);
        background: var(--input-bg);
        color: var(--text-primary);
        font-size: 1rem;
        outline: none;
        margin-bottom: 1rem;
        transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    }

    input[type="number"]:focus {
        border-color: var(--input-focus-border);
        box-shadow: 0 0 6px var(--input-focus-shadow);
    }

    input[type="number"]:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    input[type="number"] {
        -moz-appearance: textfield;
    }

</style>
