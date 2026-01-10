<script setup>
    import { ref, watch } from 'vue'
    // import axios from 'axios'
    import http from '../components/http';
    import { useTheme } from "../components/dark-control";

    const { isDark, toggleTheme } = useTheme()

    const value = ref(0)
    const fromUnit = ref('bit')
    const toUnit = ref('Byte')
    const result = ref('')
    const error = ref('')

    const convert = async () => {
        const num = Number(value.value)
        if (Number.isNaN(num) || num < 0) {
            error.value = '请输入大于或等于 0 的数值'
            result.value = ''
            return
        }

        if (fromUnit.value === toUnit.value) {
            error.value = ''
            result.value = num
            return
        }

        error.value = ''
        try {
            const response = await http.post('/api/unit-tools/data-rate-convert/', {
                value: num,
                from_unit: fromUnit.value,
                to_unit: toUnit.value
            })
            result.value = response.data.result
        } catch (err) {
            error.value = err.response?.data?.error || '转换失败，请检查输入'
            result.value = ''
        }
    }

    watch([value, fromUnit, toUnit], convert)

    const clearAll = () => {
        value.value = 0
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
        <h2 class="page-title"><i class="bi bi-speedometer2"></i> 数据速率换算工具</h2>
        <div class="dashboard-card">
            <div class="tool-card-body">

                <label>数值</label>
                <input v-model="value" type="number" min="0" placeholder="请输入数值" />

                <div class="flex-row">
                    <div class="flex-col">
                        <label>原单位</label>
                        <select v-model="fromUnit" class="tool-select">
                            <optgroup label="基础单位">
                                <option>bit</option>
                                <option>Byte</option>
                            </optgroup>
                            <optgroup label="常用速率单位">
                                <option>Kbps</option>
                                <option>KBps</option>
                                <option>Mbps</option>
                                <option>MBps</option>
                                <option>Gbps</option>
                                <option>GBps</option>
                            </optgroup>
                        </select>
                    </div>

                    <div class="flex-col">
                        <label>目标单位</label>
                        <select v-model="toUnit" class="tool-select">
                            <optgroup label="基础单位">
                                <option>bit</option>
                                <option>Byte</option>
                            </optgroup>
                            <optgroup label="常用速率单位">
                                <option>Kbps</option>
                                <option>KBps</option>
                                <option>Mbps</option>
                                <option>MBps</option>
                                <option>Gbps</option>
                                <option>GBps</option>
                            </optgroup>
                        </select>
                    </div>
                </div>

                <div class="button-group">
                    <button @click="clearAll" class="tool-btn-outline">清空</button>
                </div>

                <p v-if="error" class="error">{{ error }}</p>

                <div v-if="result" class="result-box">
                    <h5>转换结果： {{ result }}</h5>
                </div>
            </div>
        </div>
        <div class="info-card">
            <h5>单位换算规则</h5>
            <ul>
                <li><b>bit 与 Byte</b>：1 Byte = 8 bit</li>
                <li><b>Kbps</b> = 1000 bit/s，<b>KBps</b> = 1000 Byte/s</li>
                <li><b>Mbps</b> = 1000 Kbps = 1,000,000 bit/s，<b>MBps</b> = 1000 KBps</li>
                <li><b>Gbps</b> = 1000 Mbps，<b>GBps</b> = 1000 MBps</li>
            </ul>
            <p class="textmuted">提示：小写 "b" 表示 bit，大写 "B" 表示 Byte。</p>
        </div>
    </div>
</template>

<style scoped>
    .flex-row {
        display: flex;
        gap: 1rem;
    }

    .flex-col {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .result-box {
        margin-top: 1.2rem;
        padding: 1rem;
        border-radius: 10px;
        background: rgba(0, 255, 150, 0.1);
        border: 1px dashed rgba(0, 255, 150, 0.4);
        color: #fff;
    }

    .textmuted {
        color: aqua;
    }

    .tool-select {
        color: #000000;
    }

</style>
