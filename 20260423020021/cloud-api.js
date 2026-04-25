/**
 * 本地存储API模块 - 模拟云端接口（用于Vercel部署）
 */

// 云端数据缓存（本地模拟）
let cloudData = null;
let isInitialized = false;
let initPromise = null;

/**
 * 初始化本地数据（模拟云端连接）
 */
async function initCloud() {
    if (isInitialized) return cloudData;
    if (initPromise) return initPromise;
    
    initPromise = (async () => {
        try {
            console.log('[CloudAPI] Initializing local storage...');
            
            // 从localStorage加载所有数据
            cloudData = {
                works: JSON.parse(localStorage.getItem('portfolio_works') || '[]'),
                about: JSON.parse(localStorage.getItem('portfolio_about') || 'null'),
                banners: JSON.parse(localStorage.getItem('portfolio_banners') || '[]'),
                categories: JSON.parse(localStorage.getItem('portfolio_categories') || '[]'),
                resume: JSON.parse(localStorage.getItem('portfolio_resume') || 'null')
            };
            
            isInitialized = true;
            console.log('[CloudAPI] Local storage initialized');
            console.log('[CloudAPI] Data loaded:', Object.keys(cloudData));
        } catch (error) {
            console.error('[CloudAPI] Local initialization failed:', error.message);
        }
        return cloudData;
    })();
    
    return initPromise;
}

/**
 * 获取数据
 */
async function getCloudData() {
    if (!isInitialized) {
        await initCloud();
    }
    return cloudData;
}

/**
 * 保存数据到本地存储
 */
async function saveToCloud(key, value) {
    try {
        console.log('[CloudAPI] Saving to local storage:', key);
        
        // 映射键名
        const keyMap = {
            'works': 'portfolio_works',
            'about': 'portfolio_about',
            'banners': 'portfolio_banners',
            'categories': 'portfolio_categories',
            'resume': 'portfolio_resume'
        };
        
        const storageKey = keyMap[key];
        if (!storageKey) {
            console.warn('[CloudAPI] Unknown key:', key);
            return false;
        }
        
        // 保存到localStorage
        localStorage.setItem(storageKey, JSON.stringify(value));
        
        // 更新本地缓存
        if (cloudData) {
            cloudData[key] = value;
        }
        
        console.log('[CloudAPI] Saved to local storage:', key);
        return true;
    } catch (error) {
        console.error('[CloudAPI] Save error:', error.message);
        return false;
    }
}

/**
 * 强制刷新数据（重新从localStorage加载）
 */
async function forceRefreshCloudData() {
    try {
        console.log('[CloudAPI] Refreshing local data...');
        
        cloudData = {
            works: JSON.parse(localStorage.getItem('portfolio_works') || '[]'),
            about: JSON.parse(localStorage.getItem('portfolio_about') || 'null'),
            banners: JSON.parse(localStorage.getItem('portfolio_banners') || '[]'),
            categories: JSON.parse(localStorage.getItem('portfolio_categories') || '[]'),
            resume: JSON.parse(localStorage.getItem('portfolio_resume') || 'null')
        };
        
        isInitialized = true;
        console.log('[CloudAPI] Local data refreshed:', Object.keys(cloudData || {}));
        return cloudData;
    } catch (error) {
        console.error('[CloudAPI] Force refresh failed:', error.message);
    }
    return cloudData;
}

// 暴露全局方法
window.CloudAPI = {
    init: initCloud,
    getData: getCloudData,
    save: saveToCloud,
    isReady: () => isInitialized,
    forceRefresh: forceRefreshCloudData
};
