// Initialisation des particules
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: ['#00b7eb', '#39ff14'] },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: '#39ff14', opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: 'none', random: true }
    },
    interactivity: {
        events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
        modes: { repulse: { distance: 100 }, push: { particles_nb: 4 } }
    }
});

const chain = document.getElementById('chain');
const addBlockButton = document.getElementById('add-block');
const resetGameButton = document.getElementById('reset-game');
const shareScoreButton = document.getElementById('share-score');
const scoreDisplay = document.getElementById('score');
const securityLevelDisplay = document.getElementById('security-level');
const timerDisplay = document.getElementById('timer');
const messageDiv = document.getElementById('message');
const introModal = document.getElementById('intro');
const startGameButton = document.getElementById('start-game');
const gameContainer = document.querySelector('.game-container');
const leaderboardList = document.getElementById('leaderboard-list');
const nftTeaser = document.getElementById('nft-teaser');

let blockCount = 0;
let timeLeft = 30;
let timerRunning = false;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

const messages = [
    "LayerEdge secures your transactions with cutting-edge cryptography!",
    "Unmatched scalability with LayerEdge's innovative technology!",
    "Decentralized future powered by LayerEdge!",
    "Lightning-fast transactions with LayerEdge's optimized network!"
];

// Afficher le leaderboard
function updateLeaderboard() {
    leaderboardList.innerHTML = '';
    leaderboard.sort((a, b) => b - a).slice(0, 5).forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `#${index + 1}: ${score} blocks`;
        leaderboardList.appendChild(li);
    });
}

// Démarrer le timer
function startTimer() {
    timerRunning = true;
    const timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerRunning = false;
            addBlockButton.disabled = true;
            messageDiv.textContent = `Time's up! Final Score: ${blockCount}. Share it or reset to try again!`;
            leaderboard.push(blockCount);
            localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
            updateLeaderboard();
        }
    }, 1000);
}

// Réinitialiser le jeu
function resetGame() {
    blockCount = 0;
    timeLeft = 30;
    timerRunning = false;
    scoreDisplay.textContent = blockCount;
    securityLevelDisplay.textContent = '0%';
    timerDisplay.textContent = `${timeLeft}s`;
    chain.innerHTML = '';
    messageDiv.textContent = '';
    nftTeaser.classList.add('hidden');
    addBlockButton.disabled = false;
    startTimer();
}

// Afficher le jeu
startGameButton.addEventListener('click', () => {
    introModal.style.display = 'none';
    gameContainer.style.display = 'block';
    startTimer();
    updateLeaderboard();
});

// Ajouter un bloc
addBlockButton.addEventListener('click', () => {
    if (!timerRunning) return;
    blockCount++;
    const block = document.createElement('div');
    block.className = 'block';
    block.textContent = `Block ${blockCount}`;
    chain.appendChild(block);

    // Mettre à jour le score et le niveau de sécurité
    scoreDisplay.textContent = blockCount;
    const securityLevel = Math.min(blockCount * 10, 100);
    securityLevelDisplay.textContent = `${securityLevel}%`;

    // Afficher un message promotionnel
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    messageDiv.textContent = randomMessage;
    messageDiv.style.animation = 'none';
    setTimeout(() => messageDiv.style.animation = 'fadeIn 1s forwards', 10);

    // Afficher le teaser NFT tous les 5 blocs
    if (blockCount % 5 === 0) {
        nftTeaser.classList.remove('hidden');
    }

    // Défilement automatique
    chain.scrollLeft = chain.scrollWidth;
});

// Réinitialiser le jeu
resetGameButton.addEventListener('click', resetGame);

// Partager le score sur X
shareScoreButton.addEventListener('click', () => {
    const tweetText = `I built ${blockCount} blocks with LayerEdge in Blockchain Builder! 🚀 Try it yourself! #LayerEdge @iveobod`;
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank');
});
