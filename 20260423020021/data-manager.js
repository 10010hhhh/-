/**
 * 作品集数据管理器 - 统一管理所有数据
 */
(function() {
    'use strict';

    // Vercel 部署时定义空的 API URL（避免报错）
    if (window.CLOUD_API_URL === undefined) {
        window.CLOUD_API_URL = null;
    }

    // 存储键名
    const STORAGE_KEY = 'portfolio_works';
    const CONTACTS_KEY = 'portfolio_contacts';
    const LOGS_KEY = 'portfolio_logs';
    const SESSION_KEY = 'portfolio_session';
    const CACHE_VERSION_KEY = 'portfolio_cache_version';
    const BANNER_KEY = 'portfolio_banners';
    const ABOUT_KEY = 'portfolio_about';
    const SYNC_KEY = 'portfolio_sync';
    const CATEGORIES_KEY = 'portfolio_categories';
    const STYLE_SETTINGS_KEY = 'portfolio_style_settings';
    const RESUME_KEY = 'portfolio_resume';
    const RESUME_HISTORY_KEY = 'portfolio_resume_history';
    const RESUME_PENDING_KEY = 'portfolio_resume_pending';
    const VISIT_LOGS_KEY = 'portfolio_visit_logs';
    const PAGE_VIEW_KEY = 'portfolio_page_views';

    // 默认Banner数据
    const DEFAULT_BANNERS = [
        { id: 1, title: '张三设计工作室', subtitle: '用设计讲述品牌故事', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&h=1080&fit=crop', link: '', order: 1, status: 'active' },
        { id: 2, title: '专业品牌设计服务', subtitle: '从策略到执行，一站式解决方案', image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&h=1080&fit=crop', link: '', order: 2, status: 'active' }
    ];

    // 默认分类数据
    const DEFAULT_CATEGORIES = [
        { id: 1, name: '品牌设计', color: '#c9a87c' },
        { id: 2, name: '包装设计', color: '#667eea' },
        { id: 3, name: '活动视觉', color: '#f5576c' },
        { id: 4, name: '插画创作', color: '#4facfe' },
        { id: 5, name: 'UI设计', color: '#43e97b' }
    ];

    // 默认样式设置
    const DEFAULT_STYLE_SETTINGS = {
        workTitle: {
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '22px',
            fontWeight: '500',
            color: '#1a1a1a'
        }
    };

    // 默认设计师简介
    const DEFAULT_ABOUT = {
        name: '张三',
        title: '品牌设计师 / 创意总监',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        bio: '拥有8年品牌设计经验，专注于帮助企业打造独特的视觉识别系统。致力于将品牌故事通过设计语言转化为可感知的视觉体验，让每一个品牌都能找到属于自己的声音。',
        skills: ['品牌策略', '视觉识别', '包装设计', 'UI设计', '插画创作'],
        experience: '8年',
        projects: '200+',
        clients: '50+',
        email: 'hello@zhangsan.design',
        phone: '138-0000-0000',
        location: '北京',
        social: {
            wechat: 'zhangsan_design',
            weibo: '@张三设计',
            dribbble: 'zhangsan'
        }
    };

    // 默认作品数据
    const DEFAULT_WORKS = [
        { id: 1, title: '晨曦咖啡', category: '品牌设计', year: '2024', duration: '3个月', desc: '精品咖啡品牌全案视觉设计', mainImage: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&h=500&fit=crop', gallery: [], status: 'published', createdAt: '2024-01-15T10:00:00Z' },
        { id: 2, title: '云境酒店', category: '品牌设计', year: '2024', duration: '4个月', desc: '高端度假酒店品牌形象升级', mainImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop', gallery: [], status: 'published', createdAt: '2024-02-20T10:00:00Z' },
        { id: 3, title: '竹语', category: '包装设计', year: '2023', duration: '2个月', desc: '东方植萃护肤品牌包装设计', mainImage: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&h=500&fit=crop', gallery: [], status: 'published', createdAt: '2023-11-10T10:00:00Z' },
        { id: 4, title: '城市音符', category: '活动视觉', year: '2023', duration: '2个月', desc: '年度音乐节主视觉及延展设计', mainImage: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=500&fit=crop', gallery: [], status: 'published', createdAt: '2023-09-05T10:00:00Z' },
        { id: 5, title: '留白', category: '品牌设计', year: '2023', duration: '5个月', desc: '极简主义家居品牌全案设计', mainImage: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=500&fit=crop', gallery: [], status: 'published', createdAt: '2023-07-20T10:00:00Z' },
        { id: 6, title: '流动', category: '插画创作', year: '2023', duration: '持续创作', desc: '系列数字艺术插画作品', mainImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=500&fit=crop', gallery: [], status: 'published', createdAt: '2023-05-15T10:00:00Z' },
        { id: 7, title: '觅境', category: '品牌设计', year: '2023', duration: '3个月', desc: '户外运动品牌视觉系统设计', mainImage: 'https://images.unsplash.com/photo-1551687297-2b1e44b2b7f5?w=800&h=500&fit=crop', gallery: [], status: 'published', createdAt: '2023-04-10T10:00:00Z' },
        { id: 8, title: '素年', category: '包装设计', year: '2023', duration: '2个月', desc: '新式茶饮品牌包装创意', mainImage: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800&h=500&fit=crop', gallery: [], status: 'published', createdAt: '2023-03-15T10:00:00Z' },
        { id: 9, title: '逐光', category: 'UI设计', year: '2023', duration: '4个月', desc: '艺术展览APP界面设计', mainImage: 'https://images.unsplash.com/photo-1561070791-36c11767b26a?w=800&h=500&fit=crop', gallery: [], status: 'published', createdAt: '2023-02-20T10:00:00Z' }
    ];

    // 默认简历数据
    const DEFAULT_RESUME = {
        name: '张三',
        title: '品牌设计师 / 创意总监',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        summary: '拥有8年品牌设计经验，专注于帮助企业打造独特的视觉识别系统。',
        experience: [
            { period: '2021 - 至今', company: '张三设计工作室', role: '创始人 / 创意总监', desc: '创立个人设计工作室，为客户提供品牌策略、视觉识别、包装设计等全方位服务。成功服务超过50家中大型企业客户，完成200+品牌设计项目。' },
            { period: '2018 - 2021', company: '国际4A广告公司', role: '资深美术指导', desc: '担任创意团队核心成员，负责多个知名品牌的视觉升级项目。主导设计了多款爆款产品包装，累计创造GMV超过5亿元。' },
            { period: '2016 - 2018', company: '知名互联网公司', role: '品牌设计师', desc: '负责公司全线产品的品牌视觉设计，建立统一的设计语言系统。参与从0到1打造多个知名互联网品牌。' }
        ],
        education: [
            { period: '2012 - 2016', school: '清华大学美术学院', major: '视觉传达设计', degree: '学士' },
            { period: '2016 - 2018', school: '皇家艺术学院', major: '品牌设计', degree: '硕士' }
        ],
        skills: [
            { 
                category: '设计软件', 
                items: [
                    { name: 'Adobe Photoshop', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Adobe_Photoshop_CC_icon.svg/1200px-Adobe_Photoshop_CC_icon.svg.png' },
                    { name: 'Adobe Illustrator', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Adobe_Illustrator_CC_icon.svg/1200px-Adobe_Illustrator_CC_icon.svg.png' },
                    { name: 'Figma', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/1200px-Figma-logo.svg.png' },
                    { name: 'Sketch', icon: '' },
                    { name: 'InDesign', icon: '' },
                    { name: 'Cinema 4D', icon: '' },
                    { name: 'After Effects', icon: '' }
                ] 
            },
            { 
                category: '专业技能', 
                items: [
                    { name: '品牌策略', icon: '' },
                    { name: '视觉识别设计', icon: '' },
                    { name: '包装设计', icon: '' },
                    { name: 'UI/UX设计', icon: '' },
                    { name: '插画创作', icon: '' },
                    { name: '字体设计', icon: '' }
                ] 
            },
            { 
                category: '软技能', 
                items: [
                    { name: '项目管理', icon: '' },
                    { name: '团队协作', icon: '' },
                    { name: '客户沟通', icon: '' },
                    { name: '设计演讲', icon: '' }
                ] 
            }
        ],
        awards: [
            { year: '2024', title: '德国红点设计大奖', org: 'Red Dot Design Award' },
            { year: '2023', title: '中国设计红星奖', org: 'China Red Star Design Award' },
            { year: '2022', title: '亚洲设计大奖', org: 'Asia Design Prize' }
        ]
    };

    // 订阅者列表
    const subscribers = [];

    // 获取缓存版本号（用于破坏缓存）
    function getCacheVersion() {
        let version = localStorage.getItem(CACHE_VERSION_KEY);
        if (!version) {
            version = Date.now().toString(36);
            localStorage.setItem(CACHE_VERSION_KEY, version);
        }
        return version;
    }

    // 增加缓存版本号
    function incrementCacheVersion() {
        const newVersion = Date.now().toString(36);
        localStorage.setItem(CACHE_VERSION_KEY, newVersion);
        // 触发跨标签页同步
        localStorage.setItem('portfolio_sync_trigger', newVersion);
        // 触发worksDataUpdated事件
        window.dispatchEvent(new CustomEvent('worksDataUpdated', {
            detail: { version: newVersion, source: 'cacheVersionUpdate' }
        }));
        console.log('[WorksData] Cache version updated to:', newVersion);
        return newVersion;
    }

    // 破坏图片URL缓存
    function bustImageCache(url) {
        if (!url) return url;
        // 如果是Base64图片，不需要破坏缓存
        if (url.startsWith('data:')) return url;
        // 如果已经有查询参数，追加
        if (url.includes('?')) {
            return url + '&v=' + getCacheVersion();
        }
        return url + '?v=' + getCacheVersion();
    }

    // ============ Banner 管理 ============
    
    // 获取Banner列表（直接返回，不触发同步）
    function getBanners() {
        let banners = JSON.parse(localStorage.getItem(BANNER_KEY) || '[]');
        if (banners.length === 0) {
            banners = JSON.parse(JSON.stringify(DEFAULT_BANNERS));
            localStorage.setItem(BANNER_KEY, JSON.stringify(banners));
        }
        return banners.sort((a, b) => a.order - b.order);
    }

    // 保存Banner列表
    function saveBanners(banners) {
        incrementCacheVersion();
        localStorage.setItem(BANNER_KEY, JSON.stringify(banners));
        triggerSync('banners', banners);
        syncToCloud(BANNER_KEY, banners);
        return banners;
    }

    // 添加Banner
    function addBanner(banner) {
        const banners = getBanners();
        const newBanner = {
            ...banner,
            id: Date.now(),
            order: banners.length + 1,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        banners.push(newBanner);
        return saveBanners(banners);
    }

    // 更新Banner
    function updateBanner(id, data) {
        const banners = getBanners();
        const index = banners.findIndex(b => b.id === id);
        if (index !== -1) {
            banners[index] = { ...banners[index], ...data, updatedAt: new Date().toISOString() };
            return saveBanners(banners);
        }
        return banners;
    }

    // 删除Banner
    function deleteBanner(id) {
        const banners = getBanners().filter(b => b.id !== id);
        // 重新排序
        banners.forEach((b, i) => b.order = i + 1);
        return saveBanners(banners);
    }

    // 获取前台展示的Banners
    function getBannersForDisplay() {
        return getBanners().filter(b => b.status === 'active').map(banner => ({
            id: banner.id,
            title: banner.title,
            subtitle: banner.subtitle,
            image: getImageUrl(banner.image),
            link: banner.link
        }));
    }

    // ============ 设计师简介管理 ============
    
    // 获取简介（直接返回，不触发同步）
    function getAbout() {
        let about = JSON.parse(localStorage.getItem(ABOUT_KEY) || 'null');
        if (!about) {
            about = JSON.parse(JSON.stringify(DEFAULT_ABOUT));
            localStorage.setItem(ABOUT_KEY, JSON.stringify(about));
        }
        return about;
    }

    // 保存简介
    function saveAbout(data) {
        incrementCacheVersion();
        localStorage.setItem(ABOUT_KEY, JSON.stringify(data));
        triggerSync('about', data);
        syncToCloud(ABOUT_KEY, data);
        return data;
    }

    // 获取前台展示的简介
    function getAboutForDisplay() {
        const about = getAbout();
        return {
            ...about,
            avatar: getImageUrl(about.avatar)
        };
    }

    // ============ 实时同步机制 ============
    
    // 触发同步事件（只存储元数据，避免 localStorage 超限）
    function triggerSync(type, data) {
        const syncData = {
            type: type,
            // 不存储完整数据，只存储类型和版本号
            timestamp: Date.now()
        };
        // 使用极简存储，跨标签页同步
        localStorage.setItem(SYNC_KEY, JSON.stringify(syncData));
        // 触发事件让同标签页更新
        window.dispatchEvent(new CustomEvent('siteDataSync', {
            detail: syncData
        }));
    }

    // 获取作品列表（直接返回，不触发同步）
    function getWorks() {
        let works = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (works.length === 0) {
            works = JSON.parse(JSON.stringify(DEFAULT_WORKS));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(works));
        }
        return works;
    }

    // 保存作品列表
    function saveWorks(works) {
        // 更新缓存版本
        incrementCacheVersion();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(works));
        notifySubscribers(works);
        triggerSync('works', works);
        syncToCloud(STORAGE_KEY, works);
        return works;
    }

    // 添加作品
    function addWork(work) {
        const works = getWorks();
        const newWork = {
            ...work,
            id: Date.now(),
            status: 'published',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        works.unshift(newWork);
        return saveWorks(works);
    }

    // 更新作品
    function updateWork(id, data) {
        const works = getWorks();
        const index = works.findIndex(w => w.id === id);
        if (index !== -1) {
            works[index] = {
                ...works[index],
                ...data,
                updatedAt: new Date().toISOString()
            };
            return saveWorks(works);
        }
        return works;
    }

    // 删除作品
    function deleteWork(id) {
        const works = getWorks().filter(w => w.id !== id);
        return saveWorks(works);
    }

    // 获取带缓存破坏的图片URL
    function getImageUrl(url) {
        return bustImageCache(url);
    }

    // 获取前端展示用的作品数据（带缓存破坏）
    function getWorksForDisplay() {
        const works = getWorks();
        return works.map(work => ({
            id: work.id,
            title: work.title,
            desc: work.desc || '',
            image: getImageUrl(work.mainImage || work.image),
            category: work.category || '品牌设计',
            year: work.year || ''
        }));
    }

    // 订阅数据变化
    function subscribe(callback) {
        if (typeof callback === 'function') {
            subscribers.push(callback);
        }
    }

    // 取消订阅
    function unsubscribe(callback) {
        const index = subscribers.indexOf(callback);
        if (index > -1) {
            subscribers.splice(index, 1);
        }
    }

    // 通知订阅者
    function notifySubscribers(works) {
        subscribers.forEach(fn => {
            try {
                fn(works);
            } catch (e) {
                console.error('[WorksData] Subscriber error:', e);
            }
        });
        // 触发storage事件（跨标签页同步）
        window.dispatchEvent(new CustomEvent('worksDataUpdated', { detail: works }));
    }

    // ============ 联系记录管理 ============

    // 获取联系记录
    function getContacts() {
        return JSON.parse(localStorage.getItem(CONTACTS_KEY) || '[]');
    }

    // 添加联系记录
    function addContact(contact) {
        const contacts = getContacts();
        contacts.unshift({
            ...contact,
            id: Date.now(),
            status: 'new',
            createdAt: new Date().toISOString()
        });
        localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
        return contacts;
    }

    // 获取日志
    function getLogs() {
        return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
    }

    // 添加日志
    function addLog(type, message) {
        const logs = getLogs();
        logs.unshift({
            type,
            message,
            time: new Date().toISOString(),
            ip: '127.0.0.1'
        });
        localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, 100)));
    }

    // 导出所有数据
    function exportData() {
        return {
            works: getWorks(),
            contacts: getContacts(),
            logs: getLogs(),
            exportedAt: new Date().toISOString()
        };
    }

    // 清空所有数据
    function clearAll() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(CONTACTS_KEY);
        localStorage.removeItem(LOGS_KEY);
        localStorage.removeItem(CACHE_VERSION_KEY);
        incrementCacheVersion();
        notifySubscribers(getWorks());
    }

    // ============ 分类管理 ============

    // 获取分类列表（直接返回，不触发同步）
    function getCategories() {
        let categories = JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]');
        if (categories.length === 0) {
            categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
            localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
        }
        return categories;
    }

    // 保存分类列表
    function saveCategories(categories) {
        incrementCacheVersion();
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
        triggerSync('categories', categories);
        syncToCloud(CATEGORIES_KEY, categories);
        return categories;
    }

    // 添加分类
    function addCategory(category) {
        const categories = getCategories();
        const newCategory = {
            ...category,
            id: Date.now()
        };
        categories.push(newCategory);
        return saveCategories(categories);
    }

    // 更新分类
    function updateCategory(id, data) {
        const categories = getCategories();
        const index = categories.findIndex(c => c.id === id);
        if (index !== -1) {
            categories[index] = { ...categories[index], ...data };
            return saveCategories(categories);
        }
        return categories;
    }

    // 删除分类
    function deleteCategory(id) {
        const categories = getCategories().filter(c => c.id !== id);
        return saveCategories(categories);
    }

    // ============ 样式设置管理 ============

    // 获取样式设置
    function getStyleSettings() {
        let settings = JSON.parse(localStorage.getItem(STYLE_SETTINGS_KEY) || 'null');
        if (!settings) {
            settings = JSON.parse(JSON.stringify(DEFAULT_STYLE_SETTINGS));
            localStorage.setItem(STYLE_SETTINGS_KEY, JSON.stringify(settings));
        }
        return settings;
    }

    // 保存样式设置
    function saveStyleSettings(settings) {
        incrementCacheVersion();
        localStorage.setItem(STYLE_SETTINGS_KEY, JSON.stringify(settings));
        triggerSync('styleSettings', settings);
        return settings;
    }

    // 更新作品标题样式
    function updateWorkTitleStyle(style) {
        const settings = getStyleSettings();
        settings.workTitle = { ...settings.workTitle, ...style };
        return saveStyleSettings(settings);
    }

    // 获取用于前台展示的样式
    function getStyleSettingsForDisplay() {
        return getStyleSettings();
    }

    // ============ 简历管理 ============

    // 获取简历数据
    function getResume() {
        let resume = JSON.parse(localStorage.getItem(RESUME_KEY) || 'null');
        if (!resume) {
            resume = JSON.parse(JSON.stringify(DEFAULT_RESUME));
            localStorage.setItem(RESUME_KEY, JSON.stringify(resume));
        }
        return resume;
    }

    // 保存简历数据
    function saveResume(resume) {
        localStorage.setItem(RESUME_KEY, JSON.stringify(resume));
        incrementCacheVersion();
        triggerSync('resume', resume);
        syncToCloud(RESUME_KEY, resume);
        notifySubscribers('resume');
        console.log('[WorksData] Resume saved');
        return resume;
    }

    // 获取用于前台展示的简历
    function getResumeForDisplay() {
        return getResume();
    }

    // ============ 简历修改历史管理 ============

    // 获取简历修改历史
    function getResumeHistory() {
        return JSON.parse(localStorage.getItem(RESUME_HISTORY_KEY) || '[]');
    }

    // 添加简历修改记录
    function addResumeHistory(action, oldData, newData, operator) {
        const history = getResumeHistory();
        const record = {
            id: Date.now(),
            action: action, // 'create', 'update', 'delete'
            oldData: oldData,
            newData: newData,
            operator: operator || 'admin',
            createdAt: new Date().toISOString(),
            status: 'approved' // 默认直接通过
        };
        history.unshift(record);
        // 只保留最近100条记录
        localStorage.setItem(RESUME_HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
        console.log('[WorksData] Resume history added:', action);
        return record;
    }

    // 获取待审核的简历修改
    function getPendingResumeChanges() {
        return JSON.parse(localStorage.getItem(RESUME_PENDING_KEY) || '[]');
    }

    // 提交简历修改待审核
    function submitResumeForReview(newData, operator) {
        const pending = getPendingResumeChanges();
        const currentResume = getResume();
        const record = {
            id: Date.now(),
            oldData: JSON.parse(JSON.stringify(currentResume)),
            newData: JSON.parse(JSON.stringify(newData)),
            operator: operator || 'admin',
            submittedAt: new Date().toISOString(),
            status: 'pending',
            diff: generateResumeDiff(currentResume, newData)
        };
        pending.unshift(record);
        localStorage.setItem(RESUME_PENDING_KEY, JSON.stringify(pending));
        console.log('[WorksData] Resume change submitted for review');
        return record;
    }

    // 生成简历差异对比
    function generateResumeDiff(oldData, newData) {
        const diffs = [];
        
        // 比较基本信息
        if (oldData.name !== newData.name) {
            diffs.push({ field: '姓名', old: oldData.name, new: newData.name });
        }
        if (oldData.title !== newData.title) {
            diffs.push({ field: '头衔', old: oldData.title, new: newData.title });
        }
        if (oldData.summary !== newData.summary) {
            diffs.push({ field: '简介', old: oldData.summary, new: newData.summary });
        }
        if (oldData.avatar !== newData.avatar) {
            diffs.push({ field: '头像', old: '(已修改)', new: '(已修改)' });
        }
        
        // 比较工作经验
        if (JSON.stringify(oldData.experience) !== JSON.stringify(newData.experience)) {
            diffs.push({ 
                field: '工作经验', 
                old: oldData.experience.length + '条', 
                new: newData.experience.length + '条' 
            });
        }
        
        // 比较教育背景
        if (JSON.stringify(oldData.education) !== JSON.stringify(newData.education)) {
            diffs.push({ 
                field: '教育背景', 
                old: oldData.education.length + '条', 
                new: newData.education.length + '条' 
            });
        }
        
        // 比较技能
        if (JSON.stringify(oldData.skills) !== JSON.stringify(newData.skills)) {
            diffs.push({ field: '技能', old: '(已修改)', new: '(已修改)' });
        }
        
        // 比较奖项
        if (JSON.stringify(oldData.awards) !== JSON.stringify(newData.awards)) {
            diffs.push({ 
                field: '荣誉奖项', 
                old: oldData.awards.length + '条', 
                new: newData.awards.length + '条' 
            });
        }
        
        return diffs;
    }

    // 审核通过简历修改
    function approveResumeChange(id, reviewer) {
        const pending = getPendingResumeChanges();
        const index = pending.findIndex(p => p.id === id);
        
        if (index === -1) {
            console.error('[WorksData] Pending change not found:', id);
            return null;
        }
        
        const change = pending[index];
        change.status = 'approved';
        change.reviewedAt = new Date().toISOString();
        change.reviewer = reviewer || 'admin';
        
        // 更新简历数据
        saveResume(change.newData);
        
        // 移入历史记录
        const history = getResumeHistory();
        history.unshift({
            ...change,
            action: 'update',
            actionType: 'approved'
        });
        localStorage.setItem(RESUME_HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
        
        // 从待审核列表移除
        pending.splice(index, 1);
        localStorage.setItem(RESUME_PENDING_KEY, JSON.stringify(pending));
        
        console.log('[WorksData] Resume change approved:', id);
        return change;
    }

    // 拒绝简历修改
    function rejectResumeChange(id, reviewer, reason) {
        const pending = getPendingResumeChanges();
        const index = pending.findIndex(p => p.id === id);
        
        if (index === -1) {
            console.error('[WorksData] Pending change not found:', id);
            return null;
        }
        
        const change = pending[index];
        change.status = 'rejected';
        change.reviewedAt = new Date().toISOString();
        change.reviewer = reviewer || 'admin';
        change.rejectReason = reason || '';
        
        // 移入历史记录
        const history = getResumeHistory();
        history.unshift({
            ...change,
            action: 'update',
            actionType: 'rejected'
        });
        localStorage.setItem(RESUME_HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
        
        // 从待审核列表移除
        pending.splice(index, 1);
        localStorage.setItem(RESUME_PENDING_KEY, JSON.stringify(pending));
        
        console.log('[WorksData] Resume change rejected:', id);
        return change;
    }

    // 获取已审核的历史记录
    function getResumeAuditHistory() {
        return getResumeHistory().filter(h => h.status === 'approved' || h.status === 'rejected');
    }

    // 删除历史记录
    function deleteResumeHistory(id) {
        const history = getResumeHistory().filter(h => h.id !== id);
        localStorage.setItem(RESUME_HISTORY_KEY, JSON.stringify(history));
        return history;
    }

    // 清空已审核的历史记录
    function clearResumeAuditHistory() {
        localStorage.setItem(RESUME_HISTORY_KEY, JSON.stringify([]));
        console.log('[WorksData] Resume audit history cleared');
    }

    // ============ 用户访问追踪 ============

    // 获取访问日志
    function getVisitLogs() {
        return JSON.parse(localStorage.getItem(VISIT_LOGS_KEY) || '[]');
    }

    // 获取页面浏览记录
    function getPageViews() {
        return JSON.parse(localStorage.getItem(PAGE_VIEW_KEY) || '[]');
    }

    // 获取用户IP信息（使用 ip-api.com）
    function getIPInfo() {
        return new Promise((resolve, reject) => {
            // 使用 localStorage 缓存 IP 信息，避免频繁请求
            const cached = localStorage.getItem('portfolio_ip_info');
            if (cached) {
                const cacheData = JSON.parse(cached);
                const cacheTime = cacheData.timestamp;
                const now = Date.now();
                // 缓存有效期 1 小时
                if (now - cacheTime < 3600000) {
                    resolve(cacheData);
                    return;
                }
            }

            // 使用 ip-api.com 获取 IP 信息（免费版）
            // ip-api.com 免费版不支持 HTTPS，跳过 IP 信息获取
            resolve({ ip: '127.0.0.1', district: '未知', city: '未知', region: '未知', timestamp: Date.now() });
        });
    }

    // 记录用户访问
    function recordVisit(page, userId = 'visitor') {
        return getIPInfo().then(ipInfo => {
            const visits = getVisitLogs();
            const visit = {
                id: Date.now(),
                page: page,
                userId: userId,
                ip: ipInfo.ip,
                location: {
                    country: ipInfo.country || '未知',
                    region: ipInfo.region || '未知',
                    city: ipInfo.city || '未知',
                    district: ipInfo.district || '未知'
                },
                isp: ipInfo.isp || '未知',
                visitTime: new Date().toISOString(),
                userAgent: navigator.userAgent
            };
            visits.unshift(visit);
            // 只保留最近 500 条记录
            localStorage.setItem(VISIT_LOGS_KEY, JSON.stringify(visits.slice(0, 500)));
            console.log('[WorksData] Visit recorded:', page, ipInfo.ip);
            return visit;
        });
    }

    // 记录页面停留
    let currentPageView = null;
    let pageViewStartTime = null;

    function startPageView(page, userId = 'visitor') {
        pageViewStartTime = Date.now();
        const pageViews = getPageViews();
        currentPageView = {
            id: Date.now(),
            page: page,
            userId: userId,
            ip: localStorage.getItem('portfolio_ip_info') ? JSON.parse(localStorage.getItem('portfolio_ip_info')).ip : 'unknown',
            startTime: new Date().toISOString(),
            scrollDepth: 0,
            interactions: 0
        };
        return currentPageView;
    }

    function endPageView() {
        if (!currentPageView || !pageViewStartTime) return null;

        const duration = Date.now() - pageViewStartTime;
        const pageViews = getPageViews();

        currentPageView.duration = duration;
        currentPageView.endTime = new Date().toISOString();

        pageViews.unshift(currentPageView);
        localStorage.setItem(PAGE_VIEW_KEY, JSON.stringify(pageViews.slice(0, 1000)));

        console.log('[WorksData] Page view ended:', currentPageView.page, Math.round(duration / 1000) + 's');

        const result = currentPageView;
        currentPageView = null;
        pageViewStartTime = null;
        return result;
    }

    // 记录滚动深度
    function updateScrollDepth(depth) {
        if (currentPageView) {
            currentPageView.scrollDepth = Math.max(currentPageView.scrollDepth || 0, depth);
        }
    }

    // 记录交互次数
    function incrementInteractions() {
        if (currentPageView) {
            currentPageView.interactions = (currentPageView.interactions || 0) + 1;
        }
    }

    // 生成访问报告
    function generateVisitReport(days = 7) {
        const visits = getVisitLogs();
        const pageViews = getPageViews();
        const now = new Date();
        const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

        // 过滤指定天数内的数据
        const recentVisits = visits.filter(v => new Date(v.visitTime) >= startDate);
        const recentPageViews = pageViews.filter(p => new Date(p.startTime) >= startDate);

        // 按天统计
        const dailyStats = {};
        for (let i = 0; i < days; i++) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split('T')[0];
            dailyStats[dateStr] = { visits: 0, uniqueIPs: new Set(), pages: {} };
        }

        recentVisits.forEach(v => {
            const dateStr = v.visitTime.split('T')[0];
            if (dailyStats[dateStr]) {
                dailyStats[dateStr].visits++;
                dailyStats[dateStr].uniqueIPs.add(v.ip);
            }
        });

        // 页面访问统计
        const pageStats = {};
        recentVisits.forEach(v => {
            if (!pageStats[v.page]) {
                pageStats[v.page] = { count: 0, uniqueVisitors: new Set(), totalDuration: 0, count2: 0 };
            }
            pageStats[v.page].count++;
            pageStats[v.page].uniqueVisitors.add(v.ip);
        });

        // 合并页面浏览时长
        recentPageViews.forEach(p => {
            const pageName = p.page;
            if (pageStats[pageName]) {
                pageStats[pageName].totalDuration += p.duration || 0;
                pageStats[pageName].count2++;
            }
        });

        // 地区统计
        const locationStats = {};
        recentVisits.forEach(v => {
            const key = v.location.district || v.location.city || '未知';
            if (!locationStats[key]) {
                locationStats[key] = { count: 0, region: v.location.region, city: v.location.city };
            }
            locationStats[key].count++;
        });

        // 生成报告
        const report = {
            period: `${days}天`,
            generatedAt: new Date().toISOString(),
            summary: {
                totalVisits: recentVisits.length,
                uniqueVisitors: new Set(recentVisits.map(v => v.ip)).size,
                totalPageViews: recentPageViews.length,
                avgDuration: recentPageViews.length > 0
                    ? Math.round(recentPageViews.reduce((sum, p) => sum + (p.duration || 0), 0) / recentPageViews.length / 1000)
                    : 0
            },
            dailyStats: Object.keys(dailyStats).map(date => ({
                date: date,
                visits: dailyStats[date].visits,
                uniqueVisitors: dailyStats[date].uniqueIPs.size
            })).reverse(),
            topPages: Object.keys(pageStats).map(page => ({
                page: page,
                visits: pageStats[page].count,
                uniqueVisitors: pageStats[page].uniqueVisitors.size,
                avgDuration: pageStats[page].count2 > 0
                    ? Math.round(pageStats[page].totalDuration / pageStats[page].count2 / 1000)
                    : 0
            })).sort((a, b) => b.visits - a.visits).slice(0, 10),
            topLocations: Object.keys(locationStats).map(loc => ({
                location: loc,
                region: locationStats[loc].region,
                city: locationStats[loc].city,
                visits: locationStats[loc].count
            })).sort((a, b) => b.visits - a.visits).slice(0, 10),
            recentVisits: recentVisits.slice(0, 20)
        };

        return report;
    }

    // 清空访问记录
    function clearVisitLogs() {
        localStorage.setItem(VISIT_LOGS_KEY, JSON.stringify([]));
        localStorage.setItem(PAGE_VIEW_KEY, JSON.stringify([]));
        console.log('[WorksData] Visit logs cleared');
    }

    // 导出访问报告
    function exportVisitReport(days = 30) {
        const report = generateVisitReport(days);
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `访问报告_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        return report;
    }

    // 云端同步状态
    let cloudSyncEnabled = false;
    let cloudDataCache = null;
    let initPromise = null;
    // 记录本地最后一次写入时间戳，用于判断"本地是否比云端更新"
    let lastLocalWriteTime = 0;

    // 初始化云端同步
    // 策略：始终以云端数据为准拉取到本地（管理员后台修改的数据在云端），
    //        仅当本地刚写入且云端尚无数据时，才将本地数据推送到云端
    async function initCloudSync() {
        // 如果已有初始化promise，等待它完成
        if (initPromise) {
            return initPromise;
        }
        
        if (cloudSyncEnabled) return Promise.resolve();
        
        // 等待 CloudAPI 加载
        if (typeof CloudAPI === 'undefined') {
            console.log('[WorksData] CloudAPI not loaded, using local data only');
            return Promise.resolve();
        }
        
        initPromise = (async () => {
            try {
                // 1. 先读取本地数据
                const localWorks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                const localAbout = JSON.parse(localStorage.getItem(ABOUT_KEY) || 'null');
                const localBanners = JSON.parse(localStorage.getItem(BANNER_KEY) || '[]');
                const localCategories = JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]');
                
                // 2. 初始化云端并获取云端数据
                await CloudAPI.init();
                const cloudData = CloudAPI.getData();
                
                // 3. 云端数据优先，拉取到本地
                if (cloudData) {
                    cloudDataCache = cloudData;
                    
                    // --- Works ---
                    if (cloudData.works && cloudData.works.length > 0) {
                        // 云端有数据，以云端为准更新本地
                        console.log('[WorksData] Cloud works data found, updating local...');
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData.works));
                    } else if (localWorks.length > 0) {
                        // 云端没有works数据，本地有，推送本地到云端
                        console.log('[WorksData] No cloud works, syncing local to cloud...');
                        await syncToCloud(STORAGE_KEY, localWorks);
                    }
                    
                    // --- About ---
                    if (cloudData.about) {
                        localStorage.setItem(ABOUT_KEY, JSON.stringify(cloudData.about));
                    } else if (localAbout) {
                        await syncToCloud(ABOUT_KEY, localAbout);
                    }
                    
                    // --- Banners ---
                    if (cloudData.banners && cloudData.banners.length > 0) {
                        localStorage.setItem(BANNER_KEY, JSON.stringify(cloudData.banners));
                    } else if (localBanners.length > 0) {
                        await syncToCloud(BANNER_KEY, localBanners);
                    }
                    
                    // --- Categories ---
                    if (cloudData.categories && cloudData.categories.length > 0) {
                        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cloudData.categories));
                    } else if (localCategories.length > 0) {
                        await syncToCloud(CATEGORIES_KEY, localCategories);
                    }

                    // --- Resume ---
                    if (cloudData.resume) {
                        localStorage.setItem(RESUME_KEY, JSON.stringify(cloudData.resume));
                    } else {
                        const localResume = JSON.parse(localStorage.getItem(RESUME_KEY) || 'null');
                        if (localResume) await syncToCloud(RESUME_KEY, localResume);
                    }
                } else {
                    // 云端没有任何数据，将本地数据全部推送
                    console.log('[WorksData] No cloud data, syncing local data to cloud...');
                    if (localWorks.length > 0) await syncToCloud(STORAGE_KEY, localWorks);
                    if (localAbout) await syncToCloud(ABOUT_KEY, localAbout);
                    if (localBanners.length > 0) await syncToCloud(BANNER_KEY, localBanners);
                    if (localCategories.length > 0) await syncToCloud(CATEGORIES_KEY, localCategories);
                    const localResume = JSON.parse(localStorage.getItem(RESUME_KEY) || 'null');
                    if (localResume) await syncToCloud(RESUME_KEY, localResume);
                }
                
                console.log('[WorksData] Cloud sync completed');
                cloudSyncEnabled = true;
                return true;
            } catch (error) {
                console.error('[WorksData] Cloud sync failed:', error);
                return false;
            }
        })();
        
        return initPromise;
    }
    
    // 获取云端数据（同步返回缓存）
    function getCloudData() {
        return cloudDataCache;
    }
    
    // 刷新云端数据（强制从云端重新拉取，不使用缓存）
    async function refreshCloudData() {
        if (typeof CloudAPI === 'undefined') return null;

        try {
            const freshCloudData = await CloudAPI.forceRefresh();
            if (!freshCloudData) return null;

            cloudDataCache = freshCloudData;

            // 将云端最新数据写入本地 localStorage
            if (freshCloudData.works) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(freshCloudData.works));
            }
            if (freshCloudData.about) {
                localStorage.setItem(ABOUT_KEY, JSON.stringify(freshCloudData.about));
            }
            if (freshCloudData.banners) {
                localStorage.setItem(BANNER_KEY, JSON.stringify(freshCloudData.banners));
            }
            if (freshCloudData.categories) {
                localStorage.setItem(CATEGORIES_KEY, JSON.stringify(freshCloudData.categories));
            }
            if (freshCloudData.resume) {
                localStorage.setItem(RESUME_KEY, JSON.stringify(freshCloudData.resume));
            }

            console.log('[WorksData] Cloud data refreshed and local storage updated');
            return freshCloudData;
        } catch (error) {
            console.error('[WorksData] Refresh cloud data failed:', error);
            return null;
        }
    }
    
    // 保存数据时同步到云端（错误处理版本）
    async function syncToCloud(key, value) {
        if (typeof CloudAPI === 'undefined') {
            console.warn('[WorksData] CloudAPI not available, cloud sync skipped');
            return;
        }
        
        // 映射本地键名到云端键名
        const keyMap = {
            [ABOUT_KEY]: 'about',
            [STORAGE_KEY]: 'works',
            [BANNER_KEY]: 'banners',
            [CATEGORIES_KEY]: 'categories',
            [RESUME_KEY]: 'resume'
        };
        
        const cloudKey = keyMap[key];
        if (!cloudKey) {
            console.warn('[WorksData] Unknown key for cloud sync:', key);
            return;
        }
        
        // 更新本地缓存
        if (!cloudDataCache) cloudDataCache = {};
        cloudDataCache[cloudKey] = value;
        
        try {
            // 确保 API 已初始化
            if (!CloudAPI.isReady()) {
                console.log('[WorksData] Initializing CloudAPI...');
                await CloudAPI.init();
            }
            
            // 保存到云端
            const success = await CloudAPI.save(cloudKey, value);
            if (success) {
                console.log('[WorksData] Successfully saved to cloud:', cloudKey);
            } else {
                console.warn('[WorksData] Cloud save returned false:', cloudKey);
            }
        } catch (error) {
            console.error('[WorksData] Cloud sync error:', error);
        }
    }
    
    // 公开API
    window.WorksData = {
        // 初始化
        init: initCloudSync,
        
        // 批量同步所有数据到云端（带详细日志）
        async syncAllToCloud() {
            console.log('[WorksData] === Starting full sync to cloud ===');
            const results = {};
            
            const aboutData = getAbout();
            console.log('[WorksData] Syncing about:', aboutData.name);
            await syncToCloud(ABOUT_KEY, aboutData);
            results.about = 'done';
            
            const worksData = getWorks();
            console.log('[WorksData] Syncing works:', worksData.length, 'items');
            await syncToCloud(STORAGE_KEY, worksData);
            results.works = worksData.length;
            
            const bannersData = getBanners();
            console.log('[WorksData] Syncing banners:', bannersData.length, 'items');
            await syncToCloud(BANNER_KEY, bannersData);
            results.banners = bannersData.length;
            
            const categoriesData = getCategories();
            console.log('[WorksData] Syncing categories:', categoriesData.length, 'items');
            await syncToCloud(CATEGORIES_KEY, categoriesData);
            results.categories = categoriesData.length;
            
            console.log('[WorksData] === Full sync complete ===', results);
            return results;
        },
        
        // 直接测试云端连接和写入
        async testCloudWrite(testData = { test: true, time: Date.now() }) {
            // Vercel 部署时跳过云端测试（使用 localStorage）
            if (!window.CLOUD_API_URL) {
                console.log('[WorksData] Vercel mode: using localStorage');
                // 保存测试数据到 localStorage 验证可用
                try {
                    localStorage.setItem('_test_connection', JSON.stringify(testData));
                    const read = localStorage.getItem('_test_connection');
                    const verified = !!read;
                    localStorage.removeItem('_test_connection');
                    return { success: true, verified, mode: 'localStorage' };
                } catch (e) {
                    return { success: false, error: e.message };
                }
            }
        },
        
        // 诊断云端数据状态（实时查询云端，不使用缓存）
        async diagnoseCloudSync() {
            const report = {
                localData: {
                    works: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').length,
                    about: localStorage.getItem(ABOUT_KEY) ? 'exists' : 'missing',
                    banners: JSON.parse(localStorage.getItem(BANNER_KEY) || '[]').length,
                    categories: JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]').length
                },
                cloudAvailable: typeof CloudAPI !== 'undefined',
                cloudReady: CloudAPI?.isReady?.() || false,
                cloudEndpoint: window.CLOUD_API_URL
            };
            
            // 实时查询云端数据（不依赖缓存）- 仅在有云端API时
            if (report.cloudAvailable && window.CLOUD_API_URL) {
                try {
                    // 强制刷新，从云端实时获取
                    console.log('[WorksData] Querying cloud directly...');
                    const response = await fetch(window.CLOUD_API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'get' })
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            report.cloudData = {
                                works: result.data?.works?.length || 0,
                                about: result.data?.about ? 'exists' : 'missing',
                                banners: result.data?.banners?.length || 0,
                                categories: result.data?.categories?.length || 0,
                                rawKeys: result.data ? Object.keys(result.data) : []
                            };
                            // 更新本地缓存
                            cloudDataCache = result.data;
                            console.log('[WorksData] Cloud data refreshed:', report.cloudData);
                        } else {
                            report.cloudError = result.error || 'Unknown error';
                        }
                    } else {
                        report.cloudError = `HTTP ${response.status}: ${response.statusText}`;
                    }
                } catch (e) {
                    report.cloudError = e.message;
                    console.error('[WorksData] Cloud query failed:', e);
                }
            } else {
                report.cloudError = 'CloudAPI not loaded';
            }
            
            console.log('[WorksData] Diagnosis Report:', report);
            return report;
        },
        
        // 作品管理
        getWorks,
        saveWorks,
        addWork,
        updateWork,
        deleteWork,
        getImageUrl,
        getWorksForDisplay,
        subscribe,
        unsubscribe,

        // Banner管理
        getBanners,
        saveBanners,
        addBanner,
        updateBanner,
        deleteBanner,
        getBannersForDisplay,

        // 设计师简介管理
        getAbout,
        saveAbout,
        getAboutForDisplay,

        // 分类管理
        getCategories,
        saveCategories,
        addCategory,
        updateCategory,
        deleteCategory,

        // 样式设置管理
        getStyleSettings,
        saveStyleSettings,
        updateWorkTitleStyle,
        getStyleSettingsForDisplay,

        // 简历管理
        getResume,
        saveResume,
        getResumeForDisplay,
        getResumeHistory,
        addResumeHistory,
        getPendingResumeChanges,
        submitResumeForReview,
        approveResumeChange,
        rejectResumeChange,
        getResumeAuditHistory,
        deleteResumeHistory,
        clearResumeAuditHistory,

        // 联系记录
        getContacts,
        addContact,

        // 日志
        getLogs,
        addLog,

        // 数据操作
        exportData,
        clearAll,
        incrementCacheVersion,

        // 云端刷新
        refreshCloudData,

        /**
         * 刷新前端页面数据：从云端拉取最新数据并重新渲染
         * 这是 index.html 中 refreshData() 调用的核心方法
         */
        async refreshAllData() {
            console.log('[WorksData] Refreshing all data from cloud...');
            const freshData = await refreshCloudData();
            if (freshData) {
                // 通知所有订阅者数据已更新
                notifySubscribers(getWorks());
                // 触发全局同步事件，让页面重新渲染
                window.dispatchEvent(new CustomEvent('siteDataSync', {
                    detail: { type: 'all', timestamp: Date.now(), source: 'refreshAllData' }
                }));
                window.dispatchEvent(new CustomEvent('worksDataUpdated', {
                    detail: { version: Date.now().toString(36), source: 'refreshAllData' }
                }));
                console.log('[WorksData] All data refreshed from cloud');
            }
            return freshData;
        },

        // 用户访问追踪
        getVisitLogs,
        getPageViews,
        getIPInfo,
        recordVisit,
        startPageView,
        endPageView,
        updateScrollDepth,
        incrementInteractions,
        generateVisitReport,
        clearVisitLogs,
        exportVisitReport
    };

    // 注意：移除跨标签页监听器避免循环刷新
    // 如需跨标签页同步，请在外部页面使用 localStorage.setItem 手动触发

    console.log('[WorksData] Initialized, version:', getCacheVersion());
})();
