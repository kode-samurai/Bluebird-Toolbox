<script setup>
    import { ref, watch } from 'vue'
    // import axios from 'axios'
    import http from '../components/http';
    import { useTheme } from "../components/dark-control";

    const { isDark, toggleTheme } = useTheme()

    const text = ref('')
    const toUpper = ref(true)
    const converted = ref('')

    const convert = async () => {
        if (!text.value) {
            converted.value = ''
            return
        }
        try {
            const response = await http.post('/api/text/case-convert/', {
                text: text.value,
                to_upper: toUpper.value
            })
            converted.value = response.data.converted
        } catch (err) {
            converted.value = ''
        }
    }

    watch([text, toUpper], convert)

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('已复制到剪贴板！')
        })
    }

    const clearAll = () => {
        text.value = ''
        converted.value = ''
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
        <h2 class="page-title"><i class="bi bi-type"></i> 大小写转换工具</h2>

        <div class="dashboard-card">
            <div class="tool-card-body">
                <div class="mb-3">
                    <label class="form-label">输入文本</label>
                    <textarea v-model="text" placeholder="请输入文本..." rows="4"></textarea>
                    <small class="textmuted">已输入 {{ text.length }} 个字符</small>
                </div>

                <div class="mb-3">
                    <label class="form-label">转换方式</label>
                    <select v-model="toUpper" class="form-select">
                        <option :value="true">转换为大写</option>
                        <option :value="false">转换为小写</option>
                    </select>
                </div>

                <div v-if="converted" class="result-box">
                    <div class="result-text">
                        <strong>转换结果：</strong> {{ converted }}
                    </div>
                    <div class="result-actions">
                        <button @click="copyToClipboard(converted)" class="tool-btn-outline me-2">
                            复制
                        </button>
                        <button @click="clearAll" class="tool-btn-outline danger">
                            清空
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="info-card">
            <h5><i class="bi bi-info-circle"></i> 说明</h5>
            <ul>
                <li>输入文本后可一键转换为大写、小写。</li>
                <li>支持复制结果。</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>

    .result-box {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 12px;
        margin-top: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        word-break: break-word;
    }

    .result-text {
        flex: 1;
        margin-right: 10px;
    }

    .result-actions {
        display: flex;
        flex-shrink: 0;
    }

    .textmuted {
        color: azure;
    }

</style>
