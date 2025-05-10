// Quiz questions and options
const questions = [
    {
        question: "How often do you play games on your phone or computer just to pass time?",
        options: [
            { value: "0", label: "Never" },
            { value: "1", label: "Occasionally" },
            { value: "2", label: "Frequently" },
            { value: "3", label: "Almost constantly" }
        ]
    },
    {
        question: "When you win at a game, how does it make you feel?",
        options: [
            { value: "0", label: "Indifferent" },
            { value: "1", label: "Happy" },
            { value: "2", label: "Excited" },
            { value: "3", label: "Proud" }
        ]
    },
    {
        question: "Have you ever kept playing a game just to beat your high score or get revenge on a loss?",
        options: [
            { value: "0", label: "Never" },
            { value: "1", label: "Once or twice" },
            { value: "2", label: "Sometimes" },
            { value: "3", label: "Often" }
        ]
    },
    {
        question: "Have you ever spent real money in a game to unlock features or continue playing?",
        options: [
            { value: "0", label: "Not at all" },
            { value: "1", label: "Slightly" },
            { value: "2", label: "Moderately" },
            { value: "3", label: "Severely" }
        ]
    },
    {
        question: "Do you feel a thrill when you take risks in games or competitions?",
        options: [
            { value: "0", label: "Never" },
            { value: "1", label: "Rarely" },
            { value: "2", label: "Sometimes" },
            { value: "3", label: "Often" }
        ]
    },
    {
        question: "Have you ever placed a small bet—real or virtual—just for fun?",
        options: [
            { value: "0", label: "Never" },
            { value: "1", label: "Rarely" },
            { value: "2", label: "Sometimes" },
            { value: "3", label: "Often" }
        ]
    },
    {
        question: "Do you find yourself thinking about winning money through luck, skill, or chance-based games?",
        options: [
            { value: "0", label: "Never" },
            { value: "1", label: "Once" },
            { value: "2", label: "A few times" },
            { value: "3", label: "Multiple times" }
        ]
    },
    {
        question: "When you lose, do you feel the urge to try again immediately to win it back?",
        options: [
            { value: "0", label: "Never" },
            { value: "1", label: "Once" },
            { value: "2", label: "A few times" },
            { value: "3", label: "Regularly" }
        ]
    },
    {
        question: "Have you ever told someone you were playing a game, but you were actually gambling?",
        options: [
            { value: "0", label: "Never" },
            { value: "1", label: "Occasionally" },
            { value: "2", label: "Frequently" },
            { value: "3", label: "Almost always" }
        ]
    },
    {
        question: "Do you feel in control of your gambling habits—or are they starting to control you?",
        options: [
            { value: "0", label: "Never" },
            { value: "1", label: "Occasionally" },
            { value: "2", label: "Frequently" },
            { value: "3", label: "Almost always" }
        ]
    }
];

// Quiz state
let currentQuestion = 0;
let answers = Array(questions.length).fill("");

// DOM elements
const quizCard = document.getElementById('quiz-card');
const resultsCard = document.getElementById('results-card');
const questionCounter = document.getElementById('question-counter');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const quizProgress = document.getElementById('quiz-progress');

// Initialize quiz
function initQuiz() {
    if (!quizCard) return;
    loadQuestion();
    prevBtn.addEventListener('click', goToPreviousQuestion);
    nextBtn.addEventListener('click', goToNextQuestion);
}

// Load current question
function loadQuestion() {
    const question = questions[currentQuestion];
    questionText.textContent = question.question;
    questionCounter.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    quizProgress.style.width = `${progress}%`;
    
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionItem = document.createElement('div');
        optionItem.className = `option-item ${answers[currentQuestion] === option.value ? 'selected' : ''}`;
        optionItem.innerHTML = `
            <input type="radio" id="option-${index}" name="quiz-option" class="radio-input" value="${option.value}" ${answers[currentQuestion] === option.value ? 'checked' : ''}>
            <label for="option-${index}">${option.label}</label>
        `;
        optionsContainer.appendChild(optionItem);
        optionItem.addEventListener('click', () => selectOption(option.value));
    });

    prevBtn.disabled = currentQuestion === 0;
    nextBtn.disabled = !answers[currentQuestion];
    nextBtn.innerHTML = currentQuestion === questions.length - 1 ? 'See Results' : 'Next <i class="fas fa-arrow-right"></i>';
}

// Select an option
function selectOption(value) {
    answers[currentQuestion] = value;
    const optionItems = optionsContainer.querySelectorAll('.option-item');
    optionItems.forEach(item => {
        const input = item.querySelector('input');
        if (input.value === value) {
            item.classList.add('selected');
            input.checked = true;
        } else {
            item.classList.remove('selected');
            input.checked = false;
        }
    });
    nextBtn.disabled = false;
}

// Go to previous question
function goToPreviousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

// Go to next question or show results
function goToNextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        showResults();
    }
}

// Show results
function showResults() {
    const score = answers.reduce((total, answer) => total + parseInt(answer || "0"), 0);
    
    let category, description, iconClass;
    if (score <= 5) {
        category = "Low Risk";
        description = "Your gambling habits appear to be under control. Continue to be mindful of your gambling activities.";
        iconClass = "fas fa-check-circle text-success";
    } else if (score <= 15) {
        category = "Moderate Risk";
        description = "You may be developing some problematic gambling behaviors. Consider setting limits on your gambling activities.";
        iconClass = "fas fa-exclamation-circle text-warning";
    } else {
        category = "High Risk";
        description = "Your gambling habits suggest a potential gambling disorder. We strongly recommend seeking professional help.";
        iconClass = "fas fa-exclamation-triangle text-danger";
    }

    document.getElementById('result-category').textContent = category;
    document.getElementById('result-score').textContent = score;
    document.getElementById('result-description').textContent = description;
    document.getElementById('result-icon').innerHTML = `<i class="${iconClass}"></i>`;

    resultsCard.className = 'card results-card';
    if (score <= 5) {
        resultsCard.classList.add('success-result');
    } else if (score <= 15) {
        resultsCard.classList.add('warning-result');
    } else {
        resultsCard.classList.add('danger-result');
    }

    quizCard.style.display = 'none';
    resultsCard.style.display = 'block';
}

// Start quiz
if (document.querySelector('.quiz-section')) {
    initQuiz();
}
