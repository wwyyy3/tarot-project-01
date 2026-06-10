// ===== 阶段管理 =====
const Stage = { GEMS: 'gems', PROMPT: 'prompt', FAN: 'fan', QUESTION: 'question', ANSWER: 'answer' };
let currentStage = Stage.GEMS;
let shuffledCards = [];
let selectedIndices = new Set();
let pickOrder = [];
let selectedCards = [];

// ===== DOM 引用 =====
const gemStage = document.getElementById('gemStage');
const promptStage = document.getElementById('promptStage');
const fanStage = document.getElementById('fanStage');
const questionStage = document.getElementById('questionStage');
const answerStage = document.getElementById('answerStage');
const shuffleStartBtn = document.getElementById('shuffleStartBtn');
const fanContainer = document.getElementById('fanContainer');
const fanCounter = document.getElementById('fanCounter');
const reshuffleBtn = document.getElementById('reshuffleBtn');
const confirmBtn = document.getElementById('confirmBtn');
const questionInput = document.getElementById('questionInput');
const apiKeyInput = document.getElementById('apiKeyInput');
const askBtn = document.getElementById('askBtn');
const answerLoading = document.getElementById('answerLoading');
const answerContent = document.getElementById('answerContent');
const answerQuestion = document.getElementById('answerQuestion');
const selectedCardsReview = document.getElementById('selectedCardsReview');
const resetBtn = document.getElementById('resetBtn');
const apiKeyEye = document.getElementById('apiKeyEye');

// ===== API Key 可见性切换 =====
var eyeVisible = false;
apiKeyEye.addEventListener('click', function() {
    eyeVisible = !eyeVisible;
    apiKeyInput.type = eyeVisible ? 'text' : 'password';
    apiKeyEye.innerHTML = eyeVisible ? '🙈' : '👁';
});

// ===== 宝石阶段 → 思考提示阶段 =====
window._gemTimeout = setTimeout(function() {
    if (currentStage !== Stage.GEMS) return;
    gemStage.classList.add('hidden');
    promptStage.classList.remove('hidden');
    currentStage = Stage.PROMPT;
}, 4500);

gemStage.addEventListener('click', function() {
    clearTimeout(window._gemTimeout);
    gemStage.classList.add('hidden');
    promptStage.classList.remove('hidden');
    currentStage = Stage.PROMPT;
});

// ===== 本地洗牌（纯前端，无需后端） =====
function loadShuffledCards() {
    shuffledCards = getShuffledCards();
    renderFan(shuffledCards);
}

// ===== 开始洗牌 =====
shuffleStartBtn.addEventListener('click', function() {
    clearTimeout(window._gemTimeout);
    promptStage.classList.add('hidden');
    currentStage = Stage.FAN;
    fanStage.classList.remove('hidden');
    loadShuffledCards();
});

reshuffleBtn.addEventListener('click', function() {
    if (currentStage !== Stage.FAN) return;
    reshuffleBtn.disabled = true;
    reshuffleBtn.textContent = '洗牌中...';
    loadShuffledCards();
    reshuffleBtn.disabled = false;
    reshuffleBtn.textContent = '重新洗牌';
});

// ===== 扇形布局参数 =====
var FAN_ARC = 120;
var FAN_RADIUS = 460;
var FAN_BASE_Y = 0;
var ROW_Y = -520;
var ROW_GAP = 90;

function getFanTransform(index, total) {
    var t = total <= 1 ? 0 : (index / (total - 1)) * 2 - 1;
    var halfAngle = FAN_ARC / 2;
    var angle = t * halfAngle;
    var angleRad = angle * Math.PI / 180;
    var xOffset = FAN_RADIUS * Math.sin(angleRad);
    var yOffset = FAN_RADIUS * Math.cos(angleRad);
    var rotation = angle;
    var tx = 'translateX(calc(-50% + ' + xOffset.toFixed(1) + 'px))';
    var yShift = Math.round(FAN_RADIUS * 0.15);
    var ty = 'translateY(calc(-' + yOffset.toFixed(1) + 'px + ' + yShift + 'px))';
    var rot = 'rotate(' + rotation.toFixed(1) + 'deg)';
    return { transform: tx + ' ' + ty + ' ' + rot, angle: rotation, x: xOffset, y: yOffset };
}

function getRowTransform(selIdx, totalSelected) {
    var totalW = (totalSelected - 1) * ROW_GAP;
    var startX = -totalW / 2;
    var x = startX + selIdx * ROW_GAP;
    return 'translateX(calc(-50% + ' + x.toFixed(1) + 'px)) translateY(' + ROW_Y + 'px) rotate(0deg)';
}

function updateFanLayout() {
    if (currentStage !== Stage.FAN) return;
    var displayOrder = Array.from(selectedIndices);
    displayOrder.sort(function(a, b) {
        return pickOrder.indexOf(a) - pickOrder.indexOf(b);
    });
    var total = shuffledCards.length;
    var allCards = fanContainer.querySelectorAll('.fan-card');
    var hasSelection = displayOrder.length >= 3;

    allCards.forEach(function(el, i) {
        var selPos = displayOrder.indexOf(i);
        if (selPos >= 0) {
            el.style.transform = getRowTransform(selPos, displayOrder.length);
            el.style.zIndex = 100 + selPos;
            el.classList.add('selected');
            el.classList.remove('dimmed');
        } else {
            el.style.transform = getFanTransform(i, total).transform;
            el.style.zIndex = Math.floor(i);
            el.classList.remove('selected');
            if (hasSelection) {
                el.classList.add('dimmed');
            } else {
                el.classList.remove('dimmed');
            }
        }
    });
}

// ===== 渲染扇形 =====
function renderFan(cards) {
    fanContainer.innerHTML = '';
    selectedIndices.clear();
    pickOrder = [];
    selectedCards = [];
    fanCounter.textContent = '已选 0 张';
    confirmBtn.disabled = true;
    document.getElementById('selectedRowCards').innerHTML = '';

    var total = cards.length;
    var isMobile = window.innerWidth <= 768;
    var isSmall = window.innerWidth <= 520;

    if (isSmall) {
        var vh = window.innerHeight;
        var scaleFromHeight = Math.min(1, vh / 700);
        FAN_ARC = 100;
        FAN_RADIUS = Math.round(280 * scaleFromHeight);
        ROW_GAP = Math.round(55 * scaleFromHeight);
    } else if (isMobile) {
        var vh = window.innerHeight;
        var scaleFromHeight = Math.min(1, vh / 750);
        FAN_ARC = 110;
        FAN_RADIUS = Math.round(340 * scaleFromHeight);
        ROW_GAP = Math.round(72 * scaleFromHeight);
    } else {
        var vh = window.innerHeight;
        var vw = window.innerWidth;
        var scaleFromHeight = Math.min(1, vh / 800);
        FAN_ARC = 120;
        FAN_RADIUS = Math.min(Math.round(vw * 0.38), Math.round(460 * scaleFromHeight));
        ROW_GAP = Math.round(90 * scaleFromHeight);
    }
    FAN_BASE_Y = 0;
    ROW_Y = Math.round(-FAN_RADIUS * 0.4);

    var cardW = isSmall ? 36 : (isMobile ? 48 : 62);
    var cardH = Math.round(cardW * 1.56);

    cards.forEach(function(card, i) {
        var fanPos = getFanTransform(i, total);
        var el = document.createElement('div');
        el.className = 'fan-card';
        el.dataset.index = i;
        el.style.transform = fanPos.transform;
        el.style.zIndex = Math.floor(i);
        el.style.width = cardW + 'px';
        el.style.height = cardH + 'px';

        var back = document.createElement('div');
        back.className = 'fan-card-back';
        el.appendChild(back);

        el.addEventListener('click', function() { toggleCardSelection(i, el); });
        fanContainer.appendChild(el);

        el.style.opacity = '0';
        requestAnimationFrame(function() {
            el.classList.add('entered');
            el.style.opacity = '1';
        });
    });
}

// ===== 切换卡牌选择 =====
function toggleCardSelection(index, el) {
    if (selectedIndices.has(index)) {
        selectedIndices.delete(index);
        pickOrder = pickOrder.filter(function(i) { return i !== index; });
    } else {
        if (selectedIndices.size >= 3) return;
        selectedIndices.add(index);
        pickOrder.push(index);
    }
    updateFanLayout();
    updateSelectionUI();
}

function updateSelectionUI() {
    var count = selectedIndices.size;
    fanCounter.textContent = '已选 ' + count + ' / 3 张';
    confirmBtn.disabled = count === 0;
    selectedCards = Array.from(selectedIndices).map(function(i) { return shuffledCards[i]; });
    document.getElementById('selectedRowCards').innerHTML = '';
}

// ===== 确认选择 → 提问 =====
confirmBtn.addEventListener('click', function() {
    if (selectedCards.length === 0) return;
    fanStage.classList.add('hidden');
    questionStage.classList.remove('hidden');
    currentStage = Stage.QUESTION;
});

// ===== 返回选牌 =====
document.getElementById('backToSelectBtn').addEventListener('click', function() {
    if (currentStage !== Stage.QUESTION) return;
    questionStage.classList.add('hidden');
    fanStage.classList.remove('hidden');
    currentStage = Stage.FAN;
});

// ===== 提交提问 → 直接调 DeepSeek API =====
askBtn.addEventListener('click', async function() {
    var question = questionInput.value.trim();
    var apiKey = apiKeyInput.value.trim();
    if (!question) {
        questionInput.focus();
        questionInput.style.borderColor = '#e74c3c';
        setTimeout(function() { questionInput.style.borderColor = ''; }, 1500);
        return;
    }
    if (!apiKey) {
        apiKeyInput.focus();
        apiKeyInput.style.borderColor = '#e74c3c';
        setTimeout(function() { apiKeyInput.style.borderColor = ''; }, 1500);
        return;
    }

    // 清理 API Key：剔除所有非 ASCII 字符（浏览器 Header 仅允许 ISO-8859-1）
    apiKey = apiKey.replace(/[^\x00-\x7F]/g, '').trim();
    if (!apiKey) {
        apiKeyInput.focus();
        apiKeyInput.style.borderColor = '#e74c3c';
        apiKeyInput.value = '';
        apiKeyInput.placeholder = 'API Key 包含无效字符，请重新输入';
        setTimeout(function() { apiKeyInput.style.borderColor = ''; apiKeyInput.placeholder = 'sk-...'; }, 3000);
        return;
    }

    askBtn.disabled = true;
    askBtn.classList.add('loading');
    askBtn.querySelector('span:last-child').textContent = '请稍候...';

    // 构建 prompt
    var prompt = '# Role: 顶级神秘学导师与直觉塔罗占卜师（镜鉴型）\n\n';
    prompt += '## Profile\n';
    prompt += '你是一位精通 78 张伟特塔罗牌（Rider-Waite）、卡巴拉生命之树以及荣格心理学的顶级塔罗占卜师。你不是为了迎合或安慰用户而存在的"心理按摩师"，而是一面**绝对客观、公平公正的灵魂之镜**。你的占卜风格以**"直言不讳、深度剖析、好坏并陈"**著称。你坚信只有敢于直面最深刻的混乱与不堪（阴暗面），才能迎来真正的蜕变。\n\n';
    prompt += '## Tone and Style\n';
    prompt += '- **语气**：清冷、理智、极其客观，带有不偏不倚的中立感。\n';
    prompt += '- **原则**：**拒绝糖衣炮弹，拒绝只说好话说漂亮话。** 看到优势就明确指出，看到危机、欺骗、执念、懦弱或不可行的死路，必须公平公正、一针见血地揭露出来，绝不粉饰太平。\n\n';
    prompt += '---\n\n';
    prompt += '## Workflow (占卜与解读流程)\n\n';
    prompt += '请根据用户提供的**【抽到的卡牌（包括正逆位）】**和**【提出的具体问题】**，严格按照以下四个步骤进行无偏见的深度解读：\n\n';
    prompt += '### 1. 全景俯瞰：客观能量定调\n';
    prompt += '- 抛开个人情感，用中立、客观的语言，直接定调这组牌所呈现的真实能量状态（是顺遂、胶着、混乱还是面临崩溃）。\n';
    prompt += '- 不预设立场，好就是好，坏就是坏，不掩饰任何负面信号。\n\n';
    prompt += '### 2. 牌面解构：黑白并陈，直击痛点\n';
    prompt += '- 结合问题，全面解读用户抽到的卡牌。\n';
    prompt += '- **硬性要求**：必须做到"正视光明，直面黑暗"。\n';
    prompt += '  - **好牌/正位**：指出其带来的真实资源、天赋和潜在机遇，但也要提醒其可能带来的盲目乐观或自满。\n';
    prompt += '  - **坏牌/逆位**：**必须毫无保留地剖析其代表的负面能量**。如：宝剑十的背叛与绝境、圣杯五的沉溺过去、魔鬼牌的诱惑与执念。清晰说明其对应在现实中是怎样的核心阻碍、性格缺陷、或是正在发生的危机。\n\n';
    prompt += '### 3. 灵魂刀刃：揭露盲点与潜意识阴暗面\n';
    prompt += '- 扮演最严厉的觉察者，指出用户**最不想面对的真相、正在逃避的课题或潜意识里的自我欺骗（盲点）**。\n';
    prompt += '- 用锋利但理智的语言，撕开问题表象，直击核心利益冲突或心态扭曲处。\n\n';
    prompt += '### 4. 破局路径：基于现实的冷静重塑\n';
    prompt += '- 根据牌面的综合走向，给出 3 条**绝对务实、清醒且可落地的行动建议**。\n';
    prompt += '- 如果牌面显示是一条死路或错误的坚持，请直接给出"及时止损"或"推倒重来"的硬核建议，不做无谓的虚假希望包装。\n\n';
    prompt += '---\n\n';
    prompt += '## Constraints (严格限制条件)\n';
    prompt += '1. **绝对禁令**：严禁为了迎合用户的期待而曲解牌意。如果牌意很差，必须如实告知，不得含糊其辞、顾左右而言他。\n';
    prompt += '2. **拒绝恐吓，但拒绝粉饰**：不为了吓唬而吓唬，但绝不对负面信息进行温和化或合理化处理。用最平静的语气，说最深刻、最真实的局势。\n\n';
    prompt += '---\n\n';
    prompt += '## 用户的问题：\n' + question + '\n\n';
    prompt += '## 抽到的卡牌（按抽取顺序）：\n';
    for (var i = 0; i < selectedCards.length; i++) {
        var c = selectedCards[i];
        var orientation = c.reversed ? '逆位' : '正位';
        prompt += (i + 1) + '. ' + c.name + ' (' + c.nameEn + ') - ' + orientation + '\n';
        prompt += '   关键词：' + c.keywords + '\n';
        prompt += '   牌义：' + (orientation === '正位' ? c.meaning : c.reversedMeaning) + '\n\n';
    }
    prompt += '请严格按照上述 Workflow 的四个步骤逐一进行解读。请使用 Markdown 格式组织内容，包含清晰的小标题、列表和重点加粗。';

    var cardData = selectedCards.map(function(c) {
        return {
            name: c.name,
            nameEn: c.nameEn,
            arcana: c.arcana,
            suit: c.suit,
            keywords: c.keywords,
            meaning: c.meaning,
            reversedMeaning: c.reversedMeaning,
            reversed: c.reversed
        };
    });

    questionStage.classList.add('hidden');
    answerStage.classList.remove('hidden');
    currentStage = Stage.ANSWER;

    answerQuestion.textContent = question;
    renderSelectedCardsReview(selectedCards);

    answerLoading.classList.remove('hidden');
    answerContent.classList.add('hidden');
    answerContent.innerHTML = '';

    // 等待期间轮播安抚文字
    var loadingMsgs = document.querySelectorAll('#loadingMessages .loading-msg');
    var msgIndex = 0;
    // 先激活第一条，确保第一条可见
    loadingMsgs.forEach(function(m, i) { m.classList.toggle('active', i === 0); });
    var msgTimer = setInterval(function() {
        loadingMsgs[msgIndex].classList.remove('active');
        msgIndex = (msgIndex + 1) % loadingMsgs.length;
        loadingMsgs[msgIndex].classList.add('active');
    }, 2500);

    try {
        var body = JSON.stringify({
            model: 'deepseek-chat',
            temperature: 0.8,
            messages: [
                { role: 'system', content: '你是塔罗牌占卜师，作为一面绝对客观公正的灵魂之镜，请严格按照用户指令中的 Workflow 四步骤进行解读，不使用糖衣炮弹，好坏并陈。' },
                { role: 'user', content: prompt }
            ]
        });

        var res = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: body
        });

        clearInterval(msgTimer);
        answerLoading.classList.add('hidden');
        answerContent.classList.remove('hidden');

        if (res.ok) {
            var data = await res.json();
            var responseText = (data.choices && data.choices[0] && data.choices[0].message)
                ? data.choices[0].message.content
                : '未能获取到解读内容。';
            answerContent.innerHTML = renderMarkdown(responseText);
        } else {
            var errData = await res.json().catch(function() { return {}; });
            answerContent.textContent = '解读失败：' + (errData.error && errData.error.message ? errData.error.message : 'HTTP ' + res.status);
        }
    } catch (err) {
        clearInterval(msgTimer);
        answerLoading.classList.add('hidden');
        answerContent.classList.remove('hidden');
        answerContent.textContent = '网络错误：' + err.message + '（可能是跨域限制，请尝试 GitHub Pages 或本地运行）';
    }

    askBtn.disabled = false;
    askBtn.classList.remove('loading');
    askBtn.querySelector('span:last-child').textContent = '开始占卜';
});

// ===== 轻量 Markdown 渲染 =====
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderInlineMarkdown(text) {
    return escapeHtml(text)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function renderMarkdown(markdown) {
    var lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n');
    var html = '';
    var inList = false;

    function closeList() {
        if (inList) { html += '</ul>'; inList = false; }
    }

    lines.forEach(function(line) {
        var trimmed = line.trim();
        if (!trimmed) { closeList(); return; }

        var heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
        if (heading) {
            closeList();
            var level = heading[1].length + 1;
            html += '<h' + level + '>' + renderInlineMarkdown(heading[2]) + '</h' + level + '>';
            return;
        }

        var bullet = trimmed.match(/^[-*]\s+(.+)$/);
        if (bullet) {
            if (!inList) { html += '<ul>'; inList = true; }
            html += '<li>' + renderInlineMarkdown(bullet[1]) + '</li>';
            return;
        }

        closeList();
        html += '<p>' + renderInlineMarkdown(trimmed) + '</p>';
    });

    closeList();
    return html;
}

// ===== 渲染选中卡牌回顾 =====
function renderSelectedCardsReview(cards) {
    selectedCardsReview.innerHTML = '';
    cards.forEach(function(card) {
        var el = document.createElement('div');
        el.className = 'review-card';
        var name = document.createElement('div');
        name.className = 'review-name';
        name.textContent = card.name;
        el.appendChild(name);
        if (card.reversed) {
            var rev = document.createElement('div');
            rev.className = 'review-reversed';
            rev.textContent = '逆位';
            el.appendChild(rev);
        }
        selectedCardsReview.appendChild(el);
    });
}

// ===== 重新占卜 =====
resetBtn.addEventListener('click', function() {
    selectedIndices.clear();
    pickOrder = [];
    selectedCards = [];
    shuffledCards = [];
    questionInput.value = '';
    apiKeyInput.value = '';

    answerStage.classList.add('hidden');
    gemStage.classList.remove('hidden');
    currentStage = Stage.GEMS;
    document.getElementById('selectedRowCards').innerHTML = '';

    clearTimeout(window._gemTimeout);
    window._gemTimeout = setTimeout(function() {
        gemStage.classList.add('hidden');
        promptStage.classList.remove('hidden');
        currentStage = Stage.PROMPT;
    }, 4500);
});

// ===== 窗口 resize =====
var resizeTimeout;
window.addEventListener('resize', function() {
    if (currentStage === Stage.FAN && shuffledCards.length > 0) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            var savedSelected = new Set(selectedIndices);
            var savedPickOrder = pickOrder.slice();
            renderFan(shuffledCards);
            selectedIndices = savedSelected;
            pickOrder = savedPickOrder;
            selectedCards = Array.from(selectedIndices).map(function(i) { return shuffledCards[i]; });
            updateFanLayout();
            updateSelectionUI();
        }, 300);
    }
});
