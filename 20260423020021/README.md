# 张三设计工作室 - 设计师作品集网站

一个优雅的极简主义设计师作品展示网站，包含完整的管理员后台系统。

## 功能特点

### 前台展示
- 响应式单页设计，适配各种设备
- 作品集展示，支持点击查看详情
- 1440px 统一宽度，单列垂直图片布局
- 平滑的页面过渡动画
- 联系表单提交

### 管理员后台
- **仪表盘**: 数据统计、最近活动、快捷操作
- **作品管理**: 添加、编辑、删除作品，支持图片上传
- **联系数据**: 查看、标记状态、导出记录
- **系统设置**: 个人信息、密码修改、数据备份

## 文件结构

```
├── index.html           # 首页
├── work.html            # 作品详情页
├── admin-login.html     # 管理员登录
├── admin-dashboard.html  # 仪表盘
├── admin-works.html     # 作品管理
├── admin-settings.html  # 系统设置
├── admin-contacts.html # 联系数据
├── SPEC.md              # 设计规格
└── README.md            # 说明文档
```

## 快速开始

1. 直接在浏览器中打开 `index.html` 即可预览网站
2. 访问 `admin-login.html` 进入管理员后台

### 默认管理员账号
- 用户名: `admin`
- 密码: `admin123`

## 技术栈

- HTML5 + CSS3 + JavaScript (纯原生，无框架)
- Lucide Icons (图标库)
- Google Fonts (字体)
- LocalStorage (数据持久化)

## 路由说明

- 首页: `index.html`
- 作品详情: `work.html?id={id}` (URL参数)
- 管理员后台: `admin-{module}.html`

## 数据存储

所有数据使用 LocalStorage 存储，包括：
- `portfolio_session`: 登录会话
- `portfolio_admins`: 管理员账号
- `portfolio_works`: 作品数据
- `portfolio_contacts`: 联系记录
- `portfolio_settings`: 系统设置
- `portfolio_logs`: 操作日志

## 许可证

MIT License

---

## 部署信息

**部署平台**: 腾讯云 CloudBase 静态网站托管

**访问地址**: https://ai-native-d0gc0n8ngab6ad9a9-1424489190.tcloudbaseapp.com/

**环境ID**: ai-native-d0gc0n8ngab6ad9a9

**部署时间**: 2026-04-21

**CloudBase 控制台**: https://console.cloud.tencent.com/tcb

**数据库**: CloudBase NoSQL 数据库（云端同步）

**云函数**: site-api（数据同步API）
