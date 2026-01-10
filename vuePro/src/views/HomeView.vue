<script setup>

  import { useTheme } from "../components/dark-control";

  const { isDark, toggleTheme } = useTheme()

  const tools = [
    { name: "随机数生成", path: "/random-numbers", icon: "bi-dice-5" },
    { name: "随机字符串生成", path: "/random-strings", icon: "bi-shuffle" },
    { name: "抽奖轮盘", path: "/roulette", icon: "bi-disc" },
    { name: "大小写转换", path: "/case-convert", icon: "bi-type" },
    { name: "JSON 格式化", path: "/json-format", icon: "bi-braces" },
    { name: "颜色转换", path: "/color-convert", icon: "bi-palette" },
    { name: "时间戳转换", path: "/timestamp-convert", icon: "bi-clock" },
    { name: "进制转换", path: "/base-convert", icon: "bi-code" },
    { name: "存储单位换算", path: "/storage-convert", icon: "bi-hdd" },
    { name: "数据速率换算", path: "/data-rate-convert", icon: "bi-speedometer2" },
    { name: "通用单位换算", path: "/general-convert", icon: "bi-code-slash" },
    { name: "BMI 计算", path: "/bmi", icon: "bi-person-arms-up" },
    { name: "日期间隔", path: "/date-diff", icon: "bi-calendar-event" },
    { name: "年龄计算", path: "/age-calculate", icon: "bi-calendar-heart" },
    { name: "Fib 数列", path: "/fibonacci", icon: "bi-calculator" },
    { name: "区间素数", path: "/primes", icon: "bi-calculator" },
    { name: "奇偶求和", path: "/sum-odd-even", icon: "bi-calculator" },
    { name: "网络信息", path: "/info", icon: "bi-info-circle" }
  ];

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
    <h1 class="page-title">🛠️ 青鸟工具箱</h1>

    <div class="dashboard-card">
      <div class="tools-grid">
        <router-link v-for="tool in tools" :key="tool.path" :to="tool.path" class="tool-btn">
          <i :class="`bi ${tool.icon}`"></i>
          <span>{{ tool.name }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
