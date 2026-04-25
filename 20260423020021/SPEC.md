# 设计师作品个人网站规格文档

## 1. Concept & Vision

一个优雅、极简主义的设计师作品展示网站，以"艺术画廊"为设计灵感，让作品本身成为页面的主角。整体氛围宁静而富有艺术气息，通过大量留白和精致的微交互，传达设计师的专业品味与审美格调。

## 2. Design Language

### 美学方向
极简艺术画廊风格 — 受现代艺术博物馆启发，强调空间感与作品的视觉冲击力。

### 配色方案
- **Primary**: `#1a1a1a` (深炭黑 - 标题与强调)
- **Secondary**: `#666666` (中灰 - 正文)
- **Accent**: `#c9a87c` (温暖金铜色 - 高亮与交互)
- **Background**: `#fafafa` (近白 - 主背景)
- **Surface**: `#ffffff` (纯白 - 卡片)
- **Muted**: `#e8e8e8` (浅灰 - 分隔线)

### 字体
- **标题**: `Cormorant Garamond`, serif — 优雅、经典
- **正文**: `Inter`, sans-serif — 清晰、现代
- **字号系统**: 72/48/32/24/18/16/14px

### 空间系统
- 基础单位: 8px
- 大量留白: section间距 120px
- 网格: 12列, 最大宽度 1400px

### 动效哲学
- 入场动画: 淡入上移, 600ms ease-out, 元素间隔 100ms
- 悬停: 微妙缩放 1.02, 300ms ease
- 滚动视差: 作品图片轻微浮动
- 过渡: 所有状态变化 300ms cubic-bezier(0.4, 0, 0.2, 1)

### 视觉资产
- 图标: Lucide Icons (线性风格)
- 作品图片: Unsplash 精选设计类图片
- 装饰: 极简几何线条

## 3. Layout & Structure

### 页面结构
1. **Header** — 固定顶部, 透明背景, 滚动后添加背景
2. **Hero Section** — 全屏高度, 居中大标题 + 副标题
3. **About Section** — 设计师简介 + 头像
4. **Works Gallery** — 作品网格展示, 3列布局
5. **Services Section** — 服务类型卡片
6. **Contact Section** — 联系信息 + 社交链接
7. **Footer** — 版权信息

### 响应式策略
- Desktop (>1200px): 3列作品网格
- Tablet (768-1200px): 2列作品网格
- Mobile (<768px): 单列布局, 汉堡菜单

## 4. Features & Interactions

### 核心功能
- **作品集展示**: 点击作品卡片打开灯箱详情
- **平滑滚动导航**: 点击导航链接平滑滚动到对应区块
- **灯箱弹窗**: 大图展示作品, 点击外部或ESC关闭
- **联系表单**: 基础联系表单验证与提交，数据保存到后台

### 交互细节
- 导航链接悬停: 下划线动画从左到右展开
- 作品卡片悬停: 图片轻微放大 + 标题上移
- 按钮悬停: 背景色渐变 + 轻微上移
- 滚动时: Header背景渐显
- 作品卡片点击: 页面滑动过渡动画 + 跳转详情页
- 详情页返回: 支持浏览器后退按钮

### 边界情况
- 图片加载失败: 显示优雅的占位符
- 空作品列表: 显示友好提示
- 表单验证: 实时验证 + 错误提示
- 详情页404: 自动跳转回首页

## 5. Component Inventory

### Navigation
- 固定顶部, Logo + 导航链接
- 状态: 默认(透明), 滚动后(白色背景+阴影)
- 移动端: 汉堡按钮 + 侧滑菜单

### Hero Section
- 全屏背景渐变
- 大标题 + 副标题 + CTA按钮
- 向下滚动箭头动画

### Work Card
- 16:10 比例图片
- 悬停时显示: 作品标题 + 分类标签
- 状态: 默认, 悬停, 加载中

### Lightbox
- 全屏黑色遮罩
- 居中大图 + 作品信息
- 关闭按钮 + 左右切换(如有多个)

### Service Card
- 图标 + 标题 + 描述
- 悬停: 边框颜色变化

### Contact Form
- 姓名/邮箱/留言 输入框
- 提交按钮
- 状态: 默认, 聚焦, 错误, 提交中, 成功

## 6. Technical Approach

- **框架**: 纯HTML + CSS + JavaScript (无依赖)
- **CSS**: CSS变量 + Flexbox/Grid布局
- **动画**: CSS Animations + Intersection Observer API
- **路由**: URL参数传递作品ID (work.html?id=X)
- **页面过渡**: 自定义CSS过渡动画 (slide-up效果)
- **图标**: Lucide Icons CDN
- **字体**: Google Fonts CDN
- **数据存储**: LocalStorage (用于管理员后台数据持久化)
- **数据管理**: DataManager 统一数据管理层

## 6.1 DataManager 数据管理架构

### 数据存储结构
```javascript
{
  portfolio_works: [],      // 作品数据
  portfolio_profile: {},    // 个人信息
  portfolio_settings: {},   // 系统设置
  portfolio_contacts: [],   // 联系记录
  portfolio_logs: [],       // 操作日志
  portfolio_session: {}     // 登录会话
}
```

### 核心 API
```javascript
DataManager.getWorks()           // 获取作品列表
DataManager.saveWorks(works)     // 保存作品列表
DataManager.addWork(work)        // 添加作品
DataManager.updateWork(id, data) // 更新作品
DataManager.deleteWork(id)        // 删除作品
DataManager.getWorksForDisplay() // 获取前端展示格式
DataManager.getProfile()         // 获取个人信息
DataManager.saveProfile(profile) // 保存个人信息
DataManager.getSettings()        // 获取设置
DataManager.saveSettings(settings)// 保存设置
DataManager.addContact(contact)   // 添加联系记录
DataManager.getContacts()         // 获取联系记录
DataManager.exportAllData()      // 导出所有数据
DataManager.importData(data)     // 导入数据
DataManager.subscribe(key, fn)    // 订阅数据变化
```

### 实时同步机制
- **BroadcastChannel**: 跨标签页实时同步
- **Storage Event**: 同标签页 localStorage 变化监听
- **订阅模式**: 页面可订阅数据变化自动更新 UI

## 7. File Structure

```
├── index.html          # 首页 (作品列表)
├── work.html           # 作品详情页
├── admin-login.html    # 管理员登录页
├── admin-dashboard.html # 管理员仪表盘
├── admin-works.html    # 作品管理页
├── admin-settings.html # 系统设置页
├── admin-contacts.html # 联系数据管理页
├── data-manager.js     # 统一数据管理模块
├── SPEC.md             # 设计规格文档
└── README.md           # 项目说明
```

## 8. Admin Panel Features

### 管理员登录
- 账号密码验证
- 记住登录状态
- 登录日志记录

### 仪表盘
- 作品/联系/浏览量统计
- 最近活动时间线
- 快捷操作入口
- 最新作品预览

### 作品管理
- 作品列表展示（卡片视图）
- 添加/编辑/删除作品
- 分类筛选和搜索
- 图片上传（封面+图库）
- 拖拽上传支持

### 联系数据管理
- 联系记录列表
- 状态管理（待处理/已查看/已回复）
- 详情查看弹窗
- 批量导出（CSV/JSON）
- 清空功能

### 系统设置
- 个人信息编辑
- 头像生成器
- 密码修改
- 数据统计
- 数据导出/备份
- 数据清空
