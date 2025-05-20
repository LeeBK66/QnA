// 질문 데이터를 저장할 배열
let questions = JSON.parse(localStorage.getItem('questions')) || [];

// DOM 요소
const questionForm = document.getElementById('questionForm');
const questionsList = document.getElementById('questionsList');

// 질문 폼 제출 이벤트 처리
questionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const subject = document.getElementById('subject').value;
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    
    // 새 질문 객체 생성
    const newQuestion = {
        id: Date.now(),
        subject: subject,
        title: title,
        content: content,
        answers: [],
        date: new Date().toLocaleString()
    };
    
    // 질문 배열에 추가
    questions.unshift(newQuestion);
    
    // 로컬 스토리지에 저장
    saveQuestions();
    
    // 질문 목록 업데이트
    displayQuestions();
    
    // 폼 초기화
    questionForm.reset();
});

// 질문 목록 표시 함수
function displayQuestions() {
    questionsList.innerHTML = '';
    
    questions.forEach(question => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question-item';
        questionElement.innerHTML = `
            <div class="question-header">
                <span class="question-subject">${question.subject}</span>
                <span class="question-date">${question.date}</span>
            </div>
            <h3 class="question-title">${question.title}</h3>
            <p class="question-content">${question.content}</p>
            
            <div class="answer-list">
                ${question.answers.map(answer => `
                    <div class="answer-item">
                        <p>${answer.content}</p>
                        <small>${answer.date}</small>
                    </div>
                `).join('')}
            </div>
            
            <div class="answer-form">
                <textarea placeholder="답변을 작성하세요..." id="answer-${question.id}"></textarea>
                <button onclick="addAnswer(${question.id})">답변 등록</button>
            </div>
        `;
        
        questionsList.appendChild(questionElement);
    });
}

// 답변 추가 함수
function addAnswer(questionId) {
    const answerText = document.getElementById(`answer-${questionId}`).value;
    if (!answerText.trim()) return;
    
    const question = questions.find(q => q.id === questionId);
    if (question) {
        question.answers.push({
            content: answerText,
            date: new Date().toLocaleString()
        });
        
        saveQuestions();
        displayQuestions();
    }
}

// 로컬 스토리지에 저장하는 함수
function saveQuestions() {
    localStorage.setItem('questions', JSON.stringify(questions));
}

// 초기 질문 목록 표시
displayQuestions(); 