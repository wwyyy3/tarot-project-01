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

    @GetMapping("/draw")
    public Map<String, Object> draw(@RequestParam(defaultValue = "1") int count) {
        count = Math.min(Math.max(count, 1), 10);
        List<TarotCard> cards = tarotService.drawCards(count);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("count", cards.size());
        result.put("cards", cards);
        return result;
    }

    @PostMapping("/interpret")
    public Map<String, Object> interpret(@RequestBody Map<String, Object> request) {
        String apiKey = (String) request.get("apiKey");
        String question = (String) request.get("question");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> cards = (List<Map<String, Object>>) request.get("cards");
        StringBuilder prompt = new StringBuilder();
        prompt.append("你是一位精通塔罗牌的占卜师。请根据用户抽到的卡牌和提出的问题，给出有深度、有启发性的解读。\n\n");
        prompt.append("## 用户的问题：\n").append(question).append("\n\n");
        prompt.append("## 抽到的卡牌（按抽取顺序）：\n");
        for (int i = 0; i < cards.size(); i++) {
            Map<String, Object> c = cards.get(i);
            String orientation = Boolean.TRUE.equals(c.get("reversed")) ? "逆位" : "正位";
            prompt.append(i + 1).append(". ").append(c.get("name")).append(" (").append(c.get("nameEn")).append(") - ").append(orientation).append("\n");
            prompt.append("   关键词：").append(c.get("keywords")).append("\n");
            prompt.append("   牌义：").append(orientation.equals("正位") ? c.get("meaning") : c.get("reversedMeaning")).append("\n\n");
        }
        prompt.append("请用温暖而专业的语言，给出详细的解读。请使用 Markdown 格式组织内容，包含清晰的小标题、列表和重点加粗。");
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
            systemMsg.put("content", "你是塔罗牌占卜师，请给出有深度、有启发性的解读，并使用 Markdown 格式回答。");
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

