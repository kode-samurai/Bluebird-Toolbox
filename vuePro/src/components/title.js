// src/utils/title.js

// ✅ 统一的默认标题（只在这里改）
const DEFAULT_TITLE = 'XX工具箱 - 不要温和的走进那个良夜'

/**
 * 设置页面标题
 * @param {string} title - 你想显示的标题
 */
export function setTitle(title) {
    if (typeof title === 'string' && title.trim()) {
        document.title = title
    } else {
        document.title = DEFAULT_TITLE
    }
}

/**
 * 恢复为默认标题
 */
export function resetTitle() {
    document.title = DEFAULT_TITLE
}
