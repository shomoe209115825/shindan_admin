// 質問データ（カテゴリごとに分類）
const questions = {
    problemSolving: [
        "新しい問題に直面した時、まず状況を整理してから行動する",
        "複数の選択肢がある場合、それぞれのメリットとデメリットを比較する",
        "予期せぬ問題が発生した時、冷静に対処できる",
        "問題解決の過程で、新しいアイデアを積極的に取り入れる"
    ],
    planning: [
        "目標を達成するために、段階的な計画を立てる",
        "期限を守るために、作業の優先順位を決める",
        "長期的な目標を設定し、それに向かって努力する",
        "計画を立てる際、リスクも考慮に入れる"
    ],
    teamwork: [
        "チームの意見を尊重し、協力して作業を進める",
        "チームメンバーの意見に耳を傾け、建設的なフィードバックを提供する",
        "チームの目標達成のために、自分の役割を果たす",
        "チーム内の意見の相違を、建設的に解決する"
    ],
    communication: [
        "自分の考えを明確に伝えることができる",
        "相手の立場に立って話を聞くことができる",
        "適切なタイミングで質問や意見を述べることができる",
        "複雑な内容を分かりやすく説明することができる"
    ],
    adaptability: [
        "新しい環境や状況に素早く適応できる",
        "変化に対して柔軟に対応できる",
        "異なる意見や考え方を受け入れることができる",
        "予期せぬ状況でも落ち着いて対応できる"
    ],
    leadership: [
        "グループの目標達成のために、メンバーを導くことができる",
        "困難な状況でも、前向きな姿勢を保つことができる",
        "メンバーの強みを活かすことができる",
        "責任を持って決断を下すことができる"
    ]
};

// グローバル変数
let currentUser = null;
let currentQuestionIndex = 0;
let answers = {};
let shuffledQuestions = [];

// DOM要素
const userForm = document.getElementById('user-form');
const userInfoSection = document.getElementById('user-info');
const questionSection = document.getElementById('question-section');
const completionSection = document.getElementById('completion-section');
const questionText = document.getElementById('question-text');
const progressBar = document.getElementById('progress');
const progressText = document.getElementById('progress-text');
const ratingButtons = document.querySelectorAll('.rating-btn');
const prevButton = document.getElementById('prev-btn');

// 質問をシャッフルして配列に変換
function shuffleQuestions() {
    const allQuestions = [];
    for (const category in questions) {
        questions[category].forEach((question, index) => {
            allQuestions.push({
                text: question,
                category: category,
                index: index
            });
        });
    }
    return allQuestions.sort(() => Math.random() - 0.5);
}

// プログレスバーの更新
function updateProgress() {
    const progress = (currentQuestionIndex / shuffledQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${currentQuestionIndex}/${shuffledQuestions.length}`;
}

// 質問の表示
function showQuestion() {
    if (currentQuestionIndex < shuffledQuestions.length) {
        const question = shuffledQuestions[currentQuestionIndex];
        questionText.textContent = question.text;
        updateProgress();
        
        // 戻るボタンの表示/非表示を制御
        prevButton.disabled = currentQuestionIndex === 0;
        
        // 前回の回答があれば、その値を表示
        const category = question.category;
        const index = question.index;
        if (answers[category] && answers[category][index] !== undefined) {
            ratingButtons.forEach(btn => {
                if (parseInt(btn.dataset.value) === answers[category][index]) {
                    btn.classList.add('selected');
                } else {
                    btn.classList.remove('selected');
                }
            });
        } else {
            ratingButtons.forEach(btn => btn.classList.remove('selected'));
        }
    } else {
        showCompletion();
    }
}

// 前の質問に戻る
function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

// 回答の保存
function saveAnswer(value) {
    const question = shuffledQuestions[currentQuestionIndex];
    if (!answers[question.category]) {
        answers[question.category] = [];
    }
    answers[question.category][question.index] = value;
    currentQuestionIndex++;
    showQuestion();
}

// 完了画面の表示
function showCompletion() {
    questionSection.classList.add('hidden');
    completionSection.classList.remove('hidden');
    saveResults();
}

// 結果の保存
function saveResults() {
    const results = {
        userId: currentUser.id,
        userName: currentUser.name,
        answers: answers,
        timestamp: new Date().toISOString()
    };

    // localStorageに保存
    const allResults = JSON.parse(localStorage.getItem('assessmentResults') || '[]');
    allResults.push(results);
    localStorage.setItem('assessmentResults', JSON.stringify(allResults));
}

// イベントリスナー
userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentUser = {
        id: document.getElementById('user-id').value,
        name: document.getElementById('user-name').value
    };
    shuffledQuestions = shuffleQuestions();
    userInfoSection.classList.add('hidden');
    questionSection.classList.remove('hidden');
    showQuestion();
});

prevButton.addEventListener('click', goToPreviousQuestion);

ratingButtons.forEach(button => {
    button.addEventListener('click', () => {
        const value = parseInt(button.dataset.value);
        saveAnswer(value);
    });
}); 