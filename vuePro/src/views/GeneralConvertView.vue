<script setup>
    import { ref, watch, computed } from 'vue'
    // import axios from 'axios'
    import http from '../components/http';
    import { useTheme } from "../components/dark-control";

    const { isDark, toggleTheme } = useTheme()
    const category = ref('length')
    const value = ref(0)
    const fromUnit = ref('')
    const toUnit = ref('')
    const result = ref('')
    const error = ref('')
    const showRules = ref(false)

    const unitTranslations = {
        length: { m: '米 (m)', cm: '厘米 (cm)', dm: '分米 (dm)', mm: '毫米 (mm)', km: '千米 (km)', inch: '英寸 (inch)', ft: '英尺 (ft)', yd: '码 (yd)', mile: '英里 (mile)' },
        weight: { g: '克 (g)', mg: '毫克 (mg)', kg: '千克 (kg)', ton: '吨 (t)', lb: '磅 (lb)', oz: '盎司 (oz)', qian: '钱', liang: '两', jin: '斤' },
        area: { m2: '平方米 (㎡)', dm2: '平方分米 (dm²)', cm2: '平方厘米 (cm²)', mm2: '平方毫米 (mm²)', km2: '平方千米 (km²)', acre: '英亩 (acre)', hectare: '公顷 (ha)', are: '公亩 (are)', mu: '亩', qing: '顷' },
        volume: { m3: '立方米 (m³)', dm3: '立方分米 (dm³)', cm3: '立方厘米 (cm³)', mm3: '立方毫米 (mm³)', ml: '毫升 (ml)', l: '升 (L)', in3: '立方英寸 (in³)', ft3: '立方英尺 (ft³)' },
        capacity: { l: '升 (L)', ml: '毫升 (ml)', gal: '加仑 (gal)', pt: '品脱 (pint)', qt: '夸脱 (quart)' },
        temperature: { C: '摄氏度 (℃)', F: '华氏度 (℉)', K: '开尔文 (K)' },
        speed: { mps: '米/秒 (m/s)', kph: '千米/小时 (km/h)', mph: '英里/小时 (mph)', knot: '节 (kn)', c: '光速 (c)', mach: '马赫' }
    }

    const availableUnits = computed(() => {
        return unitTranslations[category.value] || {}
    })

    const convert = async () => {
        if (!value.value) {
            result.value = ''
            return
        }
        if (!fromUnit.value || !toUnit.value) return
        error.value = ''
        try {
            const response = await http.post('/api/unit-tools/general-convert/', {
                value: value.value,
                category: category.value,
                from_unit: fromUnit.value,
                to_unit: toUnit.value
            })
            result.value = response.data.result
        } catch (err) {
            error.value = err.response?.data?.error || '转换失败，请检查输入'
        }
    }

    const clearAll = () => {
        value.value = 0
        result.value = ''
        error.value = ''
    }

    watch([value, category, fromUnit, toUnit], convert)

    watch(category, (newCat) => {
        const units = Object.keys(unitTranslations[newCat] || {})
        fromUnit.value = units[0] || ''
        toUnit.value = units[1] || ''
    }, { immediate: true })
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
        <h2 class="page-title"><i class="bi bi-code-slash"></i> 通用单位换算工具</h2>
        <div class="dashboard-card">
            <div class="tool-card-body">
                <div class="mb-3">
                    <label>类别</label>
                    <select v-model="category" class="tool-select">
                        <option value="length">长度</option>
                        <option value="weight">重量</option>
                        <option value="area">面积</option>
                        <option value="volume">体积</option>
                        <option value="capacity">容量</option>
                        <option value="temperature">温度</option>
                        <option value="speed">速度</option>
                    </select>
                </div>

                <div class="mb-3">
                    <label>数值</label>
                    <input v-model="value" type="number" placeholder="请输入数值">
                </div>

                <div class="unit-row">
                    <div class="unit-field">
                        <label>原单位</label>
                        <select v-model="fromUnit" class="tool-select">
                            <option v-for="(label, key) in availableUnits" :key="key" :value="key">{{ label }}</option>
                        </select>
                    </div>
                    <div class="unit-field">
                        <label>目标单位</label>
                        <select v-model="toUnit" class="tool-select">
                            <option v-for="(label, key) in availableUnits" :key="key" :value="key">{{ label }}</option>
                        </select>
                    </div>
                </div>

                <div class="flex justify-end mt-3">
                    <button @click="clearAll" class="tool-btn-outline">清空</button>
                </div>

                <p v-if="error" class="text-red-400 mt-2">{{ error }}</p>

                <div v-if="result" class="mt-3">
                    <h5>转换结果： {{ result }} {{ availableUnits[toUnit] }}</h5>
                </div>
            </div>
        </div>

        <div class="info-card mt-2">
            <h5 class="flex justify-between items-center text-blue-300">
                单位换算规则
                <button class="tool-btn-outline px-3 py-1" @click="showRules = !showRules">
                    {{ showRules ? '收起' : '展开' }}
                </button>
            </h5>
            <div v-if="showRules" class="mt-2">
                <ul class="list-disc pl-5 space-y-1">
                    <li><b>长度：</b> 1米 = 100厘米 = 1000毫米；1千米 = 1000米</li>
                    <li><b>重量：</b> 1千克 = 1000克；1吨 = 1000千克；1磅 ≈ 0.4536千克</li>
                    <li><b>面积：</b> 1平方米 = 10000平方厘米；1公顷 = 10000平方米</li>
                    <li><b>体积：</b> 1立方米 = 1000升 = 1000000毫升</li>
                    <li><b>容量：</b> 1加仑 ≈ 3.785升；1品脱 = 0.473升</li>
                    <li><b>速度：</b> 1米/秒 = 3.6千米/小时；1节 ≈ 1.852千米/小时</li>
                    <li><b>温度：</b> 摄氏度(℃)、华氏度(℉)、开尔文(K) 相互转换</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>

    .unit-row {
        display: flex;
        gap: 1rem;
    }

    .unit-field {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .tool-select {
        color: #000000;
    }

</style>
