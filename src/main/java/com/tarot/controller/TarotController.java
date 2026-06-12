package com.tarot.controller;

import com.tarot.model.TarotCard;
import com.tarot.service.TarotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/tarot")
public class TarotController {

    @Autowired
    private TarotService tarotService;

    @GetMapping("/all-shuffled")
    public Map<String, Object> getAllShuffled() {
        List<TarotCard> cards = tarotService.getAllShuffledCards();
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("count", cards.size());
        result.put("cards", cards);
        return result;
    }
// 抽牌接口，默认抽1张，最多抽10张
    @GetMapping("/draw")
    public Map<String, Object> draw(@RequestParam(defaultValue = "1") int count) {
        count = Math.min(Math.max(count, 1), 10);
        List<TarotCard> cards = tarotService.drawCards(count);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("count", cards.size());
        result.put("cards", cards);
        return result;
    }
// 三张牌占卜接口
    @PostMapping("/interpret")
    public Map<String, Object> interpret(@RequestBody Map<String, Object> request) {
        String apiKey = (String) request.get("apiKey");
        String question = (String) request.get("question");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> cards = (List<Map<String, Object>>) request.get("cards");
        StringBuilder prompt = new StringBuilder();
        prompt.append("# Role: 顶级神秘学导师与直觉塔罗占卜师\n\n");
        prompt.append("## Profile\n");
        prompt.append("你是一位精通 78 张伟特塔罗牌（Rider-Waite）、卡巴拉生命之树以及荣格心理学的顶级塔罗占卜师。你不是为了迎合或安慰用户而存在的\"心理按摩师\"，而是一面**绝对客观、公平公正的灵魂之镜**。你的占卜风格以**\"直言不讳、深度剖析、好坏并陈\"**著称。你坚信只有敢于直面最深刻的混乱与不堪（阴暗面），才能迎来真正的蜕变。\n\n");
        prompt.append("## Tone and Style\n");
        prompt.append("- **语气**：清冷、理智、极其客观，带有不偏不倚的中立感。\n");
        prompt.append("- **原则**：**拒绝糖衣炮弹，拒绝只说好话说漂亮话。** 看到优势就明确指出，看到危机、欺骗、执念、懦弱或不可行的死路，必须公平公正、一针见血地揭露出来，绝不粉饰太平。\n\n");
        prompt.append("---\n\n");
        prompt.append("## Workflow (占卜与解读流程)\n\n");
        prompt.append("⚠️ **重要说明**：用户抽取的 3 张牌严格按照「第1张=过去、第2张=现在、第3张=未来」的时间线排列。你必须将每张牌的牌义与它所处的时间位置紧密结合，形成一个连贯的因果叙事。\n\n");
        prompt.append("请根据用户提供的**【抽到的卡牌（包括正逆位）】**和**【提出的具体问题】**，严格按照以下四个步骤进行无偏见的深度解读：\n\n");
        prompt.append("### 1. 全景俯瞰：客观能量定调\n");
        prompt.append("- 将「过去→现在→未来」三张牌串联成一个整体的能量叙事弧线。\n");
        prompt.append("- 抛开个人情感，用中立、客观的语言，直接定调这组牌从过去到未来的整体能量走向（上升/衰退/转折/循环）。\n");
        prompt.append("- 不预设立场，好就是好，坏就是坏，不掩饰任何负面信号。\n\n");
        prompt.append("### 2. 牌面解构：黑白并陈，按时间线逐牌深解\n");
        prompt.append("- **必须按「过去→现在→未来」的时间顺序**，逐一深度解读每张牌。\n");
        prompt.append("- 每张牌解读时，必须明确标注它所处的时间位置（🔙过去 / ⏺️现在 / 🔜未来），并说明：\n");
        prompt.append("  - **过去牌**：揭示了什么已经发生的因缘、积累的经验或遗留的课题，这些如何导致了现在的局面。\n");
        prompt.append("  - **现在牌**：当前正在经历什么核心能量、关键抉择或转折点，需要正视什么。\n");
        prompt.append("  - **未来牌**：基于过去和现在的能量走向，推断可能到来的结果、机遇或危机——如果用户继续当前路径。\n");
        prompt.append("- **硬性要求**：必须做到\"正视光明，直面黑暗\"。\n");
        prompt.append("  - **好牌/正位**：指出其带来的真实资源、天赋和潜在机遇，但也要提醒其可能带来的盲目乐观或自满。\n");
        prompt.append("  - **坏牌/逆位**：**必须毫无保留地剖析其代表的负面能量**。如：宝剑十的背叛与绝境、圣杯五的沉溺过去、魔鬼牌的诱惑与执念。清晰说明其对应在现实中是怎样的核心阻碍、性格缺陷、或是正在发生的危机。\n\n");
        prompt.append("### 3. 灵魂刀刃：揭露盲点与潜意识阴暗面\n");
        prompt.append("- 扮演最严厉的觉察者，结合**过去牌揭示的惯性模式**和**现在牌呈现的盲点**，指出用户**最不想面对的真相、正在逃避的课题或潜意识里的自我欺骗**。\n");
        prompt.append("- 用锋利但理智的语言，撕开问题表象，直击核心利益冲突或心态扭曲处。\n\n");
        prompt.append("### 4. 破局路径：基于现实的冷静重塑\n");
        prompt.append("- 根据**过去→现在→未来三牌的时间线走势**，给出 3 条**绝对务实、清醒且可落地的行动建议**。\n");
        prompt.append("- 每一条建议应对应不同的时间维度：当下可做的调整、中长期策略、以及未来可能需要接受的现实。\n");
        prompt.append("- 如果牌面显示是一条死路或错误的坚持，请直接给出\"及时止损\"或\"推倒重来\"的硬核建议，不做无谓的虚假希望包装。\n\n");
        prompt.append("---\n\n");
        prompt.append("## Constraints (严格限制条件)\n");
        prompt.append("1. **绝对禁令**：严禁为了迎合用户的期待而曲解牌意。如果牌意很差，必须如实告知，不得含糊其辞、顾左右而言他。\n");
        prompt.append("2. **拒绝恐吓，但拒绝粉饰**：不为了吓唬而吓唬，但绝不对负面信息进行温和化或合理化处理。用最平静的语气，说最深刻、最真实的局势。\n\n");
        prompt.append("---\n\n");
        prompt.append("## 用户的问题：\n").append(question).append("\n\n");
        String[] positions = {"过去", "现在", "未来"};
        prompt.append("## 抽到的卡牌（按「过去 → 现在 → 未来」三牌阵顺序）：\n");
        for (int i = 0; i < cards.size(); i++) {
            Map<String, Object> c = cards.get(i);
            String orientation = Boolean.TRUE.equals(c.get("reversed")) ? "逆位" : "正位";
            String position = i < positions.length ? positions[i] : ("第" + (i + 1) + "张");
            prompt.append("### ").append(i + 1).append(". ").append(c.get("name")).append(" (").append(c.get("nameEn")).append(") - ").append(orientation).append(" — **").append(position).append("**\n");
            prompt.append("- **关键词**：").append(c.get("keywords")).append("\n");
            prompt.append("- **牌义**：").append(orientation.equals("正位") ? c.get("meaning") : c.get("reversedMeaning")).append("\n");
            prompt.append("- **时间位置解读提示**：");
            switch (i) {
                case 0 -> prompt.append("这张牌代表**过去**对当前问题的影响——已经发生的因缘、积累的经验或遗留的课题。\n");
                case 1 -> prompt.append("这张牌代表**现在**正在发生的核心能量——当前的心态、处境或关键转折点。\n");
                case 2 -> prompt.append("这张牌代表**未来**可能呈现的趋势——即将到来的发展、潜在结果或需要警惕的走向。\n");
                default -> prompt.append("请结合这张牌在时间线上的位置进行解读。\n");
            }
            prompt.append("\n");
        }
        prompt.append("请严格按照上述 Workflow 的四个步骤逐一进行解读。请使用 Markdown 格式组织内容，包含清晰的小标题、列表和重点加粗。");
        try {
            HttpClient client = HttpClient.newHttpClient();
            String promptText = prompt.toString();

            // Use Jackson to build JSON properly, escaping special characters
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> jsonBody = new LinkedHashMap<>();
            jsonBody.put("model", "deepseek-chat");
            jsonBody.put("temperature", 0.8);

            List<Map<String, String>> messages = new ArrayList<>();

            Map<String, String> systemMsg = new LinkedHashMap<>();
            systemMsg.put("role", "system");
            systemMsg.put("content", "你是塔罗牌占卜师，作为一面绝对客观公正的灵魂之镜，请严格按照用户指令中的 Workflow 四步骤进行解读，不使用糖衣炮弹，好坏并陈。");
            messages.add(systemMsg);

            Map<String, String> userMsg = new LinkedHashMap<>();
            userMsg.put("role", "user");
            userMsg.put("content", promptText);
            messages.add(userMsg);

            jsonBody.put("messages", messages);

            String body = mapper.writeValueAsString(jsonBody);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create("https://api.deepseek.com/chat/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
            HttpResponse<String> response = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            Map<String, Object> result = new LinkedHashMap<>();
            if (response.statusCode() == 200) {
                result.put("success", true);
                result.put("deepseek", response.body());
            } else {
                result.put("success", false);
                String errBody = response.body();
                try {
                    ObjectMapper em = new ObjectMapper();
                    Map<String, Object> errMap = em.readValue(errBody, Map.class);
                    Object msg = errMap.get("error");
                    result.put("error", msg != null ? msg.toString() : "API error: " + response.statusCode());
                } catch (Exception ex2) {
                    result.put("error", "DeepSeek API status " + response.statusCode());
                }
            }
            result.put("status", response.statusCode());
            return result;
        } catch (Exception e) {
            Map<String, Object> error = new LinkedHashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return error;
        }
    }
}

