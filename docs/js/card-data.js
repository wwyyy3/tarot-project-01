// ===== 78张塔罗牌完整数据（从 Java TarotService 移植） =====
var ALL_TAROT_CARDS = [
    // ===== 大阿尔卡纳 Major Arcana (0-21) =====
    { id:0, name:"愚人", nameEn:"The Fool", arcana:"major", suit:null, keywords:"开始、冒险、天真", meaning:"新的开始，充满无限可能，勇敢迈出第一步。", reversedMeaning:"冒险行事，鲁莽冲动，需要三思而后行。" },
    { id:1, name:"魔术师", nameEn:"The Magician", arcana:"major", suit:null, keywords:"创造力、技能、自信", meaning:"拥有实现目标的全部工具和资源，善用智慧和技能。", reversedMeaning:"缺乏方向，浪费天赋，被误导或欺骗。" },
    { id:2, name:"女祭司", nameEn:"The High Priestess", arcana:"major", suit:null, keywords:"直觉、潜意识、神秘", meaning:"倾听内心声音，相信直觉，保持耐心等待答案显现。", reversedMeaning:"忽视直觉，隐藏的秘密，表面之下有未知信息。" },
    { id:3, name:"女皇", nameEn:"The Empress", arcana:"major", suit:null, keywords:"丰饶、自然、母爱", meaning:"丰收与滋养的时刻，关爱自己和他人，享受生活的美好。", reversedMeaning:"依赖性太强，创造力受阻，过于放纵。" },
    { id:4, name:"皇帝", nameEn:"The Emperor", arcana:"major", suit:null, keywords:"权威、稳定、领导力", meaning:"建立秩序与结构，以成熟的判断力做出决策。", reversedMeaning:"滥用权力，固执己见，缺乏自律。" },
    { id:5, name:"教皇", nameEn:"The Hierophant", arcana:"major", suit:null, keywords:"传统、信仰、指导", meaning:"寻求智者或导师的指引，遵循传统价值观。", reversedMeaning:"思想僵化，过度依赖他人意见，打破常规。" },
    { id:6, name:"恋人", nameEn:"The Lovers", arcana:"major", suit:null, keywords:"爱情、选择、和谐", meaning:"面临重要选择，跟随内心而非理智，和谐的亲密关系。", reversedMeaning:"关系失衡，错误的决定，价值观冲突。" },
    { id:7, name:"战车", nameEn:"The Chariot", arcana:"major", suit:null, keywords:"意志力、胜利、征服", meaning:"凭借坚定的意志力克服障碍，获得胜利。", reversedMeaning:"失去方向，意志力薄弱，被情绪左右。" },
    { id:8, name:"力量", nameEn:"Strength", arcana:"major", suit:null, keywords:"勇气、内在力量、耐心", meaning:"以柔克刚，用内心的勇气和耐心应对挑战。", reversedMeaning:"软弱无力，缺乏自信，被本能控制。" },
    { id:9, name:"隐士", nameEn:"The Hermit", arcana:"major", suit:null, keywords:"内省、智慧、独处", meaning:"需要独处与反思，在安静中寻找内在的智慧。", reversedMeaning:"过度孤立，逃避现实，拒绝帮助。" },
    { id:10, name:"命运之轮", nameEn:"Wheel of Fortune", arcana:"major", suit:null, keywords:"变化、循环、命运", meaning:"命运正在转变，好运将至，生命的自然循环。", reversedMeaning:"厄运降临，计划外的变化，抗拒改变。" },
    { id:11, name:"正义", nameEn:"Justice", arcana:"major", suit:null, keywords:"公正、真相、法律", meaning:"因果报应，得到应得的回报，真理终将显现。", reversedMeaning:"不公正，逃避责任，错误的判断。" },
    { id:12, name:"倒吊人", nameEn:"The Hanged Man", arcana:"major", suit:null, keywords:"牺牲、放下、新视角", meaning:"以不同的角度看待问题，放下执念，顺应自然。", reversedMeaning:"拖延决策，无谓的牺牲，抗拒必要的改变。" },
    { id:13, name:"死神", nameEn:"Death", arcana:"major", suit:null, keywords:"结束、转变、新生", meaning:"旧的事物终结，为新的开始腾出空间，不可抗拒的转变。", reversedMeaning:"抗拒结束，停滞不前，恐惧改变。" },
    { id:14, name:"节制", nameEn:"Temperance", arcana:"major", suit:null, keywords:"平衡、调和、适度", meaning:"寻求平衡与和谐，以耐心和温和的方式前进。", reversedMeaning:"失衡，极端行为，缺乏耐心。" },
    { id:15, name:"恶魔", nameEn:"The Devil", arcana:"major", suit:null, keywords:"束缚、物质、欲望", meaning:"被物质欲望或负面习惯所困，需要直面内心的阴影。", reversedMeaning:"挣脱束缚，终于自由，觉醒与解脱。" },
    { id:16, name:"高塔", nameEn:"The Tower", arcana:"major", suit:null, keywords:"剧变、崩塌、觉醒", meaning:"突然的变故打破旧有结构，虽然痛苦但带来觉醒。", reversedMeaning:"避免灾难，延迟的崩溃，重新建立。" },
    { id:17, name:"星星", nameEn:"The Star", arcana:"major", suit:null, keywords:"希望、灵感、宁静", meaning:"充满希望与平静，灵感和信心从内心升起。", reversedMeaning:"失去希望，创意枯竭，对自己的信念动摇。" },
    { id:18, name:"月亮", nameEn:"The Moon", arcana:"major", suit:null, keywords:"恐惧、幻觉、潜意识", meaning:"面对未知的恐惧，事物并非表面所见，信任直觉。", reversedMeaning:"拨开迷雾，看清真相，克服恐惧。" },
    { id:19, name:"太阳", nameEn:"The Sun", arcana:"major", suit:null, keywords:"喜悦、成功、活力", meaning:"光明与欢乐的时刻，充满生命力，一切皆有可能。", reversedMeaning:"暂时的阴霾，快乐被掩盖，小挫折。" },
    { id:20, name:"审判", nameEn:"Judgement", arcana:"major", suit:null, keywords:"重生、觉醒、召唤", meaning:"自我评估与觉醒的时刻，接受内心的召唤。", reversedMeaning:"自我怀疑，拒绝召唤，恐惧评判。" },
    { id:21, name:"世界", nameEn:"The World", arcana:"major", suit:null, keywords:"完成、圆满、旅行", meaning:"一个阶段的圆满结束，目标达成，完整的循环。", reversedMeaning:"未完成，停滞不前，需要最后的完善。" },
    // ===== 小阿尔卡纳 - 权杖组 Wands (22-35) =====
    { id:22, name:"权杖王牌", nameEn:"Ace of Wands", arcana:"minor", suit:"wands", keywords:"开始、灵感、创造", meaning:"新的创意或事业的开始，充满热情与能量。", reversedMeaning:"延迟的开始，创意受阻，缺乏方向。" },
    { id:23, name:"权杖二", nameEn:"Two of Wands", arcana:"minor", suit:"wands", keywords:"规划、决策、未来", meaning:"站在十字路口，需要做出选择并规划未来。", reversedMeaning:"恐惧未知，计划受阻，考虑不周。" },
    { id:24, name:"权杖三", nameEn:"Three of Wands", arcana:"minor", suit:"wands", keywords:"扩展、远见、探索", meaning:"展望未来，计划正在推进，新的机会出现。", reversedMeaning:"延迟，缺乏远见，准备不足。" },
    { id:25, name:"权杖四", nameEn:"Four of Wands", arcana:"minor", suit:"wands", keywords:"庆祝、和谐、家园", meaning:"庆祝成功的时刻，家庭团圆，稳定与和谐。", reversedMeaning:"缺乏稳定，庆祝被取消，家庭矛盾。" },
    { id:26, name:"权杖五", nameEn:"Five of Wands", arcana:"minor", suit:"wands", keywords:"竞争、冲突、挑战", meaning:"激烈的竞争或争论，不同的观点在碰撞。", reversedMeaning:"避免冲突，合作解决分歧，和平。" },
    { id:27, name:"权杖六", nameEn:"Six of Wands", arcana:"minor", suit:"wands", keywords:"胜利、认可、荣誉", meaning:"获得公众的认可与赞赏，取得重要的胜利。", reversedMeaning:"失败，骄傲自满，荣誉短暂。" },
    { id:28, name:"权杖七", nameEn:"Seven of Wands", arcana:"minor", suit:"wands", keywords:"防御、坚持、挑战", meaning:"坚守立场，捍卫自己的信念，面对挑战不退缩。", reversedMeaning:"放弃立场，感到不堪重负，失去优势。" },
    { id:29, name:"权杖八", nameEn:"Eight of Wands", arcana:"minor", suit:"wands", keywords:"迅速、行动、进展", meaning:"事情快速发展，好消息将至，行动力十足。", reversedMeaning:"延迟，沟通不畅，速度减慢。" },
    { id:30, name:"权杖九", nameEn:"Nine of Wands", arcana:"minor", suit:"wands", keywords:"韧性、坚持、警惕", meaning:"最后阶段的坚持，虽然疲惫但仍在坚守。", reversedMeaning:"精疲力竭，放弃，准备不足。" },
    { id:31, name:"权杖十", nameEn:"Ten of Wands", arcana:"minor", suit:"wands", keywords:"负担、压力、责任", meaning:"承担了过多的责任，感到不堪重负。", reversedMeaning:"放下负担，委托他人，学会说不。" },
    { id:32, name:"权杖侍从", nameEn:"Page of Wands", arcana:"minor", suit:"wands", keywords:"探索、热情、新闻", meaning:"充满好奇心与热情，新的消息或冒险的召唤。", reversedMeaning:"缺乏方向，热情消退，幼稚行事。" },
    { id:33, name:"权杖骑士", nameEn:"Knight of Wands", arcana:"minor", suit:"wands", keywords:"行动、冒险、冲动", meaning:"充满能量与热情的追求目标，行动力强。", reversedMeaning:"冲动行事，缺乏规划，半途而废。" },
    { id:34, name:"权杖王后", nameEn:"Queen of Wands", arcana:"minor", suit:"wands", keywords:"自信、热情、温暖", meaning:"充满魅力与自信，以热情温暖他人，领导力强。", reversedMeaning:"嫉妒，缺乏自信，情绪化。" },
    { id:35, name:"权杖国王", nameEn:"King of Wands", arcana:"minor", suit:"wands", keywords:"领导力、远见、创业", meaning:"充满远见与魄力的领导者，创业精神的体现。", reversedMeaning:"专制，要求过高，缺乏耐心。" },
    // ===== 小阿尔卡纳 - 圣杯组 Cups (36-49) =====
    { id:36, name:"圣杯王牌", nameEn:"Ace of Cups", arcana:"minor", suit:"cups", keywords:"爱、情感、新感情", meaning:"新的情感关系的开始，爱在流动，内心充实。", reversedMeaning:"情感枯竭，爱被阻塞，空虚感。" },
    { id:37, name:"圣杯二", nameEn:"Two of Cups", arcana:"minor", suit:"cups", keywords:"恋爱、友谊、联结", meaning:"平等互惠的关系，深刻的感情联结。", reversedMeaning:"关系失衡，分手，沟通不良。" },
    { id:38, name:"圣杯三", nameEn:"Three of Cups", arcana:"minor", suit:"cups", keywords:"庆祝、友谊、欢乐", meaning:"与朋友欢聚，庆祝的时刻，分享喜悦。", reversedMeaning:"过度放纵，友谊变淡，孤立。" },
    { id:39, name:"圣杯四", nameEn:"Four of Cups", arcana:"minor", suit:"cups", keywords:"沉思、不满、冷漠", meaning:"对现状感到不满，需要内省以发现新的机会。", reversedMeaning:"错过机会，醒悟，重新投入。" },
    { id:40, name:"圣杯五", nameEn:"Five of Cups", arcana:"minor", suit:"cups", keywords:"悲伤、失落、遗憾", meaning:"沉浸在失去的痛苦中，忽视了仍然拥有的美好。", reversedMeaning:"接受现实，放下过去，看到新的希望。" },
    { id:41, name:"圣杯六", nameEn:"Six of Cups", arcana:"minor", suit:"cups", keywords:"回忆、怀旧、馈赠", meaning:"怀念过去的美好时光，收到礼物或善意的馈赠。", reversedMeaning:"沉迷过去，无法向前，不切实际。" },
    { id:42, name:"圣杯七", nameEn:"Seven of Cups", arcana:"minor", suit:"cups", keywords:"幻想、选择、迷惑", meaning:"面对多种可能性，需要辨别真实与虚幻。", reversedMeaning:"做出明智的选择，看清现实，聚焦。" },
    { id:43, name:"圣杯八", nameEn:"Eight of Cups", arcana:"minor", suit:"cups", keywords:"放弃、追寻、转变", meaning:"放弃不再满足你的事物，追寻更高意义。", reversedMeaning:"逃避，迷失方向，害怕改变。" },
    { id:44, name:"圣杯九", nameEn:"Nine of Cups", arcana:"minor", suit:"cups", keywords:"满足、愿望、幸福", meaning:"愿望成真，内心满足与快乐。", reversedMeaning:"表面满足，内心空虚，贪婪。" },
    { id:45, name:"圣杯十", nameEn:"Ten of Cups", arcana:"minor", suit:"cups", keywords:"幸福、家庭、完美", meaning:"美满的家庭生活，和谐幸福的关系。", reversedMeaning:"破碎的家庭，理想破灭，关系紧张。" },
    { id:46, name:"圣杯侍从", nameEn:"Page of Cups", arcana:"minor", suit:"cups", keywords:"灵感、敏感、消息", meaning:"创意的灵感，情感上的新消息，天真浪漫。", reversedMeaning:"情感不成熟，创意阻塞，失望的消息。" },
    { id:47, name:"圣杯骑士", nameEn:"Knight of Cups", arcana:"minor", suit:"cups", keywords:"浪漫、理想、追求", meaning:"优雅浪漫的追求者，跟随内心的理想。", reversedMeaning:"不切实际，情绪波动，逃避承诺。" },
    { id:48, name:"圣杯王后", nameEn:"Queen of Cups", arcana:"minor", suit:"cups", keywords:"关爱、直觉、慈悲", meaning:"充满关爱的母亲形象，直觉敏锐，善解人意。", reversedMeaning:"过度情绪化，依赖他人，迷失自我。" },
    { id:49, name:"圣杯国王", nameEn:"King of Cups", arcana:"minor", suit:"cups", keywords:"情感成熟、慈悲、稳重", meaning:"情感上成熟稳重，以温和的方式领导他人。", reversedMeaning:"情感压抑，操控他人，喜怒无常。" },
    // ===== 小阿尔卡纳 - 宝剑组 Swords (50-63) =====
    { id:50, name:"宝剑王牌", nameEn:"Ace of Swords", arcana:"minor", suit:"swords", keywords:"真理、心智、突破", meaning:"清晰的思维与洞察力，真理的力量带来突破。", reversedMeaning:"混乱的思维，偏见，错误的判断。" },
    { id:51, name:"宝剑二", nameEn:"Two of Swords", arcana:"minor", suit:"swords", keywords:"抉择、僵局、逃避", meaning:"面临艰难的抉择，需要做出决定。", reversedMeaning:"信息太多，过度分析，做出错误决定。" },
    { id:52, name:"宝剑三", nameEn:"Three of Swords", arcana:"minor", suit:"swords", keywords:"心痛、悲伤、痛苦", meaning:"心碎与悲伤，情感上的痛苦。", reversedMeaning:"康复，释放伤痛，学会原谅。" },
    { id:53, name:"宝剑四", nameEn:"Four of Swords", arcana:"minor", suit:"swords", keywords:"休息、放松、冥想", meaning:"需要休息与恢复，从压力中抽离。", reversedMeaning:"过度休息，逃避，无法放松。" },
    { id:54, name:"宝剑五", nameEn:"Five of Swords", arcana:"minor", suit:"swords", keywords:"冲突、失败、屈辱", meaning:"冲突后的失落，赢了争吵却输了关系。", reversedMeaning:"和解，放下争执，选择和平。" },
    { id:55, name:"宝剑六", nameEn:"Six of Swords", arcana:"minor", suit:"swords", keywords:"过渡、疗愈、前行", meaning:"从困难中走出来，向更平静的彼岸前行。", reversedMeaning:"无法走出过去，抗拒必要的过渡。" },
    { id:56, name:"宝剑七", nameEn:"Seven of Swords", arcana:"minor", suit:"swords", keywords:"策略、欺骗、隐密", meaning:"需要策略性思考，小心被欺骗。", reversedMeaning:"诚实面对，坦白，被抓住。" },
    { id:57, name:"宝剑八", nameEn:"Eight of Swords", arcana:"minor", suit:"swords", keywords:"束缚、恐惧、无助", meaning:"被自我设限的思维所困，感到无助。", reversedMeaning:"解放自我，看到新的视角，克服恐惧。" },
    { id:58, name:"宝剑九", nameEn:"Nine of Swords", arcana:"minor", suit:"swords", keywords:"焦虑、噩梦、忧虑", meaning:"深夜的焦虑与噩梦，被担忧所吞噬。", reversedMeaning:"克服焦虑，寻求帮助，面对恐惧。" },
    { id:59, name:"宝剑十", nameEn:"Ten of Swords", arcana:"minor", suit:"swords", keywords:"终结、毁灭、谷底", meaning:"最黑暗的时刻已经过去，谷底之后是新生。", reversedMeaning:"绝处逢生，浴火重生，否极泰来。" },
    { id:60, name:"宝剑侍从", nameEn:"Page of Swords", arcana:"minor", suit:"swords", keywords:"好奇、沟通、警觉", meaning:"充满好奇心的探索者，渴望知识与交流。", reversedMeaning:"八卦，说话不经大脑，信息错误。" },
    { id:61, name:"宝剑骑士", nameEn:"Knight of Swords", arcana:"minor", suit:"swords", keywords:"行动、果断、急速", meaning:"勇往直前的行动力，果断但不计后果。", reversedMeaning:"冲动鲁莽，急躁行事，缺乏策略。" },
    { id:62, name:"宝剑王后", nameEn:"Queen of Swords", arcana:"minor", suit:"swords", keywords:"清晰、独立、公正", meaning:"独立思考，以客观公正的态度看待事物。", reversedMeaning:"冷酷无情，尖酸刻薄，过度理性。" },
    { id:63, name:"宝剑国王", nameEn:"King of Swords", arcana:"minor", suit:"swords", keywords:"权威、理性、真理", meaning:"以清晰的理性与智慧行使权威，追求真理。", reversedMeaning:"滥用权力，独断专行，冷酷无情。" },
    // ===== 小阿尔卡纳 - 星币组 Pentacles (64-77) =====
    { id:64, name:"星币王牌", nameEn:"Ace of Pentacles", arcana:"minor", suit:"pentacles", keywords:"财富、开始、机会", meaning:"财务上的新开始，实际的机会降临。", reversedMeaning:"错失机会，财务计划不佳，延迟。" },
    { id:65, name:"星币二", nameEn:"Two of Pentacles", arcana:"minor", suit:"pentacles", keywords:"平衡、适应、多任务", meaning:"在多重事务之间保持平衡，灵活应对变化。", reversedMeaning:"失去平衡，财务压力，不堪重负。" },
    { id:66, name:"星币三", nameEn:"Three of Pentacles", arcana:"minor", suit:"pentacles", keywords:"团队、合作、技能", meaning:"团队协作，学习技能，共同努力达成目标。", reversedMeaning:"缺乏团队精神，技能不足，合作不佳。" },
    { id:67, name:"星币四", nameEn:"Four of Pentacles", arcana:"minor", suit:"pentacles", keywords:"保守、节俭、控制", meaning:"紧紧抓住已有的财富，保守与安全。", reversedMeaning:"过度节俭，吝啬，害怕失去。" },
    { id:68, name:"星币五", nameEn:"Five of Pentacles", arcana:"minor", suit:"pentacles", keywords:"贫困、匮乏、孤立", meaning:"物质或精神上的匮乏，感到被排斥在外。", reversedMeaning:"恢复，找到帮助，改善状况。" },
    { id:69, name:"星币六", nameEn:"Six of Pentacles", arcana:"minor", suit:"pentacles", keywords:"慷慨、慈善、分享", meaning:"给予与接受的平衡，慷慨分享财富。", reversedMeaning:"不平等，依赖他人，债务问题。" },
    { id:70, name:"星币七", nameEn:"Seven of Pentacles", arcana:"minor", suit:"pentacles", keywords:"投资、耐心、等待", meaning:"等待努力的成果，审视投资的回报。", reversedMeaning:"浪费努力，缺乏回报，急于求成。" },
    { id:71, name:"星币八", nameEn:"Eight of Pentacles", arcana:"minor", suit:"pentacles", keywords:"勤奋、技能、专注", meaning:"专注于提升技能，勤奋工作，精益求精。", reversedMeaning:"马虎工作，缺乏专注，技能不足。" },
    { id:72, name:"星币九", nameEn:"Nine of Pentacles", arcana:"minor", suit:"pentacles", keywords:"奢华、自律、独立", meaning:"通过努力获得丰硕成果，享受独立与奢华。", reversedMeaning:"过度依赖，财务损失，表面光鲜。" },
    { id:73, name:"星币十", nameEn:"Ten of Pentacles", arcana:"minor", suit:"pentacles", keywords:"财富、传承、家庭", meaning:"世代相传的财富与家族繁荣。", reversedMeaning:"家庭财务问题，传承断裂，失去遗产。" },
    { id:74, name:"星币侍从", nameEn:"Page of Pentacles", arcana:"minor", suit:"pentacles", keywords:"学习、实践、勤奋", meaning:"脚踏实地的学习与实践，新的财务机会。", reversedMeaning:"拖延学习，不切实际，缺乏计划。" },
    { id:75, name:"星币骑士", nameEn:"Knight of Pentacles", arcana:"minor", suit:"pentacles", keywords:"踏实、可靠、勤奋", meaning:"勤勤恳恳，一步一个脚印，可靠而负责。", reversedMeaning:"停滞不前，过于保守，缺乏热情。" },
    { id:76, name:"星币王后", nameEn:"Queen of Pentacles", arcana:"minor", suit:"pentacles", keywords:"实际、关爱、丰饶", meaning:"实际而温暖的女性形象，带来丰饶与安定。", reversedMeaning:"疏忽家庭，过度物质，不安全感。" },
    { id:77, name:"星币国王", nameEn:"King of Pentacles", arcana:"minor", suit:"pentacles", keywords:"成功、财富、领导", meaning:"物质成功的象征，稳健的领导者，财富的守护者。", reversedMeaning:"贪婪，挥霍无度，僵化固执。" }
];

// 生成洗牌并随机正逆位的卡牌
function getShuffledCards() {
    var cards = ALL_TAROT_CARDS.slice();
    // Fisher-Yates 洗牌
    for (var i = cards.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = cards[i];
        cards[i] = cards[j];
        cards[j] = tmp;
    }
    // 随机正逆位
    for (var k = 0; k < cards.length; k++) {
        cards[k].reversed = Math.random() > 0.5;
    }
    return cards;
}
