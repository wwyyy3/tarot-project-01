# 塔罗牌占卜应用 — 全功能说明文档

> 一个基于 **Spring Boot + Thymeleaf + 原生 JavaScript** 的塔罗牌在线占卜 Web 应用，后端调用 **DeepSeek API** 提供 AI 解读。

---

## 目录

1. [项目概览](#1-项目概览)
2. [后端代码](#2-后端代码)
   - [TarotApplication.java — 启动入口](#21-tarotapplicationjava--启动入口)
   - [TarotCard.java — 卡牌数据模型](#22-tarotcardjava--卡牌数据模型)
   - [TarotService.java — 核心业务逻辑](#23-tarotservicejava--核心业务逻辑)
   - [TarotController.java — REST API 控制器](#24-tarotcontrollerjava--rest-api-控制器)
3. [前端代码](#3-前端代码)
   - [index.html — 页面结构](#31-indexhtml--页面结构)
   - [app.js — 交互逻辑](#32-appjs--交互逻辑)
   - [style.css — 视觉样式](#33-stylecss--视觉样式)
4. [POM 配置](#4-pomxml--maven-构建配置)
5. [完整流程说明](#5-完整流程说明)

---

## 1. 项目概览

| 层级 | 技术栈 |
|------|--------|
| **后端框架** | Spring Boot 3.2.5 + Java 17 |
| **模板引擎** | Thymeleaf |
| **AI 接口** | DeepSeek Chat API（`deepseek-chat` 模型） |
| **前端** | 原生 HTML / CSS / JavaScript（无构建工具） |
| **构建工具** | Maven |

**核心功能**：用户通过 5 个阶段的 UI 交互，从 78 张韦特塔罗牌中抽取卡牌，提出心中疑问，由 DeepSeek AI 按照「镜鉴型塔罗占卜师」角色进行四步深度占卜解读。

**5 个阶段**：
1. **宝石展示** — 开屏动画，展示紫水晶、红宝石、蓝宝石
2. **思考提示** — 提示用户默念问题，点击开始洗牌
3. **扇形展牌** — 78 张牌以扇形排列，用户选出 3 张
4. **输入提问** — 用户输入问题 + DeepSeek API Key
5. **AI 解读** — 调用 AI 返回 Markdown 解读结果

---

## 2. 后端代码

### 2.1 `TarotApplication.java` — 启动入口

**文件路径**：`src/main/java/com/tarot/TarotApplication.java`

**包名**：`com.tarot`

**类定义**：

```java
@SpringBootApplication
public class TarotApplication
```

#### 注解说明

| 注解 | 作用 |
|------|------|
| `@SpringBootApplication` | Spring Boot 核心注解，等价于 `@Configuration` + `@EnableAutoConfiguration` + `@ComponentScan`。自动扫描 `com.tarot` 包下的所有组件，启用自动配置。 |

#### 方法 `main(String[] args)`

| 属性 | 说明 |
|------|------|
| **作用** | Java 应用入口，启动 Spring Boot 内嵌 Tomcat 服务器 |
| **返回值** | `void` |
| **逻辑** | 调用 `SpringApplication.run(TarotApplication.class, args)` 启动整个 Spring 上下文 |

#### 方法 `openBrowser()` — 自动打开浏览器

| 属性 | 说明 |
|------|------|
| **作用** | 应用启动后自动在默认浏览器中打开 `http://localhost:8080` |
| **返回值** | `CommandLineRunner`（函数式接口，启动后执行） |
| **注解** | `@Bean` — 注册为 Spring Bean，容器启动后自动执行 |

**内部逻辑**：

1. **延迟 1500ms**：`Thread.sleep(1500)` — 等待服务器完全启动
2. **获取端口**：从系统属性 `server.port` 读取端口，默认 `8080`
3. **跨平台浏览器打开**：
   - **Windows**：`cmd /c start http://localhost:8080`
   - **macOS**：`open http://localhost:8080`
   - **Linux**：`xdg-open http://localhost:8080`
4. **异常处理**：捕获异常但不报错，用户可手动打开浏览器

---

### 2.2 `TarotCard.java` — 卡牌数据模型

**文件路径**：`src/main/java/com/tarot/model/TarotCard.java`

**包名**：`com.tarot.model`

**类名**：`TarotCard`

#### 字段（属性）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `int` | 卡牌编号（0–77，0=愚人...21=世界，22–77=小阿卡那） |
| `name` | `String` | 中文名称（如"愚人"、"权杖王牌"） |
| `nameEn` | `String` | 英文名称（如"The Fool"、"Ace of Wands"） |
| `arcana` | `String` | 卡牌类别：`"major"`（大阿卡那 22 张）或 `"minor"`（小阿卡那 56 张） |
| `suit` | `String` | 花色（仅小阿卡那）：`"wands"` 权杖 / `"cups"` 圣杯 / `"swords"` 宝剑 / `"pentacles"` 星币；大阿卡那为 `null` |
| `keywords` | `String` | 关键词，以中文顿号分隔（如"开始、冒险、天真"） |
| `meaning` | `String` | 正位牌义解读文本 |
| `reversedMeaning` | `String` | 逆位牌义解读文本 |
| `reversed` | `boolean` | 本次抽取中是否为逆位（运行时动态设置，默认 `false`） |

#### 构造函数

| 构造函数 | 说明 |
|----------|------|
| `TarotCard()` | **无参构造**：用于 JSON 反序列化等场景 |
| `TarotCard(int id, String name, String nameEn, String arcana, String suit, String keywords, String meaning, String reversedMeaning)` | **全参构造**：初始化所有卡片数据，`reversed` 默认为 `false` |

#### Getter / Setter 方法（共 14 个）

每个字段均有对应的 `get` 和 `set` 方法，遵循 JavaBean 规范。唯一特殊的是 `reversed` 字段的 getter 名为 `isReversed()`（`boolean` 类型的标准命名）。

---

### 2.3 `TarotService.java` — 核心业务逻辑

**文件路径**：`src/main/java/com/tarot/service/TarotService.java`

**包名**：`com.tarot.service`

**注解**：`@Service` — 标记为 Spring 服务层 Bean，单例模式

**核心数据**：`private final List<TarotCard> allCards = new ArrayList<>()` — 存储全部 78 张卡牌的静态数据

---

#### 构造函数 `TarotService()`

| 属性 | 说明 |
|------|------|
| **调用时机** | Spring 容器初始化该 Bean 时执行 |
| **逻辑** | 依次调用 `initMajorArcana()` → `initMinorArcana()`，将 78 张牌加载到 `allCards` 列表 |

---

#### 方法 `getAllShuffledCards()`

| 属性 | 说明 |
|------|------|
| **作用** | 获取全部 78 张牌，每张随机赋予正/逆位，并随机打乱顺序 |
| **返回值** | `List<TarotCard>` — 洗牌后的完整卡牌列表 |
| **访问** | `public` |

**逻辑步骤**：
1. 从 `allCards` 复制一份新列表 `shuffled`
2. `Collections.shuffle(shuffled)` — 随机打乱顺序
3. 遍历每张牌，`rand.nextBoolean()` 随机设为正位或逆位
4. 返回打乱后的列表

---

#### 方法 `initMajorArcana()`（私有）

| 属性 | 说明 |
|------|------|
| **作用** | 初始化 22 张大阿卡那牌（0–21） |
| **返回值** | `void` |
| **访问** | `private` |

**卡牌列表（按编号顺序）**：

| ID | 中文名 | 英文名 | 关键词 |
|----|--------|--------|--------|
| 0 | 愚人 | The Fool | 开始、冒险、天真 |
| 1 | 魔术师 | The Magician | 创造力、技能、自信 |
| 2 | 女祭司 | The High Priestess | 直觉、潜意识、神秘 |
| 3 | 女皇 | The Empress | 丰饶、自然、母爱 |
| 4 | 皇帝 | The Emperor | 权威、稳定、领导力 |
| 5 | 教皇 | The Hierophant | 传统、信仰、指导 |
| 6 | 恋人 | The Lovers | 爱情、选择、和谐 |
| 7 | 战车 | The Chariot | 意志力、胜利、征服 |
| 8 | 力量 | Strength | 勇气、内在力量、耐心 |
| 9 | 隐士 | The Hermit | 内省、智慧、独处 |
| 10 | 命运之轮 | Wheel of Fortune | 变化、循环、命运 |
| 11 | 正义 | Justice | 公正、真相、法律 |
| 12 | 倒吊人 | The Hanged Man | 牺牲、放下、新视角 |
| 13 | 死神 | Death | 结束、转变、新生 |
| 14 | 节制 | Temperance | 平衡、调和、适度 |
| 15 | 恶魔 | The Devil | 束缚、物质、欲望 |
| 16 | 高塔 | The Tower | 剧变、崩塌、觉醒 |
| 17 | 星星 | The Star | 希望、灵感、宁静 |
| 18 | 月亮 | The Moon | 恐惧、幻觉、潜意识 |
| 19 | 太阳 | The Sun | 喜悦、成功、活力 |
| 20 | 审判 | Judgement | 重生、觉醒、召唤 |
| 21 | 世界 | The World | 完成、圆满、旅行 |

---

#### 方法 `initMinorArcana()`（私有）

| 属性 | 说明 |
|------|------|
| **作用** | 初始化 56 张小阿卡那牌（22–77），按四个花色分组 |
| **返回值** | `void` |
| **访问** | `private` |

**花色分布（各 14 张：Ace + 2–10 + Page + Knight + Queen + King）**：

| ID 范围 | 花色 | 英文 | 元素含义 |
|---------|------|------|----------|
| 22–35 | 权杖 | Wands | 火 — 行动、创意、事业 |
| 36–49 | 圣杯 | Cups | 水 — 情感、关系、直觉 |
| 50–63 | 宝剑 | Swords | 风 — 思维、冲突、真理 |
| 64–77 | 星币 | Pentacles | 土 — 财富、健康、实践 |

**宫廷牌结构（每个花色 4 张）**：
- **侍从（Page）**：探索、学习、新消息
- **骑士（Knight）**：行动、追求、极端能量
- **王后（Queen）**：内在成熟、关怀、 nurturing
- **国王（King）**：外在权威、掌控、领导

---

#### 方法 `drawCards(int count)`

| 属性 | 说明 |
|------|------|
| **作用** | 从 78 张牌中随机抽取指定数量的卡牌 |
| **参数** | `count` — 抽取数量（合法范围 1–78） |
| **返回值** | `List<TarotCard>` — 抽取到的卡牌列表 |
| **访问** | `public` |

**逻辑步骤**：
1. **边界保护**：`count` 超出 [1, 78] 范围时重置为 1
2. 复制 `allCards` 并 `Collections.shuffle()` 随机打乱
3. 取前 `count` 张（`shuffled.subList(0, count)`）
4. 每张牌随机设正/逆位（`rand.nextBoolean()`）
5. 返回结果

---

#### 方法 `drawThreeCardSpread()`

| 属性 | 说明 |
|------|------|
| **作用** | 三牌阵占卜：按「过去 → 现在 → 未来」布局抽取 3 张牌 |
| **返回值** | `Map<String, Object>`，含 `positions`（位置名称列表）和 `cards`（卡牌列表） |

**返回结构**：
```json
{
  "positions": ["过去", "现在", "未来"],
  "cards": [ /* 3 个 TarotCard 对象 */ ]
}
```

---

#### 方法 `drawDailyCard()`

| 属性 | 说明 |
|------|------|
| **作用** | 每日一牌：随机抽取 1 张牌 |
| **返回值** | `TarotCard` — 单张卡牌 |
| **实现** | 直接调用 `drawCards(1).get(0)` |

---

### 2.4 `TarotController.java` — REST API 控制器

**文件路径**：`src/main/java/com/tarot/controller/TarotController.java`

**包名**：`com.tarot.controller`

**注解**：

| 注解 | 作用 |
|------|------|
| `@RestController` | 标记为 REST 控制器，所有方法返回值自动转为 JSON |
| `@RequestMapping("/api/tarot")` | 所有接口的 URL 前缀为 `/api/tarot` |

**依赖注入**：`@Autowired private TarotService tarotService` — 注入业务逻辑层

---

#### 方法 `getAllShuffled()` — `GET /api/tarot/all-shuffled`

| 属性 | 说明 |
|------|------|
| **作用** | 获取全部 78 张打乱顺序的卡牌 |
| **注解** | `@GetMapping("/all-shuffled")` |
| **返回值** | `Map<String, Object>` |

**返回结构**：
```json
{
  "count": 78,
  "cards": [ /* 78 个 TarotCard 对象，每个包含正逆位信息 */ ]
}
```

---

#### 方法 `draw(int count)` — `GET /api/tarot/draw`

| 属性 | 说明 |
|------|------|
| **作用** | 随机抽取卡牌 |
| **注解** | `@GetMapping("/draw")` |
| **参数** | `@RequestParam(defaultValue = "1") int count` — 抽取数量，默认 1，合法范围 1–10 |
| **返回值** | `Map<String, Object>` |

**边界处理**：`Math.min(Math.max(count, 1), 10)` 将 count 夹在 [1, 10] 区间，防止一次抽太多或负数

---

#### 方法 `interpret(Map<String, Object> request)` — `POST /api/tarot/interpret`

| 属性 | 说明 |
|------|------|
| **作用** | 调用 DeepSeek AI 对抽到的牌进行深度占卜解读 |
| **注解** | `@PostMapping("/interpret")` |
| **请求体** | JSON，包含 `apiKey`、`question`、`cards` 三个字段 |
| **返回值** | `Map<String, Object>` — 成功时含 `deepseek` 原始响应，失败时含 `error` |

**请求体结构**：
```json
{
  "apiKey": "sk-xxxx",
  "question": "我最近的事业发展会如何？",
  "cards": [
    { "name": "恋人", "nameEn": "The Lovers", "keywords": "...", "meaning": "...", "reversedMeaning": "...", "reversed": false },
    ...
  ]
}
```

**内部逻辑（分 4 个部分）**：

##### A. 构建 Prompt（48 行 System Prompt）

以「**镜鉴型塔罗占卜师**」角色为核心，构建严格的四步解读流程：

| Prompt 章节 | 内容 |
|-------------|------|
| **Role** | 顶级神秘学导师与直觉塔罗占卜师（镜鉴型），精通 78 张韦特塔罗牌、卡巴拉生命之树、荣格心理学 |
| **Tone** | 清冷、理智、客观，拒绝糖衣炮弹，好坏并陈 |
| **Workflow 1: 全景俯瞰** | 用中立语言定调牌组的真实能量状态 |
| **Workflow 2: 牌面解构** | 逐牌深解，好牌提醒傲慢，坏牌直指危机 |
| **Workflow 3: 灵魂刀刃** | 揭露用户最不想面对的真相和盲点 |
| **Workflow 4: 破局路径** | 给出 3 条务实可落地的行动建议 |
| **Constraints** | 严禁曲解牌意、拒绝粉饰太平 |

##### B. 构建 API 请求

| 步骤 | 说明 |
|------|------|
| 1 | 使用 `java.net.http.HttpClient` 发送 HTTP 请求 |
| 2 | 使用 Jackson `ObjectMapper` 构建 JSON 请求体 |
| 3 | 请求 URL：`https://api.deepseek.com/chat/completions` |
| 4 | 模型：`deepseek-chat`，温度：`0.8` |
| 5 | System Message 设定角色，User Message 放入完整 Prompt |
| 6 | Header 中 `Authorization: Bearer {apiKey}` |

##### C. 处理响应

| 状态码 | 处理方式 |
|--------|----------|
| **200** | 成功，返回 `{ success: true, deepseek: "<原始JSON>" }` |
| **非 200** | 失败，尝试解析 `error` 字段，否则返回状态码错误 |

##### D. 错误处理

外层 `try-catch` 捕获网络/IO 异常，返回 `{ success: false, error: "异常消息" }`

---

## 3. 前端代码

### 3.1 `index.html` — 页面结构

**文件路径**：`src/main/resources/templates/index.html`

**模板引擎**：Thymeleaf（Spring Boot 默认解析 `/templates/` 下的 HTML）

**页面构成**：一个 `.tarot-container` 容器，内含 5 个阶段区域 + 2 个背景层：

```html
<div class="tarot-container">
    <div class="stars"></div>      <!-- 星空背景 -->
    <div class="nebula"></div>     <!-- 星云背景 -->

    <!-- 阶段 1: 宝石展示 -->
    <div class="gem-stage" id="gemStage">
        紫水晶 | 红宝石 | 蓝宝石
    </div>

    <!-- 阶段 2: 思考提示 -->
    <div class="prompt-stage hidden" id="promptStage">
        提示文字 + "开始洗牌"按钮
    </div>

    <!-- 阶段 3: 扇形展牌 -->
    <div class="fan-stage hidden" id="fanStage">
        选中行 + 扇形容器 + 操作按钮
    </div>

    <!-- 阶段 4: 输入提问 -->
    <div class="question-stage hidden" id="questionStage">
        问题输入框 + API Key 输入框 + 提交按钮
    </div>

    <!-- 阶段 5: AI 解读 -->
    <div class="answer-stage hidden" id="answerStage">
        加载动画 + 解读内容 + 重新占卜按钮
    </div>
</div>
```

**引用资源**：
- CSS：`<link rel="stylesheet" href="/css/style.css">`
- JS：`<script src="/js/app.js">`（在 `</body>` 前加载）

---

### 3.2 `app.js` — 交互逻辑

**文件路径**：`src/main/resources/static/js/app.js`

---

#### 全局状态管理

| 变量 | 类型 | 说明 |
|------|------|------|
| `Stage` | 枚举对象 | 定义 5 个阶段常量：`GEMS`、`PROMPT`、`FAN`、`QUESTION`、`ANSWER` |
| `currentStage` | `string` | 当前所处阶段 |
| `shuffledCards` | `Array` | 后端返回的全部打乱后的卡牌 |
| `selectedIndices` | `Set` | 用户已选中卡牌的索引集合（最大 3） |
| `pickOrder` | `Array` | 选中顺序列表 |
| `selectedCards` | `Array` | 选中的卡牌数据（TaroCard 对象） |

---

#### DOM 引用（约 16 个元素）

| 变量名 | 元素 ID | 用途 |
|--------|---------|------|
| `gemStage` | `gemStage` | 宝石展示阶段容器 |
| `promptStage` | `promptStage` | 思考提示阶段容器 |
| `fanStage` | `fanStage` | 扇形选牌阶段容器 |
| `questionStage` | `questionStage` | 问题输入阶段容器 |
| `answerStage` | `answerStage` | AI 解读阶段容器 |
| `shuffleStartBtn` | `shuffleStartBtn` | "开始洗牌"按钮 |
| `fanContainer` | `fanContainer` | 扇形容器 DOM |
| `fanCounter` | `fanCounter` | 已选张数计数器 |
| `reshuffleBtn` | `reshuffleBtn` | "重新洗牌"按钮 |
| `confirmBtn` | `confirmBtn` | "确认选择"按钮 |
| `questionInput` | `questionInput` | 问题输入框 |
| `apiKeyInput` | `apiKeyInput` | API Key 输入框 |
| `askBtn` | `askBtn` | "开始占卜"按钮 |
| `answerLoading` | `answerLoading` | 加载动画容器 |
| `answerContent` | `answerContent` | 解读内容容器 |
| `resetBtn` | `resetBtn` | "重新占卜"按钮 |

---

#### 功能 1：API Key 可见性切换

**触发**：点击 👁 图标按钮（`apiKeyEye`）

**逻辑**：
- 切换 `apiKeyInput.type` 在 `password` ↔ `text` 之间
- 图标在 👁（隐藏态）和 🙈（显示态）之间切换

---

#### 功能 2：宝石阶段 → 思考提示阶段

**自动切换**：`setTimeout(4500ms)` — 4.5 秒后自动从宝石阶段切换到思考提示阶段

**手动跳过**：点击宝石区域（`gemStage.addEventListener('click')`）立即跳过

---

#### 功能 3：`loadShuffledCards()` — 异步获取洗牌数据

| 属性 | 说明 |
|------|------|
| **作用** | 调用 `GET /api/tarot/all-shuffled` 获取全部卡牌，失败时调用 `generateFallbackCards()` 生成降级数据 |
| **返回值** | `async` — 返回 Promise |
| **副作用** | 更新 `shuffledCards`，调用 `renderFan()` 重新渲染扇形 |

---

#### 功能 4：`renderFan(cards)` — 渲染扇形卡牌布局

| 属性 | 说明 |
|------|------|
| **参数** | `cards` — 卡牌数据数组（通常为 78 张） |
| **作用** | 清空容器，根据窗口尺寸计算扇形参数，为每张牌创建 DOM 元素并定位 |

**响应式参数计算**：

| 屏幕尺寸 | 扇形角度 | 扇形半径 | 卡牌宽度 | 行间距 |
|----------|----------|----------|----------|--------|
| ≤520px（超小屏） | 100° | 280 × 高度比例 | 36px | 55 × 高度比例 |
| ≤768px（平板） | 110° | 340 × 高度比例 | 48px | 72 × 高度比例 |
| >768px（桌面） | 120° | min(vw×0.38, 460×高度比例) | 62px | 90 × 高度比例 |

**卡牌 DOM 结构**：
```html
<div class="fan-card" data-index="0" style="transform: ...">
    <div class="fan-card-back"></div>  <!-- 蓝色星盘卡背 -->
</div>
```

每张牌入场时通过 `requestAnimationFrame` 添加 `entered` 类，触发 CSS transition 动画。

---

#### 功能 5：`getFanTransform(index, total)` — 扇形坐标计算

| 属性 | 说明 |
|------|------|
| **参数** | `index` — 卡牌在列表中的索引，`total` — 卡牌总数 |
| **返回值** | `{ transform, angle, x, y }` |

**数学原理**：
1. `t = (index / (total - 1)) * 2 - 1` — 将索引映射到 [-1, 1] 区间
2. `angle = t * (FAN_ARC / 2)` — 计算该牌在扇形中的偏转角度
3. `xOffset = FAN_RADIUS * sin(angle)` — 水平偏移
4. `yOffset = FAN_RADIUS * cos(angle)` — 垂直偏移（cos 让底部牌近、两侧牌远）
5. 返回 CSS `transform` 字符串：`translateX(...) translateY(...) rotate(...)`

---

#### 功能 6：`getRowTransform(selIdx, totalSelected)` — 选中行坐标计算

| 属性 | 说明 |
|------|------|
| **作用** | 计算选中卡牌在顶部行中的水平排列位置 |
| **返回值** | CSS `transform` 字符串 |

**逻辑**：以卡片间距 `ROW_GAP`（默认 90px）水平等距排列，总宽度居中。

---

#### 功能 7：`updateFanLayout()` — 更新扇形布局

| 属性 | 说明 |
|------|------|
| **作用** | 根据用户的选择状态，动态更新每张牌的位置和样式 |
| **逻辑** | |
| | • 已选中的牌：从扇形移动到顶部行（`getRowTransform`） |
| | • 未选中的牌：保持在扇形位置（`getFanTransform`） |
| | • 拥有 `≥3` 张选择后，未选中牌添加 `.dimmed` 类（变暗） |

---

#### 功能 8：`toggleCardSelection(index, el)` — 切换卡牌选中状态

| 属性 | 说明 |
|------|------|
| **参数** | `index` — 卡牌索引，`el` — 卡牌 DOM 元素 |
| **作用** | 选中/取消选中卡牌，最多选 3 张 |

**逻辑**：
- 已选中 → 从 `selectedIndices` 移除，从 `pickOrder` 移除
- 未选中 + 总数 < 3 → 加入 `selectedIndices` 和 `pickOrder`
- 调用 `updateFanLayout()` + `updateSelectionUI()` 更新界面

---

#### 功能 9：`updateSelectionUI()` — 更新选择 UI

| 属性 | 说明 |
|------|------|
| **作用** | 更新计数器文字（"已选 X / 3 张"）和确认按钮状态 |
| **逻辑** | `confirmBtn.disabled = (count === 0)`，清空顶部行卡牌占位 |

---

#### 功能 10：「确认选择」→ 进入提问阶段

**触发**：点击「确认选择」按钮

**逻辑**：
1. 检查是否有选中卡牌（`selectedCards.length > 0`）
2. 隐藏扇形阶段，显示提问阶段
3. 状态切换到 `Stage.QUESTION`

---

#### 功能 11：「返回重选」按钮

**触发**：点击「← 返回重选」

**逻辑**：隐藏提问阶段，回到扇形阶段，状态切换到 `Stage.FAN`（保留之前的选择状态）

---

#### 功能 12：「开始占卜」→ 提交解读请求（核心异步逻辑）

**触发**：点击「开始占卜」按钮

**前置校验**：
1. 问题不能为空 → 红框提示 1.5 秒
2. API Key 不能为空 → 红框提示 1.5 秒
3. **API Key 清洗**：`apiKey.replace(/[^\x00-\x7F]/g, '')` — 剔除所有非 ASCII 字符（因为 HTTP Header 仅支持 ISO-8859-1）

**核心流程**：

```
用户点击 → 构建请求 → POST /api/tarot/interpret
                        ↓
              （前端同时运行两个计时器）
                        ↓
         ┌──────────────┴──────────────┐
         │  轮播安抚文字 (每 2.5s)       │
         │  "正在链接宇宙能量..."        │
         │  "塔罗牌正在排列中..."        │
         │  "感应你的能量场..."          │
         │  "解读星辰的指引..."          │
         │  "命运之轮正在转动..."        │
         └──────────────┴──────────────┘
                        ↓
         API 返回 + 最小加载时间 ≥3 秒
                        ↓
         解析 response → Markdown 渲染
```

**关键设计点**：
- **最小加载时间**：`MIN_LOADING_MS = 3000` — 即使 API 秒回，也会等待至少 3 秒，确保轮播文字和加载动画有足够展示时间
- **API Key 清洗**：防止用户从网页粘贴时带入全角字符或不可见字符
- **双计时器并行**：轮播计时器 + API 请求同时进行

**错误处理**：
- 网络错误 → 显示"网络错误：{msg}"
- API 错误 → 显示 `data.error` 内容
- JSON 解析错误 → 显示"解读完成，但返回格式异常。请检查 API 密钥。"

---

#### 功能 13：Markdown 渲染引擎

| 函数 | 作用 |
|------|------|
| `escapeHtml(text)` | HTML 实体转义（`& < > " '`） |
| `renderInlineMarkdown(text)` | 行内渲染：`` `code` `` → `<code>`，`**粗体**` → `<strong>`，`*斜体*` → `<em>` |
| `renderMarkdown(markdown)` | **主渲染函数**：逐行解析，支持标题（`#` – `####`）、无序列表（`- ` / `* `）、段落 |

**渲染逻辑**（逐行状态机）：
1. 空行 → 关闭当前列表
2. 匹配 `#{1,4}` → 输出 `<h2>`–`<h5>`（h1 留给页面大标题，故 `+1`）
3. 匹配 `- ` 或 `* ` → 输出 `<li>`，自动包裹 `<ul>`
4. 其他 → 输出 `<p>`

---

#### 功能 14：`renderSelectedCardsReview(cards)` — 渲染牌面回顾卡片

| 属性 | 说明 |
|------|------|
| **作用** | 在解读页面上方显示用户所选卡牌名称和正/逆位标记 |
| **输出** | 每张牌生成一个 `.review-card`，包含名称和可选的红色"逆位"标记 |

---

#### 功能 15：「重新占卜」— 全部重置

**触发**：点击「重新占卜」按钮

**重置内容**：
- 清空所有选择状态（`selectedIndices`、`pickOrder`、`selectedCards`、`shuffledCards`）
- 清空输入框内容
- 回到宝石展示阶段
- 重新启动 4.5 秒自动跳转计时器

---

#### 功能 16：`generateFallbackCards()` — 降级卡牌数据

| 属性 | 说明 |
|------|------|
| **触发** | 当后端 API 不可用时（网络错误） |
| **作用** | 在前端生成 78 张基础卡牌数据，保证用户仍可进行交互 |

**生成规则**：将 22 张大阿卡那名称循环 3.5 次，填充为 78 张，附加随机正逆位。

---

#### 功能 17：窗口 resize 自适应

**触发**：浏览器窗口大小变化

**逻辑**：防抖 300ms 后重新计算扇形参数、重新渲染扇形（保留选择状态）。

---

### 3.3 `style.css` — 视觉样式

**文件路径**：`src/main/resources/static/css/style.css`

---

#### 全局样式

| 选择器 / 规则 | 说明 |
|---------------|------|
| `* { margin:0; padding:0; box-sizing:border-box }` | CSS 重置 |
| `body` | 暗色背景 `#0a0a12`，宋体/衬线字体，`overflow: hidden` 禁止滚动 |
| `.tarot-container` | 最大宽度 1200px 居中，高度撑满视口，Flexbox 垂直居中布局 |

---

#### 星空背景动画

| 元素 | 说明 |
|------|------|
| `.stars` | 固定定位，15 个 `radial-gradient` 模拟随机星星，200×200px 重复背景 |
| `@keyframes twinkle` | 星星透明度在 0.6 ↔ 1 之间循环，周期 4s |
| `.nebula` | 三层紫色/深紫色的椭圆渐变模拟星云，固定定位 |

---

#### 通用工具类

| 类名 | 说明 |
|------|------|
| `.hidden` | `display: none !important` |
| `.stage` | `z-index: 1` 置于背景之上 |
| `@keyframes fadeIn` | 淡入 + 上移 10px |
| `@keyframes fadeOut` | 淡出 + 上移 10px |

---

#### 阶段 1：宝石展示样式

| 选择器 | 说明 |
|--------|------|
| `.gem-stage` | Flex 居中，淡入动画 1.2s |
| `.gems-wrapper` | 三颗宝石水平排列，间距 80px |
| `.gem` | 宽 140 × 高 200，垂直排列（形状 + 光晕 + 标签） |
| `.gem-shape` | 80×100px，圆角切削面，`gemFloat` 浮动动画 3s |
| `.gem-glow` | 120×120px 圆形模糊光晕，`gemPulse` 脉冲动画 2s |
| `.gem-label` | 下方标签，0.9rem，浮动动画（延迟 -1.5s 错峰） |
| `.gem-amethyst` | 紫水晶：紫色渐变 + 八边形 `clip-path` + 紫色光晕 |
| `.gem-ruby` | 红宝石：红色渐变 + 六边形 `clip-path` + 红色光晕 |
| `.gem-sapphire` | 蓝宝石：蓝色渐变 + 六边形 `clip-path` + 蓝色光晕 |

**关键动画**：
- `@keyframes gemFloat`：上下浮动 ±10px + 轻微旋转 ±2°
- `@keyframes gemPulse`：光晕缩放 0.8↔1.2 + 透明度 0.3↔0.6

---

#### 阶段 2：思考提示样式

| 选择器 | 说明 |
|--------|------|
| `.prompt-stage` | 全屏固定定位，半透明暗色遮罩 + 毛玻璃 `backdrop-filter: blur(8px)` |
| `.prompt-ornament` | 装饰符 "✦ ✦ ✦"，金色，脉冲动画 |
| `.prompt-text` | 主文字 2.2rem，"思考提问并默念"，发光 `text-shadow` |
| `.prompt-sub` | 副文字 1rem，灰色 |
| `.shuffle-start-btn` | 金色渐变按钮，圆角 40px，悬停上浮 3px + 阴影增强 |

---

#### 阶段 3：扇形展牌样式

**卡片背面设计**（`.fan-card-back`）：
- 深蓝色背景 `#0d2038`
- 20 个 `radial-gradient` 模拟星光点阵
- 中央 "✦ 🌕 ✦" 装饰文字

**交互状态**：

| 状态 | 效果 |
|------|------|
| 默认 | 蓝色边框 `#2a5070`，微弱阴影 |
| **悬停** | 金色边框 `#d4af7a`，金色光晕阴影（18px + 40px 双层），星星变金色 |
| **选中** | 金色边框 + 更强阴影，中央改为大号金色 "✦" |
| **未选中（有 3 张选中后）** | 亮度降至 45%，饱和度降至 40%，透明度 70% |

**入场动画**：`.fan-card.entered` — 使用弹性缓出 `cubic-bezier(0.34, 1.56, 0.64, 1)`，0.55s

**选中行卡牌**：`cardLand` 关键帧动画 — 从上方 40px 弹入（带缩放 0.8→1）

---

#### 阶段 4：提问输入样式

| 选择器 | 说明 |
|--------|------|
| `.question-stage` | 最大宽度 600px，淡入动画 |
| `.question-box` | 毛玻璃半透卡片，圆角 16px |
| `.question-input` | 深色半透背景，金色聚焦边框 + 光晕 |
| `.api-key-input` | 密码框，带右侧眼睛图标按钮 |
| `.api-key-eye` | 绝对定位在输入框右侧，悬停变金色 |
| `.ask-btn` | 金色渐变按钮，全宽，带 🔮 图标 |
| `.back-btn` | 半透明边框按钮，返回选牌 |

---

#### 阶段 5：AI 解读结果样式

| 选择器 | 说明 |
|--------|------|
| `.answer-stage` | 最大宽度 700px，Flex 垂直布局，内容区可滚动 |
| `.answer-section` | 毛玻璃半透卡片 |
| `.answer-question` | 左侧金色竖线引用样式，显示用户问题 |
| `.answer-loading` | 加载区：旋转圆圈 + 轮播文字 |
| `.loading-spinner` | 40px 圆环，金色 3px 边框 + 顶部亮金色，无限旋转 |
| `.loading-msg` | 绝对定位轮播文字，淡入淡出过渡 0.6s |
| `.loading-msg.active` | 当前消息可见 + 脉冲动画 |
| `.answer-content` | 解读结果区，支持滚动，格式化 Markdown 渲染后的 h2/h3/h4/p/ul/li/em/strong/code |
| `.reset-btn` | 半透明按钮，重新占卜 |
| `.review-card` | 48×72px 小卡片，展示已选牌名和逆位标记 |

---

#### 响应式断点

| 断点 | 适配内容 |
|------|----------|
| **≤900px** | 宝石间距减少至 40px |
| **≤768px** | 宝石缩小、按钮缩小、扇形卡牌 48×74px、内容区 padding 减少 |
| **≤520px** | 宝石进一步缩小（48×64px）、扇形卡牌 36×56px、3px 圆角 |

---

## 4. `pom.xml` — Maven 构建配置

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **parent** | `spring-boot-starter-parent:3.2.5` | Spring Boot 3.2.5 父 POM，管理依赖版本 |
| **groupId** | `com.tarot` | 组织标识 |
| **artifactId** | `tarot-card-draw` | 项目标识 |
| **version** | `1.0.0` | 版本号 |
| **java.version** | `17` | Java 17 编译目标 |

**依赖**：

| 依赖 | 作用 |
|------|------|
| `spring-boot-starter-web` | 内嵌 Tomcat + Spring MVC（REST API + 静态资源） |
| `spring-boot-starter-thymeleaf` | Thymeleaf 模板引擎，渲染 `/templates/` 下的 HTML |
| `spring-boot-devtools` | 开发热重载工具（仅在开发时启用，打包时排除） |

---

## 5. 完整流程说明

```
┌─────────────────────────────────────────────────────────────┐
│  用户访问 http://localhost:8080                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────── 阶段 1: 宝石展示（4.5秒 / 点击跳过）──────────┐
│  • 星空背景 + 星云                                          │
│  • 紫水晶 / 红宝石 / 蓝宝石 浮动动画                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────── 阶段 2: 思考提示 ───────────────────────────┐
│  • "思考提问并默念"                                        │
│  • 点击「开始洗牌」→                                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────── 阶段 3: 扇形展牌 ───────────────────────────┐
│  前端: GET /api/tarot/all-shuffled                         │
│  后端: TarotService.getAllShuffledCards()                   │
│       → 78张牌随机打乱 + 随机正逆位                          │
│       → 返回 JSON                                           │
│  前端: 以扇形布局渲染78张牌                                  │
│  用户: 点击选出3张 → 飞到顶部行                              │
│       → 点击「确认选择」                                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────── 阶段 4: 输入提问 ───────────────────────────┐
│  用户输入问题 + DeepSeek API Key                           │
│       → 点击「开始占卜」                                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────── 阶段 5: AI 解读 ────────────────────────────┐
│  前端: POST /api/tarot/interpret                           │
│       { apiKey, question, cards[] }                        │
│                                                            │
│  后端: TarotController.interpret()                          │
│       → 构建"镜鉴型占卜师"四步解读 Prompt                   │
│       → HttpClient → DeepSeek API                          │
│       ← AI 返回 Markdown 解读                               │
│                                                            │
│  前端: renderMarkdown() → 渲染 HTML                         │
│       用户可点击「重新占卜」回到阶段 1                        │
└─────────────────────────────────────────────────────────────┘
```
