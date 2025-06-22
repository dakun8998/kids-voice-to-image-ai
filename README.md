# 小画家AI - 儿童语音文字生图MVP

🎨 为3-8岁儿童打造的安全、有趣的AI画画工具

## ✨ 功能特性

### 🎤 语音创作
- 点击麦克风说出想法，最长录音10秒
- 智能语音转文字，支持中文识别
- 儿童友好的操作界面

### ✏️ 文字创作
- 简单的文字输入框
- 智能提示和引导
- 100字符限制，适合儿童表达

### 🖼️ 图片生成
- 基于fal-ai的高质量图片生成
- 自动优化为儿童友好风格
- 512x512高清图片输出
- 彩色进度条显示生成过程

### 🛡️ 安全保护
- 关键词黑名单过滤
- 智能内容安全检测
- NSFW内容拦截
- 家长指南和隐私政策

### 🎯 示例引导
- 3个精心设计的示例卡片
- 引导孩子发挥想象力
- 一键体验生成效果

## 🚀 快速开始

### 环境要求
- Node.js 18+
- Bun (推荐) 或 npm

### 安装依赖
```bash
cd kids-voice-to-image
bun install
```

### 配置API密钥
在 `.env.local` 文件中配置您的fal-ai API密钥：
```bash
FAL_API_KEY_STT=your_speech_to_text_api_key_here
FAL_API_KEY_IMG=your_image_generation_api_key_here
```

### 启动开发服务器
```bash
bun run dev
```

访问 http://localhost:3000 开始使用

## 🏗️ 技术架构

### 前端技术栈
- **Next.js 15** - React全栈框架
- **TypeScript** - 类型安全
- **TailwindCSS** - 原子化CSS
- **shadcn/ui** - 现代化UI组件库
- **Lucide React** - 图标库

### API集成
- **fal-ai/speech-to-text/turbo** - 语音转文字
- **fal-ai/hidream-i1-fast** - 文字转图片
- **MediaRecorder API** - 浏览器录音
- **Web Audio API** - 音频处理

### 安全机制
- 前端关键词过滤
- API层安全检查
- 图片内容安全验证
- 儿童隐私保护

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   │   ├── stt/          # 语音转文字API
│   │   └── img/          # 图片生成API
│   ├── parents/          # 家长指南页面
│   └── page.tsx          # 主页
├── components/            # React组件
│   ├── ui/               # shadcn/ui组件
│   ├── VoiceRecorder.tsx # 语音录制组件
│   ├── ImageGenerator.tsx# 图片生成组件
│   ├── ExampleCards.tsx  # 示例卡片组件
│   └── TextInput.tsx     # 文字输入组件
└── lib/
    ├── utils.ts          # 工具函数
    └── fal.ts            # fal-ai API封装
```

## 🎯 设计原则

### 儿童友好
- 大号按钮和触控区域
- 明亮柔和的色彩搭配
- 简单直观的操作流程
- 友好的错误提示信息

### 安全第一
- 内容过滤和安全检测
- 不存储儿童隐私数据
- 家长监督和指导功能
- 符合儿童隐私保护法规

### 教育价值
- 激发想象力和创造力
- 提升语言表达能力
- 培养艺术审美
- 增强科技认知

## 📊 核心指标

- **响应时间**: T1 首次访问到成功生成 ≤ 30秒
- **成功率**: 图片生成成功率 ≥ 95%
- **用户体验**: 目标NPS ≥ 40

## 🚧 后续计划

- [ ] 多语言支持
- [ ] 更多图片风格选择
- [ ] 作品收藏和分享功能
- [ ] 家长管理后台
- [ ] 移动端APP
- [ ] 语音指令优化

## 📞 联系我们

- **问题反馈**: feedback@kidsai.com
- **安全举报**: safety@kidsai.com
- **技术支持**: support@kidsai.com

## 📄 许可证

本项目采用 MIT 许可证。详情请查看 [LICENSE](LICENSE) 文件。

---

**为孩子们制作 ❤️ 安全、有趣、充满想象力的AI画画工具**
