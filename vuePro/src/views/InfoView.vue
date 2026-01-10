<script setup>
    import { ref, onMounted } from 'vue'
    // import axios from 'axios'
    import http from '../components/http';
    import { useTheme } from "../components/dark-control";

    const { isDark, toggleTheme } = useTheme()

    const info = ref({})
    const loading = ref(false)
    const error = ref('')
    const copied = ref('') // 记录最近复制的类型（ip 或 ua）

    const getInfo = async () => {
        if (loading.value) return
        loading.value = true
        error.value = ''
        try {
            const response = await http.get('/api/network/info/')
            info.value = response.data
            if (/mobile/i.test(info.value.user_agent)) {
                document.body.classList.add('mobile')
            }
        } catch (err) {
            error.value = '获取信息失败 / Failed to fetch info'
        } finally {
            loading.value = false
        }
    }

    const copyToClipboard = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text)
            copied.value = type
            setTimeout(() => (copied.value = ''), 1500) // 1.5 秒后消失
        } catch (err) {
            console.error('复制失败', err)
        }
    }

    onMounted(getInfo)
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
        <h2 class="page-title"><i class="bi bi-info-circle"></i> 当前网络信息 </h2>

        <div class="dashboard-card">
            <div class="d-flex align-items-center">
                <button @click="getInfo" class="btn btn-primary me-3" :disabled="loading">
                    <i class="bi bi-arrow-repeat me-2"></i>获取信息 / Refresh
                </button>
                <div v-if="loading" class="spinner-border text-primary"></div>
            </div>
            <p v-if="error" class="text-danger mt-2">
                <i class="bi bi-exclamation-circle me-2"></i>{{ error }}
            </p>
        </div>

        <div v-if="info.ip" class="dashboard-card">
            <h5 class="mb-3 text-success">
                <i class="bi bi-clipboard-check me-2"></i>结果
            </h5>
            <div class="d-flex flex-column gap-3">

                <div class="d-flex align-items-center">
                    <!-- <span class="badge rounded-pill bg-info text-dark fs-6 px-3 py-2 flex-grow-1">
                        <i class="bi bi-hdd-network me-1"></i>IP: {{ info.ip }}
                    </span> -->
                    <div class="info-block flex-grow-1">
                        <div class="info-label">
                            <i class="bi bi-hdd-network"></i>
                            IP
                        </div>
                        <pre class="info-content">{{ info.ip }}</pre>
                    </div>
                    <button class="btn btn-sm btn-outline-secondary ms-2" @click="copyToClipboard(info.ip, 'ip')">
                        <i class="bi bi-clipboard"></i>
                    </button>
                    <span v-if="copied === 'ip'" class="text-success ms-2">
                        <i class="bi bi-check-circle"></i> 已复制
                    </span>
                </div>

                <div class="d-flex align-items-center">
                    <!-- <span class="badge rounded-pill bg-warning text-dark fs-6 px-3 py-2 user-agent-badge flex-grow-1"
                        :title="info.user_agent">
                        <i class="bi bi-phone me-1"></i>UA: {{ info.user_agent }}
                    </span> -->
                    <div class="info-block flex-grow-1">
                        <div class="info-label">
                            <i class="bi bi-phone me-1"></i>
                            UA
                        </div>
                        <pre class="info-content">{{ info.user_agent }}</pre>
                    </div>
                    <button class="btn btn-sm btn-outline-secondary ms-2"
                        @click="copyToClipboard(info.user_agent, 'ua')">
                        <i class="bi bi-clipboard"></i>
                    </button>
                    <span v-if="copied === 'ua'" class="text-success ms-2">
                        <i class="bi bi-check-circle"></i> 已复制
                    </span>
                </div>
            </div>
        </div>

        <div class="info-card">
            <div class="card-body">
                <h5 class="text-info mb-3">
                    <i class="bi bi-info-circle me-2"></i>说明
                </h5>
                <ul class="list-unstyled mb-0">
                    <li class="mb-2 d-flex align-items-center">
                        <i class="bi bi-dot text-primary fs-5 me-2"></i>
                        本页面展示客户端的 <strong>IP</strong> 和 <strong>User-Agent</strong> 信息来自 <i><strong>request</strong></i>
                        获取
                    </li>
                    <li class="mb-3 d-flex align-items-center">
                        <i class="bi bi-arrow-repeat text-warning me-2"></i>
                        点击“获取信息 / Refresh”可重新获取
                    </li>

                    <li class="fw-bold mb-2">
                        <i class="bi bi-search me-2 text-secondary"></i>
                        在一般桌面端浏览器中查看 User-Agent 方法：
                    </li>
                    <li class="mb-1 d-flex align-items-center">
                        <i class="bi bi-google text-danger me-2"></i>
                        <span> 在 <strong>Console</strong> 中输入 <code>navigator.userAgent</code> </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .badge {
        font-weight: 500;
        min-width: 280px;
        max-width: 400px;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .user-agent-badge {
        min-width: 280px;
        max-width: 400px;
    }

    .mobile .container {
        font-size: 1.2em;
    }

    .info-block {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 0.75rem 0.9rem;
        max-width: 100%;
    }

    .info-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-secondary);
        margin-bottom: 0.4rem;
        display: flex;
        align-items: center;
        gap: 0.35rem;
    }

    .info-content {
        margin: 0;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 0.85rem;
        line-height: 1.5;
        color: var(--text-primary);
        white-space: pre-wrap;
        word-break: break-all;
    }


</style>
