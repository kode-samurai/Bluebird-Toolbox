<script setup>
    import { ref } from 'vue'
    // import axios from 'axios'
    import http from '../components/http';
    import { useTheme } from "../components/dark-control";

    const { isDark, toggleTheme } = useTheme()

    const jsonInput = ref('')
    const formatted = ref('')
    const loading = ref(false)
    const error = ref('')

    const formatJson = async () => {
        if (loading.value) return
        loading.value = true
        error.value = ''
        try {
            const response = await http.post('/api/text/json-format/', { json_input: jsonInput.value })
            formatted.value = response.data.formatted
        } catch (err) {
            error.value = err.response?.data?.error || 'JSON 格式错误，请检查输入'
        } finally {
            loading.value = false
        }
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('已复制到剪贴板！')
        })
    }

    const clearAll = () => {
        jsonInput.value = ''
        formatted.value = ''
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
        <h2 class="page-title"><i class="bi bi-braces"></i> JSON 格式化工具</h2>
        <div class="dashboard-card">
            <div class="tool-card-body">

                <div class="alert alert-info py-2">
                    <b>预告</b>：当前工具仅支持 <b>JSON 格式化</b>，字典格式化功能正在施工中 🚧
                </div>

                <form @submit.prevent="formatJson" :class="{ loading: loading }">
                    <div class="mb-3">
                        <label class="form-label">输入 JSON</label>
                        <textarea v-model="jsonInput" rows="6" placeholder="请在此粘贴 JSON 内容" required></textarea>
                    </div>

                    <div class="d-flex gap-2">
                        <button type="submit" class="tool-btn" :disabled="loading">
                            {{ loading ? '格式化中...' : '格式化' }}
                        </button>
                        <button type="button" class="tool-btn-outline danger" @click="clearAll">
                            清空
                        </button>
                    </div>
                    <p v-if="error" class="error-text mt-2">{{ error }}</p>
                </form>

                <div v-if="formatted" class="mt-5">
                    <h5>格式化结果：</h5>
                    <div class="result-box monospace">
                        {{ formatted }}
                    </div>
                    <button @click="copyToClipboard(formatted)" class="tool-btn-outline mt-2">
                        复制结果
                    </button>
                </div>
            </div>
        </div>

        <div class="info-card">
            <h5><i class="bi bi-info-circle"></i> 说明</h5>
            <ul>
                <li>输入 JSON 字符串，点击按钮即可格式化。</li>
                <li>支持复制结果。</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>

    .monospace {
        font-family: monospace;
        white-space: pre-wrap;
        word-break: break-word;
    }

    .alert {
        max-height: 400px;
        overflow-y: auto;
    }

</style>
