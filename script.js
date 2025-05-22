// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyBEOccqbXfH-5thI4Aa2cM737LNRTVe-LE",
    authDomain: "qna2-49eb3.firebaseapp.com",
    projectId: "qna2-49eb3",
    storageBucket: "qna2-49eb3.firebasestorage.app",
    messagingSenderId: "12846370883",
    appId: "1:12846370883:web:44dd252780fa99cfd0c4f6"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM 요소
const questionForm = document.getElementById('questionForm');
const questionsList = document.getElementById('questionsList');

// 질문 폼 제출 이벤트 처리
questionForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const subject = document.getElementById('subject').value;
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    
    try {
        await db.collection('questions').add({
            subject: subject,
            title: title,
            content: content,
            date: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        questionForm.reset();
        showMessage('질문이 등록되었습니다.', 'success');
    } catch (error) {
        showMessage(error.message, 'error');
    }
});

// 메시지 표시 함수
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    document.querySelector('.container').appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

// 질문 목록 표시 함수
function displayQuestions() {
    db.collection('questions')
        .orderBy('date', 'desc')
        .onSnapshot((snapshot) => {
            questionsList.innerHTML = '';
            
            snapshot.forEach((doc) => {
                const question = doc.data();
                const questionElement = document.createElement('div');
                questionElement.className = 'question-item';
                questionElement.innerHTML = `
                    <div class="question-header">
                        <span class="question-subject">${question.subject}</span>
                        <span class="question-date">${question.date ? question.date.toDate().toLocaleString() : '날짜 없음'}</span>
                    </div>
                    <h3 class="question-title">${question.title}</h3>
                    <p class="question-content">${question.content}</p>
                    
                    <div class="answer-list" id="answers-${doc.id}">
                        <!-- 답변이 여기에 동적으로 추가됩니다 -->
                    </div>
                    
                    <div class="answer-form">
                        <textarea placeholder="답변을 작성하세요..." id="answer-${doc.id}"></textarea>
                        <button onclick="addAnswer('${doc.id}')">답변 등록</button>
                    </div>
                `;
                
                questionsList.appendChild(questionElement);
                displayAnswers(doc.id);
            });
        });
}

// 답변 표시 함수
function displayAnswers(questionId) {
    db.collection('questions')
        .doc(questionId)
        .collection('answers')
        .orderBy('date', 'asc')
        .onSnapshot((snapshot) => {
            const answersList = document.getElementById(`answers-${questionId}`);
            answersList.innerHTML = '';
            
            snapshot.forEach((doc) => {
                const answer = doc.data();
                const answerElement = document.createElement('div');
                answerElement.className = 'answer-item';
                answerElement.innerHTML = `
                    <p>${answer.content}</p>
                    <small>${answer.date ? answer.date.toDate().toLocaleString() : '날짜 없음'}</small>
                `;
                answersList.appendChild(answerElement);
            });
        });
}

// 답변 추가 함수
async function addAnswer(questionId) {
    const answerText = document.getElementById(`answer-${questionId}`).value;
    if (!answerText.trim()) return;
    
    try {
        await db.collection('questions')
            .doc(questionId)
            .collection('answers')
            .add({
                content: answerText,
                date: firebase.firestore.FieldValue.serverTimestamp()
            });
        
        document.getElementById(`answer-${questionId}`).value = '';
        showMessage('답변이 등록되었습니다.', 'success');
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// 초기 질문 목록 표시
displayQuestions(); 
