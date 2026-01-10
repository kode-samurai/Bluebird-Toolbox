<script setup>
    import { h, ref, watch } from 'vue'
    // import axios from 'axios'
    import http from '../components/http';
    import { useTheme } from "../components/dark-control";

    const { isDark, toggleTheme } = useTheme()

    const value = ref('')
    const fromBase = ref(10)
    const toBase = ref(2)
    const result = ref('')
    const error = ref('')
    const inputError = ref('')

    const validateInput = () => {
        if (!value.value) {
            inputError.value = ''
            return true
        }

        let regex
        if (fromBase.value <= 10) {
            regex = new RegExp(`^[0-${fromBase.value - 1}]+$`, 'i')
        } else {
            // 超过10进制时允许0-9 + A-Z
            const maxCharCode = 'A'.charCodeAt(0) + (fromBase.value - 11)
            const allowedChars = `[0-9A-${String.fromCharCode(maxCharCode)}]`
            regex = new RegExp(`^${allowedChars}+$`, 'i')
        }

        if (!regex.test(value.value)) {
            inputError.value = `输入的内容不符合 ${fromBase.value} 进制规则`
            return false
        }

        inputError.value = ''
        return true
    }

    const convert = async () => {
        if (!validateInput()) {
            result.value = ''
            return
        }
        if (!value.value || fromBase.value < 2 || fromBase.value > 64 || toBase.value < 2 || toBase.value > 64) {
            error.value = '输入或进制范围无效，请检查'
            result.value = ''
            return
        }
        error.value = ''
        try {
            const response = await http.post('/api/base/base-convert/', {
                value: value.value,
                from_base: fromBase.value,
                to_base: toBase.value
            })
            result.value = response.data.result
        } catch (err) {
            error.value = err.response?.data?.error || '转换失败'
            result.value = ''
        }
    }

    watch([value, fromBase, toBase], convert)

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('已复制到剪贴板！')
        })
    }

    const clearAll = () => {
        value.value = ''
        result.value = ''
        error.value = ''
        inputError.value = ''
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
        <h2 class="page-title"><i class="bi bi-code"></i> 进制转换工具</h2>
        <div class="dashboard-card">
            <div class="tool-card-body">
                <div class="mb-3">
                    <label class="form-label">输入值</label>
                    <input v-model="value" class="tool-input" placeholder="请输入需要转换的数字">
                    <div v-if="inputError" class="warning-text small mt-1">{{ inputError }}</div>
                </div>

                <div class="row mb-3">
                    <div class="col">
                        <label class="form-label">原进制 (2-64)</label>
                        <div class="input-select-group">
                            <input v-model="fromBase" type="number" min="2" max="64" class="tool-input">
                            <select class="tool-select" v-model="fromBase">
                                <option disabled>常用进制</option>
                                <option value="2">二进制</option>
                                <option value="8">八进制</option>
                                <option value="10">十进制</option>
                                <option value="16">十六进制</option>
                            </select>
                        </div>
                    </div>

                    <div class="col">
                        <label class="form-label">目标进制 (2-64)</label>
                        <div class="input-select-group">
                            <input v-model="toBase" type="number" min="2" max="64" class="tool-input">
                            <select class="tool-select" v-model="toBase">
                                <option disabled>常用进制</option>
                                <option value="2">二进制</option>
                                <option value="8">八进制</option>
                                <option value="10">十进制</option>
                                <option value="16">十六进制</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="d-flex gap-2 mb-3">
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
                <li>可输入二进制、十进制、十六进制等数值。</li>
                <li>可选择常用进制。</li>
                <li>可自动转换成其他进制表示。</li>
            </ul>
        </div>

    </div>
</template>

<style scoped>

    .input-select-group {
        display: flex;
        gap: 6px;
    }

    .input-select-group .tool-input,
    .input-select-group .tool-select {
        flex: 1;
        min-width: 0;
    }

    .tool-select {
        color: #000000;
    }

</style>
