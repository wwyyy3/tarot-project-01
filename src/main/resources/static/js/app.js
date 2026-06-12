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
    if (eyeVisible) {
        apiKeyEye.innerHTML = '🙈';
    } else {
        apiKeyEye.innerHTML = '👁';
    }
});
// ===== 宝石阶段 → 思考提示阶段 =====
window._gemTimeout = setTimeout(() => {
    if (currentStage !== Stage.GEMS) return;
    gemStage.classList.add('hidden');
    promptStage.classList.remove('hidden');
    currentStage = Stage.PROMPT;
}, 4500);

// 点击宝石也可以跳过
gemStage.addEventListener('click', () => {
    clearTimeout(window._gemTimeout);
    gemStage.classList.add('hidden');
    promptStage.classList.remove('hidden');
    currentStage = Stage.PROMPT;
});

async function loadShuffledCards() {
    try {
        const res = await fetch('/api/tarot/all-shuffled');
        const data = await res.json();
        shuffledCards = data.cards;
        renderFan(shuffledCards);
    } catch (err) {
        console.error('获取卡牌失败:', err);
        shuffledCards = generateFallbackCards();
        renderFan(shuffledCards);
    }
}

// ===== 开始洗牌 =====
shuffleStartBtn.addEventListener('click', async () => {
    clearTimeout(window._gemTimeout);
    promptStage.classList.add('hidden');
    currentStage = Stage.FAN;
    fanStage.classList.remove('hidden');
    await loadShuffledCards();
});

reshuffleBtn.addEventListener('click', async () => {
    if (currentStage !== Stage.FAN) return;
    reshuffleBtn.disabled = true;
    reshuffleBtn.textContent = '洗牌中...';
    await loadShuffledCards();
    reshuffleBtn.disabled = false;
    reshuffleBtn.textContent = '重新洗牌';
});

// ===== 扇形布局参数 =====
var FAN_ARC = 120;    // 扇形总张角（度），以中轴线对称
var FAN_RADIUS = 460; // 扇形半径（像素）
var FAN_BASE_Y = 0; // 扇形中心垂直偏移（负值向下移）
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
    displayOrder.sort(function(a,b) {
        return pickOrder.indexOf(a) - pickOrder.indexOf(b);
    });
    var total = shuffledCards.length;
    var allCards = fanContainer.querySelectorAll('.fan-card');
    var hasSelection = displayOrder.length >= 3;

    allCards.forEach(function(el, i) {
        var selPos = displayOrder.indexOf(i);
        if (selPos >= 0) {
            var rowTf = getRowTransform(selPos, displayOrder.length);
            el.style.transform = rowTf;
            el.style.zIndex = 100 + selPos;
            el.classList.add('selected');
            el.classList.remove('dimmed');
        } else {
            var fanPos = getFanTransform(i, total);
            el.style.transform = fanPos.transform;
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
// ===== 切换卡牌选择（飞出/飞回动画） =====
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
    selectedCards = pickOrder.map(function(i) { return shuffledCards[i]; }); // 按选中顺序：过去→现在→未来

    // 真实卡牌会飞到上方已选区；这里不复制卡面，避免出现两张同样的牌。
    var rowContainer = document.getElementById('selectedRowCards');
    rowContainer.innerHTML = '';
}

// ===== 确认选择 → 进入提问阶段 =====
confirmBtn.addEventListener('click', () => {
    if (selectedCards.length === 0) return;
    fanStage.classList.add('hidden');
    questionStage.classList.remove('hidden');
    currentStage = Stage.QUESTION;
});

// ===== 返回选牌 =====
var backToSelectBtn = document.getElementById('backToSelectBtn');
backToSelectBtn.addEventListener('click', function() {
    if (currentStage !== Stage.QUESTION) return;
    questionStage.classList.add('hidden');
    fanStage.classList.remove('hidden');
    currentStage = Stage.FAN;
});

// ===== 提交提问 =====
askBtn.addEventListener('click', async () => {
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
    loadingMsgs.forEach(function(m, i) { m.classList.toggle('active', i === 0); });
    var msgTimer = setInterval(function() {
        loadingMsgs[msgIndex].classList.remove('active');
        msgIndex = (msgIndex + 1) % loadingMsgs.length;
        loadingMsgs[msgIndex].classList.add('active');
    }, 2500);

    var MIN_LOADING_MS = 3000;
    var loadingStart = Date.now();

    var apiError = null;
    var apiResult = null;

    try {
        var res = await fetch('/api/tarot/interpret', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                apiKey: apiKey,
                question: question,
                cards: cardData
            })
        });
        var data = await res.json();

        if (data.success) {
            apiResult = data;
        } else {
            apiError = { message: data.error || '未知错误' };
        }
    } catch (err) {
        apiError = { message: '网络错误：' + err.message };
    }

    // 确保加载动画至少展示 MIN_LOADING_MS 毫秒（让用户能看到轮播文字和加载动画）
    var elapsed = Date.now() - loadingStart;
    if (elapsed < MIN_LOADING_MS) {
        await new Promise(function(resolve) { setTimeout(resolve, MIN_LOADING_MS - elapsed); });
    }

    answerLoading.classList.add('hidden');
    answerContent.classList.remove('hidden');

    if (apiError) {
        answerContent.textContent = '解读失败：' + apiError.message;
    } else {
        var responseText = '';
        try {
            var deepseek = typeof apiResult.deepseek === 'string' ? JSON.parse(apiResult.deepseek) : apiResult.deepseek;
            responseText = deepseek.choices && deepseek.choices[0] && deepseek.choices[0].message ? deepseek.choices[0].message.content : '未能获取到解读内容。';
        } catch (e) {
            responseText = '解读完成，但返回格式异常。请检查 API 密钥。';
        }
        answerContent.innerHTML = renderMarkdown(responseText);
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
        if (inList) {
            html += '</ul>';
            inList = false;
        }
    }

    lines.forEach(function(line) {
        var trimmed = line.trim();
        if (!trimmed) {
            closeList();
            return;
        }

        var heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
        if (heading) {
            closeList();
            var level = heading[1].length + 1;
            html += '<h' + level + '>' + renderInlineMarkdown(heading[2]) + '</h' + level + '>';
            return;
        }

        var bullet = trimmed.match(/^[-*]\s+(.+)$/);
        if (bullet) {
            if (!inList) {
                html += '<ul>';
                inList = true;
            }
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
resetBtn.addEventListener('click', () => {
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
    window._gemTimeout = setTimeout(() => {
        gemStage.classList.add('hidden');
        promptStage.classList.remove('hidden');
        currentStage = Stage.PROMPT;
    }, 4500);
});

// ===== 后备方案：生成降级卡牌数据 =====
function generateFallbackCards() {
    var names = ['愚人','魔术师','女祭司','女皇','皇帝','教皇','恋人','战车','力量','隐士','命运之轮','正义','倒吊人','死神','节制','恶魔','高塔','星星','月亮','太阳','审判','世界'];
    var enNames = ['The Fool','The Magician','The High Priestess','The Empress','The Emperor','The Hierophant','The Lovers','The Chariot','Strength','The Hermit','Wheel of Fortune','Justice','The Hanged Man','Death','Temperance','The Devil','The Tower','The Star','The Moon','The Sun','Judgement','The World'];
    var cards = [];
    for (var i = 0; i < 78; i++) {
        var idx = i % 22;
        cards.push({
            id: i,
            name: names[idx] + (i >= 22 ? ' ' + (Math.floor(i/22) + 1) : ''),
            nameEn: enNames[idx],
            arcana: i < 22 ? 'major' : 'minor',
            suit: '',
            keywords: '灵性、智慧、成长',
            meaning: '这是一张充满深刻意义的塔罗牌。',
            reversedMeaning: '逆时，这张牌的正面能量受到了阻碍。',
            reversed: Math.random() > 0.5
        });
    }
    return cards.sort(function() { return Math.random() - 0.5; });
}

// ===== 窗口 resize 重新渲染扇形 =====
var resizeTimeout;
window.addEventListener('resize', () => {
    if (currentStage === Stage.FAN && shuffledCards.length > 0) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            var savedSelected = new Set(selectedIndices);
            var savedPickOrder = pickOrder.slice();
            renderFan(shuffledCards);
            selectedIndices = savedSelected;
            pickOrder = savedPickOrder;
            selectedCards = pickOrder.map(function(i) { return shuffledCards[i]; }); // 按选中顺序：过去→现在→未来
            updateFanLayout();
            updateSelectionUI();
        }, 300);
    }
});
