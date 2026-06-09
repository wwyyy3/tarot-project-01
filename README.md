# 🔮 塔罗牌占卜 Web 应用

一个沉浸式的塔罗牌占卜 Web 应用，前端提供神秘的视觉体验，后端对接 DeepSeek AI 进行卡牌解读。项目基于 Spring Boot 3 + 原生前端技术，包含完整的 78 张塔罗牌数据。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端框架 | Spring Boot 3.2.5 (Java 17) |
| 构建工具 | Maven |
| 模板引擎 | Thymeleaf |
| 前端 | 原生 HTML + CSS + JavaScript |
| AI 引擎 | DeepSeek Chat API (`deepseek-chat`) |

---

## 项目结构

```
.
├── pom.xml                                    Maven 构建配置
├── src/main/java/com/tarot/
│   ├── TarotApplication.java                  Spring Boot 启动入口
│   ├── controller/
│   │   └── TarotController.java               REST API 控制器
│   ├── model/
│   │   └── TarotCard.java                     塔罗牌数据模型
│   └── service/
│       └── TarotService.java                  塔罗牌业务逻辑（含 78 张牌完整数据）
├── src/main/resources/
│   ├── static/
│   │   ├── css/style.css                      暗色神秘主题样式与动画
│   │   └── js/app.js                          前端交互逻辑（5 阶段流程）
│   └── templates/
│       └── index.html                         页面模板
├── target/                                    Maven 编译输出
├── .vscode/                                   VS Code 编辑器配置
├── .github/                                   GitHub Actions 工作流
└── README.md                                  本文档
```

---

## 打包分发

### 生成独立可执行的 JAR

```bash
mvn clean package -DskipTests
```

生成的 `target/tarot-card-draw-1.0.0.jar` 是一个 **Spring Boot fat JAR**，内嵌 Tomcat 服务器，包含全部依赖。对方只需安装 **JDK 17+**，双击或在命令行运行：

```bash
java -jar tarot-card-draw-1.0.0.jar
```

然后浏览器打开 `http://localhost:8080` 即可使用。

### 分发方式

1. **直接发送 JAR** — 把 `target/tarot-card-draw-1.0.0.jar` 发给对方
2. **GitHub Release** — 在仓库创建 Release，上传 JAR 作为附件，其他人下载后 `java -jar` 启动
3. **一起打包 JDK（可选）** — 如果对方没有 Java，可以用 `jpackage` 把 JRE 一起打进去，生成原生安装包（.exe / .dmg / .deb）

---

## 后端 API

| 方法 | 路径 | 说明 | 请求参数 |
|------|------|------|----------|
| GET | `/api/tarot/all-shuffled` | 返回 78 张被随机打乱并随机正/逆位的完整牌组 | — |
| GET | `/api/tarot/draw` | 抽取指定数量的卡牌 | `count`: 1–10（默认 1） |
| POST | `/api/tarot/interpret` | 调用 DeepSeek 解读选中卡牌 | `{ apiKey, question, cards[] }` |

### 数据模型 (TarotCard)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 唯一编号（0–77） |
| name | String | 中文名称 |
| nameEn | String | 英文名称 |
| arcana | String | `major`（大阿尔卡纳）/ `minor`（小阿尔卡纳） |
| suit | String | 牌组：`wands` / `cups` / `swords` / `pentacles`（大阿尔卡纳为 null） |
| keywords | String | 核心关键词 |
| meaning | String | 正位牌义 |
| reversedMeaning | String | 逆位牌义 |
| reversed | boolean | 是否为逆位（后端随机设定） |

### 卡牌数据

`TarotService` 硬编码了全部 78 张经典韦特塔罗牌：

- **22 张大阿尔卡纳（Major Arcana）**：愚人 ~ 世界（id 0–21）
- **56 张小阿尔卡纳（Minor Arcana）**：权杖、圣杯、宝剑、星币四组（id 22–77），每组含 Ace–10 + 侍从、骑士、王后、国王

---

## 前端流程（5 阶段）

```
阶段 1 [宝石展示]  ──4.5s──→  阶段 2 [思考提示]  ──点击"开始洗牌"──→
阶段 3 [扇形选牌]  ──确认──→  阶段 4 [输入提问]  ──"开始占卜"──→
阶段 5 [AI 解读]
```

1. **宝石展示** — 紫水晶、红宝石、蓝宝石浮动旋转动画，4.5 秒后自动过渡到下一阶段（点击宝石可跳过）。
2. **思考提示** — 提示用户在心中凝聚问题，点击"开始洗牌"按钮继续。
3. **扇形选牌** — 78 张牌以扇形展开，牌背为蓝色星盘图案。点击卡牌选中（最多 3 张），选中卡牌飞入顶部显示区并展示牌名/逆位标记，其余牌变暗淡化。支持重新洗牌和窗口自适应重排。
4. **输入提问** — 输入占卜问题与 DeepSeek API Key。API Key 输入框支持密码/明文切换。
5. **AI 解读** — 用 Markdown 展示 DeepSeek 生成的详细解读；底部"重新占卜"按钮重置全部状态回到阶段 1。

### 响应式设计

- 适配桌面 / 平板 / 手机三种断点（900px / 768px / 520px）
- 扇形布局参数（宽度、弧度、卡牌尺寸）随视口动态调整
- 窗口 resize 时自动重排扇形布局，保留已选卡牌状态

---

## 快速开始

### 前置要求

- JDK 17+
- Maven 3.6+

### 构建 & 运行

```bash
mvn clean package -DskipTests
mvn spring-boot:run
```

启动后访问 `http://localhost:8080`。

### 使用流程

1. 进入页面后等待宝石自动过渡，或点击宝石跳过
2. 点击"开始洗牌"，78 张牌以扇形展开
3. 点击牌背选中卡牌（最多 3 张），点击"确认选择"
4. 输入问题与 DeepSeek API Key，点击"开始占卜"
5. 等待 AI 解读，以 Markdown 格式查看结果
6. 点击"重新占卜"回到阶段 1

**提示**：如果没有 DeepSeek API Key，也可以仅体验 1–3 阶段的选牌交互。

---

## 设计要点

### 后端

- **78 张牌硬编码**在 `TarotService` 中，启动时通过 `initMajorArcana()` 和 `initMinorArcana()` 初始化
- 每次抽牌/洗牌时每张牌独立随机决定正/逆位
- DeepSeek 调用在服务端发起，用户自行输入 API Key，不持久化存储
- 解读请求使用结构化 Prompt 模板，包含每张牌的名称、正逆位、关键词和牌义，要求 DeepSeek 以 Markdown 格式输出

### 前端

- **无框架完全原生**：纯 CSS 动画 + 原生 JavaScript，零 NPM / 第三方库依赖
- **扇形布局**：通过 `getFanTransform()` 函数计算抛物线分布，每张牌沿弧线旋转以呈现立体感；选中牌通过 `getRowTransform()` 飞到顶部行
- **轻量 Markdown 渲染**：前端内置渲染器，支持 `#` 标题、`**` 加粗、`*` 斜体、`` ` `` 行内代码和 `-` 无序列表
- **后备机制**：如果后端 API 不可用，`generateFallbackCards()` 生成 78 张模拟数据保证 UI 可交互
- **API Key 安全**：输入框默认 `type=password`，眼睛图标切换可见性，不持久化存储

---

## 许可 & 声明

- 本项目为个人学习与娱乐用途
- 塔罗牌牌义基于经典韦特塔罗解读，仅供参考
- DeepSeek AI 解读由大模型生成，不代表任何占卜或决策建议
