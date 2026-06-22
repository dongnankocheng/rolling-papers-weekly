# ⚙️ 每周轧制论文更新 · Rolling Papers Weekly

一个自动汇总轧制领域最新研究论文的网页，按 **创新点** 与 **研究方向** 排序，覆盖 SCI、核心期刊、预印本等多源文献。

## 📂 文件结构

```
rolling_papers_weekly/
├── index.html      # 主页面（浏览器打开此文件）
├── style.css       # 界面样式
├── app.js          # 交互逻辑（筛选/搜索/排序）
├── papers.js       # ⭐ 论文数据库（每周更新此文件）
├── paper_template.json  # 单篇论文数据模板
└── README.md       # 本说明文件
```

## 🚀 快速使用

1. **双击 `index.html`** 即可在浏览器中打开网页。
2. 网页功能：
   - 🎯 **按方向筛选**：10 个轧制研究方向横向导航
   - 🏷️ **按来源筛选**：SCI / EI / 核心 / 预印本 / CSCD
   - 🔍 **关键词搜索**：标题、作者、期刊、创新点标签
   - 📊 **排序**：按创新性 / 按时间 / 按来源
   - ⭐ **创新评分**：每篇 1-10 分，彩色进度条可视化

## 📝 每周更新方法

### 第 1 步：检索论文

从以下数据库检索本周新发表的轧制相关论文：

| 来源 | 检索词建议 | 类型 |
|------|-----------|------|
| Web of Science | TS=("hot rolling" OR "cold rolling" OR "strip rolling") | SCI |
| Scopus | TITLE-ABS-KEY("rolling mill" OR "plate rolling") | SCI/EI |
| arXiv | rolling OR "metal forming" | 预印本 |
| 中国知网 | 轧制 / 轧机 / 板带 | 核心 |
| Engineering Village | "rolling process" | EI |

### 第 2 步：筛选 Top 10

- 每个方向保留 **创新性最强的 10 篇**
- 参考 `innovationScore`（1-10 分）评估创新点
- 保留 SCI、核心、预印本等各类来源

### 第 3 步：编辑 papers.js

打开 `papers.js`，在对应方向的 `PAPERS` 数组中添加/替换论文条目：

```javascript
{
  id: "strip-07",                    // 唯一ID：方向-序号
  title: "English Title Here",        // 英文标题
  titleCn: "中文标题",                 // 中文标题
  authors: "Zhang X., Li Y., et al.",// 作者
  journal: "Journal Name",           // 期刊
  sourceType: "SCI",                 // SCI / EI / 核心 / 预印本 / CSCD
  year: 2026, month: 6,              // 发表年月
  innovationScore: 8,                // 创新评分 1-10
  field: "strip",                    // 方向ID（见DIRECTIONS）
  innovationTags: ["标签1", "标签2"], // 创新点标签
  abstract: "创新点摘要描述...",      // 摘要
  doi: "10.xxxx/xxxx"                // DOI号
}
```

### 第 4 步：刷新页面

保存 `papers.js` 后，刷新浏览器即可看到更新。

## 📊 研究方向

| 方向 | ID | 说明 |
|------|-----|------|
| 🏭 板带轧制工艺 | strip | 热/冷轧带钢、板形控制 |
| 🔩 型线棒材轧制 | section | H型钢、线材、螺纹钢 |
| 🛢️ 管材轧制 | tube | 无缝管、焊管、皮尔格轧制 |
| 💻 轧制数值模拟 | simulation | FEM、多尺度、数字孪生 |
| ⚙️ 轧机设备与AGC控制 | equipment | 轧机、液压AGC、厚度控制 |
| 🔬 组织性能调控 | microstructure | 再结晶、相变、织构 |
| 💧 轧制润滑与摩擦 | lubrication | 润滑剂、摩擦、磨损 |
| 🧪 新合金轧制 | newalloy | 高熵合金、镁/钛/铝合金 |
| 🥪 复合/异质板轧制 | clad | 复合板、层状金属 |
| 🌱 绿色与智能轧制 | green | 节能减排、AI、低碳 |

## 💡 提示

- 当前为 **示例数据**，需替换为真实检索结果
- 示例共 51 篇，每方向 5-6 篇，建议补满每方向 10 篇
- DOI 链接自动跳转 doi.org 或 arxiv.org
- 网页支持移动端响应式布局
