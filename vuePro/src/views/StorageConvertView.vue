<script setup>
    import { ref, watch } from 'vue'
    // import axios from 'axios'
    import http from '../components/http';
    import { useTheme } from "../components/dark-control";

    const { isDark, toggleTheme } = useTheme()

    const value = ref(0)
    const fromUnit = ref('KB')
    const toUnit = ref('KiB')
    const result = ref('')
    const error = ref('')

    const convert = async () => {
        if (value.value < 0) {
            error.value = '数值必须大于等于 0'
            result.value = ''
            return
        }
        error.value = ''

        if (fromUnit.value === toUnit.value) {
            result.value = value.value
            return
        }

        try {
            const response = await http.post('/api/unit-tools/storage-convert/', {
                value: value.value,
                from_unit: fromUnit.value,
                to_unit: toUnit.value
            })
            result.value = response.data.result
        } catch (err) {
            error.value = err.response?.data?.error || '转换失败 / Conversion error'
            result.value = ''
        }
    }

    const clearAll = () => {
        value.value = 0
        result.value = ''
        error.value = ''
    }
    watch([value, fromUnit, toUnit], convert)
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
        <h2 class="page-title"><i class="bi bi-hdd"></i> 存储单位换算工具</h2>
        <div class="dashboard-card">
            <div class="tool-card-body">

                <div class="form-group">
                    <label>数值</label>
                    <input v-model="value" type="number" class="tool-input" required>
                </div>

                <div class="form-row">
                    <div class="form-item">
                        <label>原单位</label>
                        <select v-model="fromUnit" class="tool-select">
                            <optgroup label="国际标准">
                                <option>KB</option>
                                <option>MB</option>
                                <option>GB</option>
                            </optgroup>
                            <optgroup label="二进制标准">
                                <option>KiB</option>
                                <option>MiB</option>
                                <option>GiB</option>
                            </optgroup>
                            <optgroup label="Windows 显示">
                                <option>WindowsKB</option>
                                <option>WindowsMB</option>
                                <option>WindowsGB</option>
                            </optgroup>
                        </select>
                    </div>

                    <div class="form-item">
                        <label>目标单位</label>
                        <select v-model="toUnit" class="tool-select">
                            <optgroup label="国际标准">
                                <option>KB</option>
                                <option>MB</option>
                                <option>GB</option>
                            </optgroup>
                            <optgroup label="二进制标准">
                                <option>KiB</option>
                                <option>MiB</option>
                                <option>GiB</option>
                            </optgroup>
                            <optgroup label="Windows 显示">
                                <option>WindowsKB</option>
                                <option>WindowsMB</option>
                                <option>WindowsGB</option>
                            </optgroup>
                        </select>
                    </div>
                </div>

                <div class="button-group">
                    <button @click="clearAll" class="tool-btn danger">清空</button>
                </div>

                <p v-if="error" class="error-text">{{ error }}</p>

                <h3 v-if="result" class="result-text">结果: {{ result }}</h3>

            </div>
        </div>

        <div class="info-card ">
            <h5><i class="bi bi-info-circle"></i> 说明</h5>
            <ul>
                <li>支持字节、KB、MB、GB等单位换算。</li>
                <li>支持二进制/十进制计算方式。</li>
            </ul>
        </div>

        <div class="info-card">
            <h5>换算规则:</h5>
            <ul>
                <li>1 KB = 1000 字节</li>
                <li>1 KiB = 1024 字节</li>
                <li>1 MB = 1000² 字节</li>
                <li>1 MiB = 1024² 字节</li>
                <li>1 GB = 1000³ 字节</li>
                <li>1 GiB = 1024³ 字节</li>
                <li>Windows KB/MB/GB 按照二进制 (1024) 计算</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>

    .form-row {
        display: flex;
        gap: 16px;
        margin-bottom: 15px;
    }

    .form-item {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    @media (max-width: 600px) {
        .form-row {
            flex-direction: column;
        }
    }

    .tool-select {
        color: #000000;
    }

</style>
