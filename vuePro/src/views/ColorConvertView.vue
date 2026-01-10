<script setup>
    import { ref, watch } from 'vue'
    // import axios from 'axios'
    import http from '../components/http';
    import { useTheme } from "../components/dark-control";

    const { isDark, toggleTheme } = useTheme()

    const color = ref('#000000')
    const value = ref('')
    const result = ref('')
    const previewColor = ref('')
    const error = ref('')

    const convert = async () => {
        if (!value.value) return
        error.value = ''
        try {
            let toHex = /^rgb/i.test(value.value)
            const response = await http.post('/api/color/color-convert/', { value: value.value, to_hex: toHex })
            result.value = toHex ? response.data.hex : response.data.rgb
            previewColor.value = toHex ? result.value : value.value
        } catch (err) {
            error.value = err.response?.data?.error || '输入格式无效，请检查'
            result.value = ''
        }
    }

    const convertToHex = () => {
        value.value = `rgb(${parseInt(color.value.substr(1, 2), 16)},${parseInt(color.value.substr(3, 2), 16)},${parseInt(color.value.substr(5, 2), 16)})`
        convert()
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('已复制到剪贴板！')
        })
    }

    const clearAll = () => {
        color.value = '#000000'
        value.value = ''
        result.value = ''
        previewColor.value = ''
        error.value = ''
    }

    watch(value, convert)
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
        <h2 class="page-title"><i class="bi bi-palette"></i> 颜色转换工具</h2>
        <div class="dashboard-card">
            <div class="tool-card-body">
                <div class="mb-3">
                    <label class="form-label">选择颜色</label><br>
                    <input type="color" v-model="color" @input="convertToHex" class="color-picker">
                </div>

                <div class="mb-3">
                    <label class="form-label">输入 RGB 或 Hex 值</label>
                    <input v-model="value" @input="convert" class="tool-input" placeholder="例如：rgb(255,0,0) 或 #FF0000">
                </div>

                <p v-if="error" class="error-text">{{ error }}</p>

                <div v-if="result" class="mt-4">
                    <h5>转换结果：</h5>
                    <div class="result-box d-flex align-items-center gap-3">
                        <div :style="{ backgroundColor: previewColor }" class="color-preview"></div>
                        <div>{{ result }}</div>
                    </div>
                    <button class="tool-btn-outline mt-2" @click="copyToClipboard(result)">
                        复制结果
                    </button>
                </div>

                <div class="mt-3">
                    <button class="tool-btn-outline" @click="clearAll">清空输入</button>
                </div>


            </div>
        </div>

        <div class="info-card">
            <h5><i class="bi bi-info-circle"></i> 说明</h5>
            <ul>
                <li>目前支持 HEX、RGB 格式互转。</li>
                <li>支持选择颜色，并且实时输出 RGB 与 HEX 值</li>
                <li>结果可复制。</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
    .color-picker {
        width: 60px;
        height: 40px;
        padding: 2px;
        border: none;
        cursor: pointer;
    }

    .color-preview {
        width: 80px;
        height: 80px;
        border: 1px solid #ccc;
        border-radius: var(--radius-md);
    }
</style>
