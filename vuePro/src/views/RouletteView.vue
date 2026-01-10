<script setup>
    import { ref } from 'vue'
    // import axios from 'axios'
    import http from '../components/http';
    import { useTheme } from "../components/dark-control";

    const { isDark, toggleTheme } = useTheme()

    const items = ref([])
    const newItem = ref('')
    const bulkItems = ref('')
    const spinning = ref(false)
    const result = ref('')

    const offset = ref(0)
    const speed = ref(0)
    const isDecelerating = ref(false)
    let interval = null
    const itemHeight = 40
    const decel = 0.25

    const editingIndex = ref(null)
    const editingValue = ref('')

    const addItem = () => {
        const v = newItem.value.trim()
        if (v && items.value.length < 20) {
            items.value.push(v)
            newItem.value = ''
        }
    }

    const addBulkItems = () => {
        const arr = bulkItems.value
            .split(/[\s,，\n]+/)
            .map(s => s.trim())
            .filter(Boolean)

        if (arr.length === 0) return

        if (arr.length > 10) {
            alert('一次最多只能添加 10 个！')
            return
        }

        const remaining = 20 - items.value.length
        if (arr.length > remaining) {
            alert(`最多还能添加 ${remaining} 个元素`)
            return
        }

        items.value.push(...arr)
        bulkItems.value = ''
    }

    const editItem = (index) => {
        editingIndex.value = index
        editingValue.value = items.value[index]
    }

    const saveEdit = (index) => {
        const v = editingValue.value.trim()
        if (v) items.value[index] = v
        editingIndex.value = null
        editingValue.value = ''
    }

    const cancelEdit = () => {
        editingIndex.value = null
        editingValue.value = ''
    }

    const deleteItem = (index) => {
        if (spinning.value) return
        items.value.splice(index, 1)
        if (editingIndex.value !== null) {
            if (editingIndex.value === index) cancelEdit()
            else if (editingIndex.value > index) editingIndex.value--
        }
    }

    const spin = () => {
        const n = items.value.length
        const total = n * itemHeight || itemHeight
        offset.value += speed.value

        if (isDecelerating.value) {
            speed.value = Math.max(0, speed.value - decel)
            if (speed.value === 0) {
                clearInterval(interval)
                spinning.value = false

                const norm = ((offset.value % total) + total) % total
                const index = Math.floor(norm / itemHeight) % n
                const remainder = norm % itemHeight
                offset.value -= remainder
                result.value = items.value[index]

                    ; (async () => {
                        try {
                            await http.post('/api/random/roulette/', {
                                items: items.value,
                                result: result.value,
                                index
                            })
                        } catch (e) {
                        }
                    })()
            }
        }
    }

    const startRoulette = () => {
        if (items.value.length < 2 || spinning.value) return
        spinning.value = true
        result.value = ''
        isDecelerating.value = false
        speed.value = 16
        interval = setInterval(spin, 50)
    }

    const stopRoulette = () => {
        if (!spinning.value) return
        isDecelerating.value = true
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
        <h2 class="page-title"><i class="bi bi-disc"></i> 抽奖转盘</h2>

        <div class="dashboard-card">
            <form @submit.prevent="addItem" class="form-inline">
                <input v-model="newItem" type="text" placeholder="输入一个元素" required />
                <button type="submit" class="btn btn-secondary">添加</button>
            </form>
        </div>

        <div class="dashboard-card">
            <h4>批量添加</h4>
            <textarea v-model="bulkItems" rows="3" placeholder="输入多个元素，支持逗号、空格、换行分隔"></textarea>
            <button @click="addBulkItems" class="btn btn-secondary">批量添加</button>
            <p class="hint">提示：一次最多添加 10 个，总数不能超过 20 个</p>
        </div>

        <div class="dashboard-card">
            <h4>已添加元素</h4>
            <ul class="list-group">
                <li v-for="(item, index) in items" :key="index"
                    class="list-group-item d-flex justify-content-between align-items-center">
                    <div v-if="editingIndex !== index">{{ item }}</div>
                    <div v-else>
                        <input v-model="editingValue" type="text"
                            class="form-control form-control-sm d-inline-block w-auto" />
                    </div>

                    <div>
                        <button v-if="editingIndex !== index" class="btn btn-sm btn-secondary me-2" :disabled="spinning"
                            @click="editItem(index)">
                            编辑
                        </button>
                        <button v-else class="btn btn-sm btn-success me-2" @click="saveEdit(index)">
                            保存
                        </button>
                        <button v-if="editingIndex === index" class="btn btn-sm btn-secondary me-2" @click="cancelEdit">
                            取消
                        </button>
                        <button class="btn btn-sm btn-outline-danger" :disabled="spinning" @click="deleteItem(index)">
                            删除
                        </button>
                    </div>
                </li>
            </ul>
        </div>

        <div class="slot-wrapper">
            <div class="slot-list" :style="{
                transform: `translateY(-${((offset % (items.length * 40 || 40)) + (items.length * 40 || 40)) % (items.length * 40 || 40)
                    }px)`
            }">
                <div class="slot-item" v-for="(item, index) in items" :key="index">
                    {{ item }}
                </div>
                <div class="slot-item" v-for="(item, index) in items" :key="'copy-' + index">
                    {{ item }}
                </div>
            </div>
            <div class="highlight"></div>
        </div>

        <div class="controls">
            <button @click="startRoulette" class="btn btn-primary" :disabled="spinning || items.length < 2">
                Start
            </button>
            <button @click="stopRoulette" class="btn btn-danger" :disabled="!spinning">
                Stop
            </button>
        </div>

        <p v-if="result" class="result">🎯 结果：<strong>{{ result }}</strong></p>
    </div>

</template>

<style scoped>

    .form-inline {
        display: flex;
        gap: 10px;
    }

    /* textarea {
        resize: none;
    } */

    .hint {
        font-size: 13px;
        color: #ffffff;
        margin-top: 6px;
    }

    .slot-wrapper {
        position: relative;
        width: 220px;
        height: 40px;
        margin: 20px auto;
        overflow: hidden;
        border: 2px solid #ccc;
        border-radius: 10px;
        background: #fafafa;
    }

    .slot-list {
        transition: transform 0.06s linear;
    }

    .slot-item {
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-weight: 500;
        font-size: 16px;
        color: #333;
        letter-spacing: 0.5px;
    }

    .highlight {
        position: absolute;
        inset: 0;
        border: 2px solid #007bff;
        pointer-events: none;
        border-radius: 10px;
    }

    .controls {
        margin: 20px 0;
        display: flex;
        justify-content: center;
        gap: 10px;
    }

    .result {
        font-size: 18px;
        margin-top: 10px;
    }

    .list-group-item {
        width: 100%;
        padding: 0.75rem 1rem;
        border-radius: 0.8rem;
        border: var(--card-border);
        background: var(--card-bg);
        color: var(--text-primary);
        font-size: 1rem;
        margin-bottom: 1rem;
        transition: background 0.25s ease, border-color 0.25s ease;
    }

    .list-group-item:hover {
        background: var(--card-bg-hover);
    }

    .dark .list-group-item {
        border: var(--card-border-dark);
        background: var(--card-bg-dark);
        color: var(--text-primary-dark);
    }

    .dark .list-group-item:hover {
        background: var(--card-bg-dark-hover);
    }

</style>
