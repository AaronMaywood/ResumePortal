// DOM要素の取得
const consentCheckbox = document.getElementById('consent-checkbox');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');
const inputHint = document.getElementById('input-hint');
const termsToggles = document.querySelectorAll('.terms-toggle');

// 利用規約の折りたたみ機能
termsToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const contentId = toggle.getAttribute('aria-controls');
        const content = document.getElementById(contentId);
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            content.style.display = 'none';
            toggle.setAttribute('aria-expanded', 'false');
        } else {
            content.style.display = 'block';
            toggle.setAttribute('aria-expanded', 'true');
        }
    });
});

// チェックボックスの状態に応じてチャット機能を有効/無効化
consentCheckbox.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    
    if (isChecked) {
        chatInput.disabled = false;
        sendButton.disabled = false;
        inputHint.textContent = 'メッセージを入力して送信してください';
        inputHint.style.color = '#667eea';
    } else {
        chatInput.disabled = true;
        sendButton.disabled = true;
        inputHint.textContent = '利用規約に同意するとチャットが利用できます';
        inputHint.style.color = '#999';
    }
});

// テキストエリアの自動リサイズ
chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
});

// Enterキーで送信（Shift+Enterで改行）
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!sendButton.disabled) {
            sendMessage();
        }
    }
});

// 送信ボタンのクリックイベント
sendButton.addEventListener('click', sendMessage);

// メッセージ送信関数
function sendMessage() {
    const message = chatInput.value.trim();
    
    if (!message || sendButton.disabled) {
        return;
    }
    
    // ユーザーメッセージを表示
    addMessage(message, 'user');
    
    // 入力欄をクリア
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    // 送信ボタンを無効化（連続送信防止）
    sendButton.disabled = true;
    sendButton.textContent = '送信中...';
    
    // モックAPI呼び出し
    simulateAIResponse(message);
}

// メッセージを追加する関数
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${escapeHtml(text)}</p>
            </div>
            <div class="message-time">${timeString}</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <p>${escapeHtml(text)}</p>
            </div>
            <div class="message-time">${timeString}</div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// HTMLエスケープ関数
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// チャットを最下部にスクロール
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// モックAI応答をシミュレート
function simulateAIResponse(userMessage) {
    // 1-2秒のランダムな遅延でAPI呼び出しをシミュレート
    const delay = 1000 + Math.random() * 1000;
    
    setTimeout(() => {
        const response = generateMockResponse(userMessage);
        addMessage(response, 'ai');
        
        // 送信ボタンを再有効化
        sendButton.disabled = false;
        sendButton.innerHTML = '<span>送信</span>';
        chatInput.focus();
    }, delay);
}

// モック応答を生成する関数
function generateMockResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // 自己PR関連のキーワードを検出
    if (lowerMessage.includes('自己pr') || lowerMessage.includes('自己pr文') || 
        lowerMessage.includes('pr文') || lowerMessage.includes('pr') ||
        lowerMessage.includes('つくって') || lowerMessage.includes('作成') ||
        lowerMessage.includes('作って') || lowerMessage.includes('生成')) {
        
        return `自己PR文を作成するために、以下の情報を教えていただけますか？

1. あなたの強みや特技
2. これまでの経験や実績
3. 志望動機や目標
4. 具体的なエピソード（あれば）

これらの情報を基に、効果的な自己PR文を作成いたします。例えば、「私はチームワークを大切にし、前職ではプロジェクトリーダーとして10名のチームをまとめ、売上を20%向上させました」のような具体的な情報があると、より魅力的な自己PR文を作成できます。`;
    }
    
    // 強みや経験について聞かれた場合
    if (lowerMessage.includes('強み') || lowerMessage.includes('特技') || 
        lowerMessage.includes('経験') || lowerMessage.includes('スキル')) {
        
        return `素晴らしいですね！その強みや経験を活かした自己PR文を作成しましょう。

具体的には、以下のような構成で自己PR文を作成することをお勧めします：

【構成例】
1. 結論（あなたの強みを一言で）
2. 具体的なエピソードや実績
3. その経験から学んだこと
4. 今後の目標や志望動機との関連

より詳しい情報があれば、それも含めて作成いたします。`;
    }
    
    // 例やサンプルを求められた場合
    if (lowerMessage.includes('例') || lowerMessage.includes('サンプル') || 
        lowerMessage.includes('見本') || lowerMessage.includes('参考')) {
        
        return `自己PR文の例をご紹介します：

【例1：チームワーク】
「私はチームワークを大切にし、前職ではプロジェクトリーダーとして10名のチームをまとめ、売上を20%向上させました。この経験から、コミュニケーション能力とリーダーシップを身につけました。貴社でも、この力を活かして貢献したいと考えています。」

【例2：問題解決能力】
「私は問題解決能力に自信があります。前職では、顧客満足度が低下していた課題を分析し、新たなサービスを提案して実装しました。その結果、顧客満足度が30%向上しました。貴社でも、この問題解決力を活かして成長に貢献したいです。」

あなたの経験に合わせて、カスタマイズした自己PR文を作成いたします。`;
    }
    
    // 挨拶や感謝の言葉
    if (lowerMessage.includes('ありがとう') || lowerMessage.includes('感謝') || 
        lowerMessage.includes('助かり') || lowerMessage.includes('ありがと')) {
        
        return `どういたしまして！お役に立てて嬉しいです。

他にも自己PR文に関してご質問やご要望があれば、お気軽にお聞かせください。例えば：
- より具体的な表現にしたい
- 文字数を調整したい
- 別の角度から書いてみたい

など、何でもお手伝いします！`;
    }
    
    // デフォルトの応答
    return `ありがとうございます。自己PR文の作成をお手伝いします。

以下のような情報を教えていただけますか？
- あなたの強みや特技
- これまでの経験や実績
- 志望動機や目標
- 具体的なエピソード

これらの情報を基に、あなたに合った自己PR文を作成いたします。まずは「自己PR文をつくって」とお伝えいただければ、詳しくご案内します。`;
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    // 初期会話例の「例」ラベルを現在時刻に変更（オプション）
    // またはそのまま「例」として残す
    
    // チェックボックスの状態を確認（ローカルストレージから復元する場合）
    const savedConsent = localStorage.getItem('consent-given');
    if (savedConsent === 'true') {
        consentCheckbox.checked = true;
        consentCheckbox.dispatchEvent(new Event('change'));
    }
    
    // チェックボックスが変更されたらローカルストレージに保存
    consentCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            localStorage.setItem('consent-given', 'true');
        } else {
            localStorage.removeItem('consent-given');
        }
    });
});
