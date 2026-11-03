# Coze Workflow Generator（Coze 工作流生成器）

一款 DSH（DeepSeek Harness）插件：覆盖 **49 个行业**的 Coze 工作流一键生成器，插件内容一目了然。

## 功能

- 输入框上方一个小圆图标按钮，点击展开面板（默认收起，不占空间）
- **49 张行业卡片**，支持搜索与分类筛选：
  - 零售贸易：电商客服、跨境电商、二手交易、奢侈品管家、数码选购、直播电商
  - 生活服务：旅行规划、美食菜谱、宠物养护、婚礼策划、家装设计、家政保洁、园艺花卉
  - 教育成长：K12 学科辅导、留学申请、音乐启蒙、职场成长
  - 专业服务：法律咨询、财税记账、保险规划、理财知识、购房顾问、买车用车、HR 助手、租房顾问、企业注册、贷款规划、退休养老规划、基金定投、保险理赔协助、企业财报分析、信用卡管理、股票知识科普、股票复盘分析、个股基本面速读
  - 医疗健康：健康顾问、心理陪伴、健身教练、养老照护、科学育儿、中医养生、营养配餐
  - 产业运营：编程开发、新媒体爆款、新闻解读、游戏上分、农技服务、物流管家、政务服务
- 点击任意行业，查看**纵向节点流程图**（彩色类型徽章：开始 / 大模型 / 插件 / 代码 / 条件 / 循环 / 知识库 / 结束）
- 底部实时生成 **工作流 YAML 设计稿**，支持一键复制或下载 `.yaml`，可直接在 Coze 工作流画布中按图搭建或作导入核对参考

## 安装（本地 DSH Profile）

```powershell
# 在 DSH Harness 会话中使用插件管理器安装
# target 指向本仓库目录的绝对路径
plugin_manager: install_bundle -> <repo path>\coze-flow-generator
```

要求：`dsh` Harness 环境（插件通过 `dsh.bundle.patch` 与 `dsh.client` 声明挂载点，渲染于 `conversation.input.dock` 插槽）。

## 目录结构

```
coze-flow-generator/
├── package.json        # 清单：bundle patch + client 模块声明
├── cordis.patch.yml    # Loader 插入补丁（插件行 coze-flow-generator）
├── index.js            # Host 侧（空实现，渲染由 Client 负责）
├── client.js           # Client 侧：全部界面、32 行业模板数据、YAML 生成
├── locale/zh.json      # 中文标题与描述
├── locale/en.json      # 英文标题与描述
└── icon.svg            # 插件图标（原创）
```

## 说明

- 生成的 YAML 为工作流**设计稿**（节点清单 + 连线），Coze 官方导入格式以其后台为准
- 界面文案为中文；行业内容可按需在 `client.js` 的 `WORKFLOWS` 数组中增删

## License

MIT
