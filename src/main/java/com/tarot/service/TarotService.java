package com.tarot.service;

import com.tarot.model.TarotCard;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class TarotService {

    private final List<TarotCard> allCards = new ArrayList<>();

    public TarotService() {
        initMajorArcana();
        initMinorArcana();
    }

    public List<TarotCard> getAllShuffledCards() {
        List<TarotCard> shuffled = new ArrayList<>(allCards);
        Collections.shuffle(shuffled);
        Random rand = new Random();
        for (TarotCard card : shuffled) {
            card.setReversed(rand.nextBoolean());
        }
        return shuffled;
    }

    private void initMajorArcana() {
        allCards.add(new TarotCard(0, "愚人", "The Fool", "major", null, "开始、冒险、天真", "新的开始，充满无限可能，勇敢迈出第一步。", "冒险行事，鲁莽冲动，需要三思而后行。"));
        allCards.add(new TarotCard(1, "魔术师", "The Magician", "major", null, "创造力、技能、自信", "拥有实现目标的全部工具和资源，善用智慧和技能。", "缺乏方向，浪费天赋，被误导或欺骗。"));
        allCards.add(new TarotCard(2, "女祭司", "The High Priestess", "major", null, "直觉、潜意识、神秘", "倾听内心声音，相信直觉，保持耐心等待答案显现。", "忽视直觉，隐藏的秘密，表面之下有未知信息。"));
        allCards.add(new TarotCard(3, "女皇", "The Empress", "major", null, "丰饶、自然、母爱", "丰收与滋养的时刻，关爱自己和他人，享受生活的美好。", "依赖性太强，创造力受阻，过于放纵。"));
        allCards.add(new TarotCard(4, "皇帝", "The Emperor", "major", null, "权威、稳定、领导力", "建立秩序与结构，以成熟的判断力做出决策。", "滥用权力，固执己见，缺乏自律。"));
        allCards.add(new TarotCard(5, "教皇", "The Hierophant", "major", null, "传统、信仰、指导", "寻求智者或导师的指引，遵循传统价值观。", "思想僵化，过度依赖他人意见，打破常规。"));
        allCards.add(new TarotCard(6, "恋人", "The Lovers", "major", null, "爱情、选择、和谐", "面临重要选择，跟随内心而非理智，和谐的亲密关系。", "关系失衡，错误的决定，价值观冲突。"));
        allCards.add(new TarotCard(7, "战车", "The Chariot", "major", null, "意志力、胜利、征服", "凭借坚定的意志力克服障碍，获得胜利。", "失去方向，意志力薄弱，被情绪左右。"));
        allCards.add(new TarotCard(8, "力量", "Strength", "major", null, "勇气、内在力量、耐心", "以柔克刚，用内心的勇气和耐心应对挑战。", "软弱无力，缺乏自信，被本能控制。"));
        allCards.add(new TarotCard(9, "隐士", "The Hermit", "major", null, "内省、智慧、独处", "需要独处与反思，在安静中寻找内在的智慧。", "过度孤立，逃避现实，拒绝帮助。"));
        allCards.add(new TarotCard(10, "命运之轮", "Wheel of Fortune", "major", null, "变化、循环、命运", "命运正在转变，好运将至，生命的自然循环。", "厄运降临，计划外的变化，抗拒改变。"));
        allCards.add(new TarotCard(11, "正义", "Justice", "major", null, "公正、真相、法律", "因果报应，得到应得的回报，真理终将显现。", "不公正，逃避责任，错误的判断。"));
        allCards.add(new TarotCard(12, "倒吊人", "The Hanged Man", "major", null, "牺牲、放下、新视角", "以不同的角度看待问题，放下执念，顺应自然。", "拖延决策，无谓的牺牲，抗拒必要的改变。"));
        allCards.add(new TarotCard(13, "死神", "Death", "major", null, "结束、转变、新生", "旧的事物终结，为新的开始腾出空间，不可抗拒的转变。", "抗拒结束，停滞不前，恐惧改变。"));
        allCards.add(new TarotCard(14, "节制", "Temperance", "major", null, "平衡、调和、适度", "寻求平衡与和谐，以耐心和温和的方式前进。", "失衡，极端行为，缺乏耐心。"));
        allCards.add(new TarotCard(15, "恶魔", "The Devil", "major", null, "束缚、物质、欲望", "被物质欲望或负面习惯所困，需要直面内心的阴影。", "挣脱束缚，终于自由，觉醒与解脱。"));
        allCards.add(new TarotCard(16, "高塔", "The Tower", "major", null, "剧变、崩塌、觉醒", "突然的变故打破旧有结构，虽然痛苦但带来觉醒。", "避免灾难，延迟的崩溃，重新建立。"));
        allCards.add(new TarotCard(17, "星星", "The Star", "major", null, "希望、灵感、宁静", "充满希望与平静，灵感和信心从内心升起。", "失去希望，创意枯竭，对自己的信念动摇。"));
        allCards.add(new TarotCard(18, "月亮", "The Moon", "major", null, "恐惧、幻觉、潜意识", "面对未知的恐惧，事物并非表面所见，信任直觉。", "拨开迷雾，看清真相，克服恐惧。"));
        allCards.add(new TarotCard(19, "太阳", "The Sun", "major", null, "喜悦、成功、活力", "光明与欢乐的时刻，充满生命力，一切皆有可能。", "暂时的阴霾，快乐被掩盖，小挫折。"));
        allCards.add(new TarotCard(20, "审判", "Judgement", "major", null, "重生、觉醒、召唤", "自我评估与觉醒的时刻，接受内心的召唤。", "自我怀疑，拒绝召唤，恐惧评判。"));
        allCards.add(new TarotCard(21, "世界", "The World", "major", null, "完成、圆满、旅行", "一个阶段的圆满结束，目标达成，完整的循环。", "未完成，停滞不前，需要最后的完善。"));
    }

    private void initMinorArcana() {
        // Wands
        allCards.add(new TarotCard(22, "权杖王牌", "Ace of Wands", "minor", "wands", "开始、灵感、创造", "新的创意或事业的开始，充满热情与能量。", "延迟的开始，创意受阻，缺乏方向。"));
        allCards.add(new TarotCard(23, "权杖二", "Two of Wands", "minor", "wands", "规划、决策、未来", "站在十字路口，需要做出选择并规划未来。", "恐惧未知，计划受阻，考虑不周。"));
        allCards.add(new TarotCard(24, "权杖三", "Three of Wands", "minor", "wands", "扩展、远见、探索", "展望未来，计划正在推进，新的机会出现。", "延迟，缺乏远见，准备不足。"));
        allCards.add(new TarotCard(25, "权杖四", "Four of Wands", "minor", "wands", "庆祝、和谐、家园", "庆祝成功的时刻，家庭团圆，稳定与和谐。", "缺乏稳定，庆祝被取消，家庭矛盾。"));
        allCards.add(new TarotCard(26, "权杖五", "Five of Wands", "minor", "wands", "竞争、冲突、挑战", "激烈的竞争或争论，不同的观点在碰撞。", "避免冲突，合作解决分歧，和平。"));
        allCards.add(new TarotCard(27, "权杖六", "Six of Wands", "minor", "wands", "胜利、认可、荣誉", "获得公众的认可与赞赏，取得重要的胜利。", "失败，骄傲自满，荣誉短暂。"));
        allCards.add(new TarotCard(28, "权杖七", "Seven of Wands", "minor", "wands", "防御、坚持、挑战", "坚守立场，捍卫自己的信念，面对挑战不退缩。", "放弃立场，感到不堪重负，失去优势。"));
        allCards.add(new TarotCard(29, "权杖八", "Eight of Wands", "minor", "wands", "迅速、行动、进展", "事情快速发展，好消息将至，行动力十足。", "延迟，沟通不畅，速度减慢。"));
        allCards.add(new TarotCard(30, "权杖九", "Nine of Wands", "minor", "wands", "韧性、坚持、警惕", "最后阶段的坚持，虽然疲惫但仍在坚守。", "精疲力竭，放弃，准备不足。"));
        allCards.add(new TarotCard(31, "权杖十", "Ten of Wands", "minor", "wands", "负担、压力、责任", "承担了过多的责任，感到不堪重负。", "放下负担，委托他人，学会说不。"));
        allCards.add(new TarotCard(32, "权杖侍从", "Page of Wands", "minor", "wands", "探索、热情、新闻", "充满好奇心与热情，新的消息或冒险的召唤。", "缺乏方向，热情消退，幼稚行事。"));
        allCards.add(new TarotCard(33, "权杖骑士", "Knight of Wands", "minor", "wands", "行动、冒险、冲动", "充满能量与热情的追求目标，行动力强。", "冲动行事，缺乏规划，半途而废。"));
        allCards.add(new TarotCard(34, "权杖王后", "Queen of Wands", "minor", "wands", "自信、热情、温暖", "充满魅力与自信，以热情温暖他人，领导力强。", "嫉妒，缺乏自信，情绪化。"));
        allCards.add(new TarotCard(35, "权杖国王", "King of Wands", "minor", "wands", "领导力、远见、创业", "充满远见与魄力的领导者，创业精神的体现。", "专制，要求过高，缺乏耐心。"));
        // Cups
        allCards.add(new TarotCard(36, "圣杯王牌", "Ace of Cups", "minor", "cups", "爱、情感、新感情", "新的情感关系的开始，爱在流动，内心充实。", "情感枯竭，爱被阻塞，空虚感。"));
        allCards.add(new TarotCard(37, "圣杯二", "Two of Cups", "minor", "cups", "恋爱、友谊、联结", "平等互惠的关系，深刻的感情联结。", "关系失衡，分手，沟通不良。"));
        allCards.add(new TarotCard(38, "圣杯三", "Three of Cups", "minor", "cups", "庆祝、友谊、欢乐", "与朋友欢聚，庆祝的时刻，分享喜悦。", "过度放纵，友谊变淡，孤立。"));
        allCards.add(new TarotCard(39, "圣杯四", "Four of Cups", "minor", "cups", "沉思、不满、冷漠", "对现状感到不满，需要内省以发现新的机会。", "错过机会，醒悟，重新投入。"));
        allCards.add(new TarotCard(40, "圣杯五", "Five of Cups", "minor", "cups", "悲伤、失落、遗憾", "沉浸在失去的痛苦中，忽视了仍然拥有的美好。", "接受现实，放下过去，看到新的希望。"));
        allCards.add(new TarotCard(41, "圣杯六", "Six of Cups", "minor", "cups", "回忆、怀旧、馈赠", "怀念过去的美好时光，收到礼物或善意的馈赠。", "沉迷过去，无法向前，不切实际。"));
        allCards.add(new TarotCard(42, "圣杯七", "Seven of Cups", "minor", "cups", "幻想、选择、迷惑", "面对多种可能性，需要辨别真实与虚幻。", "做出明智的选择，看清现实，聚焦。"));
        allCards.add(new TarotCard(43, "圣杯八", "Eight of Cups", "minor", "cups", "放弃、追寻、转变", "放弃不再满足你的事物，追寻更高意义。", "逃避，迷失方向，害怕改变。"));
        allCards.add(new TarotCard(44, "圣杯九", "Nine of Cups", "minor", "cups", "满足、愿望、幸福", "愿望成真，内心满足与快乐。", "表面满足，内心空虚，贪婪。"));
        allCards.add(new TarotCard(45, "圣杯十", "Ten of Cups", "minor", "cups", "幸福、家庭、完美", "美满的家庭生活，和谐幸福的关系。", "破碎的家庭，理想破灭，关系紧张。"));
        allCards.add(new TarotCard(46, "圣杯侍从", "Page of Cups", "minor", "cups", "灵感、敏感、消息", "创意的灵感，情感上的新消息，天真浪漫。", "情感不成熟，创意阻塞，失望的消息。"));
        allCards.add(new TarotCard(47, "圣杯骑士", "Knight of Cups", "minor", "cups", "浪漫、理想、追求", "优雅浪漫的追求者，跟随内心的理想。", "不切实际，情绪波动，逃避承诺。"));
        allCards.add(new TarotCard(48, "圣杯王后", "Queen of Cups", "minor", "cups", "关爱、直觉、慈悲", "充满关爱的母亲形象，直觉敏锐，善解人意。", "过度情绪化，依赖他人，迷失自我。"));
        allCards.add(new TarotCard(49, "圣杯国王", "King of Cups", "minor", "cups", "情感成熟、慈悲、稳重", "情感上成熟稳重，以温和的方式领导他人。", "情感压抑，操控他人，喜怒无常。"));
        // Swords
        allCards.add(new TarotCard(50, "宝剑王牌", "Ace of Swords", "minor", "swords", "真理、心智、突破", "清晰的思维与洞察力，真理的力量带来突破。", "混乱的思维，偏见，错误的判断。"));
        allCards.add(new TarotCard(51, "宝剑二", "Two of Swords", "minor", "swords", "抉择、僵局、逃避", "面临艰难的抉择，需要做出决定。", "信息太多，过度分析，做出错误决定。"));
        allCards.add(new TarotCard(52, "宝剑三", "Three of Swords", "minor", "swords", "心痛、悲伤、痛苦", "心碎与悲伤，情感上的痛苦。", "康复，释放伤痛，学会原谅。"));
        allCards.add(new TarotCard(53, "宝剑四", "Four of Swords", "minor", "swords", "休息、放松、冥想", "需要休息与恢复，从压力中抽离。", "过度休息，逃避，无法放松。"));
        allCards.add(new TarotCard(54, "宝剑五", "Five of Swords", "minor", "swords", "冲突、失败、屈辱", "冲突后的失落，赢了争吵却输了关系。", "和解，放下争执，选择和平。"));
        allCards.add(new TarotCard(55, "宝剑六", "Six of Swords", "minor", "swords", "过渡、疗愈、前行", "从困难中走出来，向更平静的彼岸前行。", "无法走出过去，抗拒必要的过渡。"));
        allCards.add(new TarotCard(56, "宝剑七", "Seven of Swords", "minor", "swords", "策略、欺骗、隐密", "需要策略性思考，小心被欺骗。", "诚实面对，坦白，被抓住。"));
        allCards.add(new TarotCard(57, "宝剑八", "Eight of Swords", "minor", "swords", "束缚、恐惧、无助", "被自我设限的思维所困，感到无助。", "解放自我，看到新的视角，克服恐惧。"));
        allCards.add(new TarotCard(58, "宝剑九", "Nine of Swords", "minor", "swords", "焦虑、噩梦、忧虑", "深夜的焦虑与噩梦，被担忧所吞噬。", "克服焦虑，寻求帮助，面对恐惧。"));
        allCards.add(new TarotCard(59, "宝剑十", "Ten of Swords", "minor", "swords", "终结、毁灭、谷底", "最黑暗的时刻已经过去，谷底之后是新生。", "绝处逢生，浴火重生，否极泰来。"));
        allCards.add(new TarotCard(60, "宝剑侍从", "Page of Swords", "minor", "swords", "好奇、沟通、警觉", "充满好奇心的探索者，渴望知识与交流。", "八卦，说话不经大脑，信息错误。"));
        allCards.add(new TarotCard(61, "宝剑骑士", "Knight of Swords", "minor", "swords", "行动、果断、急速", "勇往直前的行动力，果断但不计后果。", "冲动鲁莽，急躁行事，缺乏策略。"));
        allCards.add(new TarotCard(62, "宝剑王后", "Queen of Swords", "minor", "swords", "清晰、独立、公正", "独立思考，以客观公正的态度看待事物。", "冷酷无情，尖酸刻薄，过度理性。"));
        allCards.add(new TarotCard(63, "宝剑国王", "King of Swords", "minor", "swords", "权威、理性、真理", "以清晰的理性与智慧行使权威，追求真理。", "滥用权力，独断专行，冷酷无情。"));
        // Pentacles
        allCards.add(new TarotCard(64, "星币王牌", "Ace of Pentacles", "minor", "pentacles", "财富、开始、机会", "财务上的新开始，实际的机会降临。", "错失机会，财务计划不佳，延迟。"));
        allCards.add(new TarotCard(65, "星币二", "Two of Pentacles", "minor", "pentacles", "平衡、适应、多任务", "在多重事务之间保持平衡，灵活应对变化。", "失去平衡，财务压力，不堪重负。"));
        allCards.add(new TarotCard(66, "星币三", "Three of Pentacles", "minor", "pentacles", "团队、合作、技能", "团队协作，学习技能，共同努力达成目标。", "缺乏团队精神，技能不足，合作不佳。"));
        allCards.add(new TarotCard(67, "星币四", "Four of Pentacles", "minor", "pentacles", "保守、节俭、控制", "紧紧抓住已有的财富，保守与安全。", "过度节俭，吝啬，害怕失去。"));
        allCards.add(new TarotCard(68, "星币五", "Five of Pentacles", "minor", "pentacles", "贫困、匮乏、孤立", "物质或精神上的匮乏，感到被排斥在外。", "恢复，找到帮助，改善状况。"));
        allCards.add(new TarotCard(69, "星币六", "Six of Pentacles", "minor", "pentacles", "慷慨、慈善、分享", "给予与接受的平衡，慷慨分享财富。", "不平等，依赖他人，债务问题。"));
        allCards.add(new TarotCard(70, "星币七", "Seven of Pentacles", "minor", "pentacles", "投资、耐心、等待", "等待努力的成果，审视投资的回报。", "浪费努力，缺乏回报，急于求成。"));
        allCards.add(new TarotCard(71, "星币八", "Eight of Pentacles", "minor", "pentacles", "勤奋、技能、专注", "专注于提升技能，勤奋工作，精益求精。", "马虎工作，缺乏专注，技能不足。"));
        allCards.add(new TarotCard(72, "星币九", "Nine of Pentacles", "minor", "pentacles", "奢华、自律、独立", "通过努力获得丰硕成果，享受独立与奢华。", "过度依赖，财务损失，表面光鲜。"));
        allCards.add(new TarotCard(73, "星币十", "Ten of Pentacles", "minor", "pentacles", "财富、传承、家庭", "世代相传的财富与家族繁荣。", "家庭财务问题，传承断裂，失去遗产。"));
        allCards.add(new TarotCard(74, "星币侍从", "Page of Pentacles", "minor", "pentacles", "学习、实践、勤奋", "脚踏实地的学习与实践，新的财务机会。", "拖延学习，不切实际，缺乏计划。"));
        allCards.add(new TarotCard(75, "星币骑士", "Knight of Pentacles", "minor", "pentacles", "踏实、可靠、勤奋", "勤勤恳恳，一步一个脚印，可靠而负责。", "停滞不前，过于保守，缺乏热情。"));
        allCards.add(new TarotCard(76, "星币王后", "Queen of Pentacles", "minor", "pentacles", "实际、关爱、丰饶", "实际而温暖的女性形象，带来丰饶与安定。", "疏忽家庭，过度物质，不安全感。"));
        allCards.add(new TarotCard(77, "星币国王", "King of Pentacles", "minor", "pentacles", "成功、财富、领导", "物质成功的象征，稳健的领导者，财富的守护者。", "贪婪，挥霍无度，僵化固执。"));
    }

    public List<TarotCard> drawCards(int count) {
        if (count <= 0 || count > allCards.size()) {
            count = 1;
        }
        List<TarotCard> shuffled = new ArrayList<>(allCards);
        Collections.shuffle(shuffled);
        List<TarotCard> drawn = shuffled.subList(0, count);
        Random rand = new Random();
        for (TarotCard card : drawn) {
            card.setReversed(rand.nextBoolean());
        }
        return drawn;
    }

    public Map<String, Object> drawThreeCardSpread() {
        List<TarotCard> cards = drawCards(3);
        Map<String, Object> spread = new LinkedHashMap<>();
        spread.put("positions", List.of("过去", "现在", "未来"));
        spread.put("cards", cards);
        return spread;
    }

    public TarotCard drawDailyCard() {
        return drawCards(1).get(0);
    }
}