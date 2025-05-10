// Quiz questions and options
const questions = [
    {
        question: "How often do you find yourself thinking about gambling?",
        options: [
            { value: "0", label: "Never" },
            { value: "1", label: "Occasionally" },
            { value: "2", label: "Frequently" },
            { value: "3", label: "Almost constantly" }
        ]
    },
    {
        question: "Have you ever lied to family or friends about how much you gamble?",
        options: [
            { value: "0", label: "Never" },
            { value: "1", label: "Once or twice" },
            { value: "2", label: "Sometimes" },
            { value: "3", label: "Often" }
        ]
    },
    {
        question: "Have you ever gambled more money than you intended to?",
        options: [
            { value: "0", label: "Never" },
            { value: "1", label: "Once or twice" },
            { value: "2", label: "Sometimes" },
            { value: "3", label: "Often" }
        ]
    },
    {
        question: "Do you feel restless or irritable when trying to cut down on gambling?",
        options: [
            { value: "0", label: "Not at all" },
            { value: "1", label: "Slightly" },
            { value: "2", label: "Moderately" },
            { value: "3", label: "Severely" }
        ]
    },
    {
        question: "Have you ever gambled to escape problems or relieve feelings of helplessness, guilt, anxiety, or depression?",
        options: [
            { value: "0", label: "Never" },
            { value: "1", label: "Rarely" },
            { value: "2", label: "Sometimes" },
            { value: "3", label: "Often" }
        ]
    },
    {
        question: "After losing money gambling, do you often return to get even ('chase' your losses)?",
        options: [
            { value: "0", label: "Never" },
            { value: "1", label: "Rarely" },
            { value: "2", label: "Sometimes" },
            { value: "3", label: "Often" }
        ]
    },
    {
        question: "Have you jeopardized or lost a significant relationship, job, or educational opportunity because of gambling?",
        options: [
            { value: "0", label: "Never" },
            { value: "1", label: "Once" },
            { value: "2", label: "A few times" },
            { value: "3", label: "Multiple times" }
        ]
    },
    {
        question: "Have you relied on others to provide money to relieve a desperate financial situation caused by gambling?",
        options: [
            { value: "0", label: "Never" },
            { value: "1", label: "Once" },
            { value: "2", label: "A few times" },
            { value: "3", label: "Regularly" }
        ]
    },
    {
        question: "How often have you spent more time gambling than you had planned?",
        options: [
            { value: "0", label: "Never" },
            { value: "1", label: "Occasionally" },
            { value: "2", label: "Frequently" },
            { value: "3", label: "Almost always" }
        ]
    },
    {
        question: "Have you ever felt guilty about the way you gamble or what happens when you gamble?",
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
    if (!quizCard) return; // Exit if not on quiz page
    
    loadQuestion();
    
    // Event listeners for navigation buttons
    prevBtn.addEventListener('click', goToPreviousQuestion);
    nextBtn.addEventListener('click', goToNextQuestion);
}

// Load current question
function loadQuestion() {
    const question = questions[currentQuestion];
    
    // Update question text and counter
    questionText.textContent = question.question;
    questionCounter.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    
    // Update progress bar
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    quizProgress.style.width = `${progress}%`;
    
    // Clear options container
    optionsContainer.innerHTML = '';
    
    // Add options
    question.options.forEach((option, index) => {
        const optionItem = document.createElement('div');
        optionItem.className = `option-item ${answers[currentQuestion] === option.value ? 'selected' : ''}`;
        optionItem.innerHTML = `
            <input type="radio" id="option-${index}" name="quiz-option" class="radio-input" value="${option.value}" ${answers[currentQuestion] === option.value ? 'checked' : ''}>
            <label for="option-${index}">${option.label}</label>
        `;
        optionsContainer.appendChild(optionItem);
        
        // Add click event to select option
        optionItem.addEventListener('click', () => selectOption(option.value));
    });
    
    // Update button states
    prevBtn.disabled = currentQuestion === 0;
    nextBtn.disabled = !answers[currentQuestion];
    
    // Update next button text for last question
    if (currentQuestion === questions.length - 1) {
        nextBtn.textContent = 'See Results';
    } else {
        nextBtn.textContent = 'Next';
        nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    }
}

// Select an option
function selectOption(value) {
    answers[currentQuestion] = value;
    
    // Update selected state in UI
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
    
    // Enable next button
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

// Calculate score and show results
function showResults() {
    // Calculate total score
    const score = answers.reduce((total, answer) => total + parseInt(answer || "0"), 0);
    
    // Determine result category
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
    
    // Update results card
    document.getElementById('result-category').textContent = category;
    document.getElementById('result-score').textContent = score;
    document.getElementById('result-description').textContent = description;
    document.getElementById('result-icon').innerHTML = `<i class="${iconClass}"></i>`;
    
    // Add appropriate class to results card based on risk level
    resultsCard.className = 'card results-card';
    if (score <= 5) {
        resultsCard.classList.add('success-result');
    } else if (score <= 15) {
        resultsCard.classList.add('warning-result');
    } else {
        resultsCard.classList.add('danger-result');
    }
    
    // Hide quiz card and show results card
    quizCard.style.display = 'none';
    resultsCard.style.display = 'block';
}

// Initialize quiz if on quiz page
if (document.querySelector('.quiz-section')) {
    initQuiz();
}