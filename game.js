// Game state
let balance = 1000;
let bet = 50;
let isSpinning = false;
let spins = 0;
let mood = 'neutral';
let gameOver = false;
let emotionalAlertShown = false;
let healthLevel = 100;
let maxSpins = 8;
let healthPerSpin = 100 / maxSpins;

// DOM elements
const canvas = document.getElementById('slot-canvas');
const balanceDisplay = document.getElementById('balance');
const sidebarBalanceDisplay = document.getElementById('sidebar-balance');
const currentBetDisplay = document.getElementById('current-bet');
const spinButton = document.getElementById('spin-button');
const decreaseBetButton = document.getElementById('decrease-bet');
const increaseBetButton = document.getElementById('increase-bet');
const characterMood = document.getElementById('character-mood');
const moodEmoji = document.getElementById('mood-emoji');
const resultOverlay = document.getElementById('result-overlay');
const resultText = document.getElementById('result-text');
const totalSpinsDisplay = document.getElementById('total-spins');
const financialHealthDisplay = document.getElementById('financial-health');
const healthBar = document.getElementById('health-bar');
const tutorialModal = document.getElementById('tutorial-modal');
const startSimulationButton = document.getElementById('start-simulation');
const emergencyModal = document.getElementById('emergency-modal');
const cantAffordButton = document.getElementById('cant-afford');
const gameOverModal = document.getElementById('game-over-modal');
const emotionalAlertModal = document.getElementById('emotional-alert-modal');
const emotionalAlertText = document.getElementById('emotional-alert-text');
const manIcon = document.getElementById('man-icon');
const manBloodBar = document.getElementById('man-blood-bar');

// Slot machine variables
const ctx = canvas ? canvas.getContext('2d') : null;
const symbols = ["🍒", "🍋", "🍊", "🍇", "💎", "7️⃣"];
const reels = [0, 0, 0];
let animationId;

function initGame() {
    if (!canvas) return;
    updateDisplays();
    drawReels();
    spinButton.addEventListener('click', spin);
    decreaseBetButton.addEventListener('click', () => changeBet(-10));
    increaseBetButton.addEventListener('click', () => changeBet(10));
    startSimulationButton.addEventListener('click', closeTutorial);
    cantAffordButton.addEventListener('click', handleEmergency);
    tutorialModal.style.display = 'flex';
}

function drawReels() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < 3; i++) {
        const x = (canvas.width / 3) * (i + 0.5);
        const y = canvas.height / 2;
        ctx.fillText(symbols[reels[i]], x, y);
    }
}

function animateReels() {
    reels[0] = Math.floor(Math.random() * symbols.length);
    reels[1] = Math.floor(Math.random() * symbols.length);
    reels[2] = Math.floor(Math.random() * symbols.length);
    drawReels();
    if (isSpinning) animationId = requestAnimationFrame(animateReels);
}

function spin() {
    if (isSpinning || balance < bet || gameOver) return;
    balance -= bet;
    updateDisplays();
    isSpinning = true;
    resultOverlay.classList.add('hidden');
    animateReels();

    setTimeout(() => {
        isSpinning = false;
        cancelAnimationFrame(animationId);
        const isWin = Math.random() < 0.3;
        if (isWin) {
            const multiplier = Math.random() < 0.1 ? 5 : 2;
            const winnings = bet * multiplier;
            balance += winnings;
            resultOverlay.classList.remove('hidden');
            resultOverlay.className = 'result-overlay win';
            resultText.textContent = `WIN $${winnings}!`;
            setMood('happy');
        } else {
            resultOverlay.classList.remove('hidden');
            resultOverlay.className = 'result-overlay lose';
            resultText.textContent = 'LOSE!';
            if (balance < 200) {
                setMood('desperate');
            } else {
                setMood('sad');
            }
        }

        spins++;
        totalSpinsDisplay.textContent = spins;
        healthLevel -= healthPerSpin;
        updateBloodBar();

        checkEmotionalAlert();

        if (spins >= maxSpins || balance < bet) {
            gameOver = true;
            setTimeout(showFatherEmergency, 1500);
            return;
        }

        if (spins > 5 && balance < 500 && !gameOver) {
            const randomDelay = Math.random() * 2000 + 1000;
            setTimeout(triggerEmergency, randomDelay);
        }

    }, 2000);
}

function updateBloodBar() {
    manBloodBar.style.width = `${Math.max(0, healthLevel)}%`;
    if (healthLevel <= 0) {
        manIcon.classList.add('blast');
    }
}

function showFatherEmergency() {
    const emergencyIcon = document.getElementById('emergency-icon');
    const emergencyTitle = document.getElementById('emergency-title');
    const emergencyDescription = document.getElementById('emergency-description');
    emergencyIcon.innerHTML = '<i class="fas fa-heart-broken"></i>';
    emergencyTitle.textContent = 'Tragic Loss';
    emergencyDescription.textContent = 'The man was your father. You couldn\'t afford his treatment and he didn\'t survive. This is the harsh cost of gambling addiction.';
    emergencyModal.style.display = 'flex';
}

function checkEmotionalAlert() {
    if (!emotionalAlertShown && balance <= 500) {
        emotionalAlertShown = true;
        const messages = [
            "You've lost half your money — that's a month's worth of groceries.",
            "This could’ve paid your electricity and internet bills.",
            "That $500 could have gone toward rent or savings.",
            "Imagine using that money for a weekend trip with family or friends.",
            "Gambling can make you forget these are real dollars — be careful."
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        emotionalAlertText.textContent = randomMessage;
        emotionalAlertModal.style.display = 'flex';
    }
}

function closeEmotionalAlert() {
    emotionalAlertModal.style.display = 'none';
}

function changeBet(amount) {
    const newBet = Math.max(10, Math.min(balance, bet + amount));
    bet = newBet;
    currentBetDisplay.textContent = bet;
    decreaseBetButton.disabled = bet <= 10;
    increaseBetButton.disabled = bet >= balance;
}

function setMood(newMood) {
    mood = newMood;
    characterMood.className = `character-mood ${mood}`;
    switch (newMood) {
        case 'happy':
            moodEmoji.textContent = '😄';
            break;
        case 'sad':
            moodEmoji.textContent = '😔';
            break;
        case 'desperate':
            moodEmoji.textContent = '😰';
            break;
        default:
            moodEmoji.textContent = '😐';
    }
}

function updateDisplays() {
    balanceDisplay.textContent = `$${balance}`;
    sidebarBalanceDisplay.textContent = `$${balance}`;
    let healthStatus;
    let healthBarWidth;
    let healthBarColor;
    if (balance > 800) {
        healthStatus = 'Good';
        healthBarWidth = '100%';
        healthBarColor = 'var(--success)';
    } else if (balance > 400) {
        healthStatus = 'Warning';
        healthBarWidth = '50%';
        healthBarColor = 'var(--warning)';
    } else {
        healthStatus = 'Critical';
        healthBarWidth = '20%';
        healthBarColor = 'var(--danger)';
    }
    financialHealthDisplay.textContent = healthStatus;
    healthBar.style.width = healthBarWidth;
    healthBar.style.backgroundColor = healthBarColor;
    spinButton.disabled = isSpinning || balance < bet || gameOver;
    decreaseBetButton.disabled = bet <= 10 || isSpinning;
    increaseBetButton.disabled = bet >= balance || isSpinning;
}

function closeTutorial() {
    tutorialModal.style.display = 'none';
}

function triggerEmergency() {
    if (gameOver) return;
    const emergencyTypes = ['medical', 'family', 'car'];
    const randomType = emergencyTypes[Math.floor(Math.random() * emergencyTypes.length)];
    const emergencyIcon = document.getElementById('emergency-icon');
    const emergencyTitle = document.getElementById('emergency-title');
    const emergencyDescription = document.getElementById('emergency-description');
    switch (randomType) {
        case 'medical':
            emergencyIcon.innerHTML = '<i class="fas fa-heartbeat"></i>';
            emergencyTitle.textContent = 'Medical Emergency';
            emergencyDescription.textContent = 'Your family member has been hospitalized and needs immediate treatment. The medical bills are $800.';
            break;
        case 'family':
            emergencyIcon.innerHTML = '<i class="fas fa-home"></i>';
            emergencyTitle.textContent = 'Family Crisis';
            emergencyDescription.textContent = 'Your child\'s school tuition is due, and they\'ll be expelled if you don\'t pay $600 immediately.';
            break;
        case 'car':
            emergencyIcon.innerHTML = '<i class="fas fa-car"></i>';
            emergencyTitle.textContent = 'Car Breakdown';
            emergencyDescription.textContent = 'Your car broke down and you need $700 for repairs to get to work tomorrow.';
            break;
    }
    emergencyModal.style.display = 'flex';
}

function handleEmergency() {
    emergencyModal.style.display = 'none';
    gameOver = true;
    showGameOver();
}

function showGameOver() {
    gameOverModal.style.display = 'flex';
}

if (document.querySelector('.game-section')) {
    initGame();
}
