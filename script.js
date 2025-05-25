// Créer le DOM dynamiquement
const app = document.getElementById('app');

// Modal d'introduction
const introModal = document.createElement('div');
introModal.id = 'intro';
introModal.className = 'intro-modal';
const modalContent = document.createElement('div');
modalContent.className = 'modal-content';
const modalTitle = document.createElement('h1');
modalTitle.textContent = 'Welcome to Blockchain Builder!';
const modalText = document.createElement('p');
modalText.textContent = 'Mine blocks to build a secure blockchain with LayerEdge! Click rapidly to mine each block, collect power-ups, and unlock NFT rewards. Beat the 30-second challenge, climb the leaderboard, and share your score on X!';
const startGameButton = document.createElement('button');
startGameButton.id = 'start-game';
startGameButton.textContent = 'Start Mining';
modalContent.append(modalTitle, modalText, startGameButton);
introModal.appendChild(modalContent);

// Conteneur principal du jeu
const gameContainer = document.createElement('div');
gameContainer.className = 'game-container';
gameContainer.style.display = 'none';
const title = document.createElement('h1');
title.className = 'glitch';
title.textContent = 'Blockchain Builder';
const scoreDisplay = document.createElement('div');
scoreDisplay.className = 'score';
scoreDisplay.innerHTML = 'Score: <span id="score">0</span> | Security Level: <span id="security-level">0%</span> | Time Left: <span id="timer">30s</span> | NFTs: <span id="nft-count">0</span>';
const leaderboard = document.createElement('div');
leaderboard.className = 'leaderboard';
const leaderboardTitle = document.createElement('h2');
leaderboardTitle.textContent = 'Leaderboard';
const leaderboardList = document.createElement('ul');
leaderboardList.id = 'leaderboard-list';
leaderboard.append(leaderboardTitle, leaderboardList);
const chain = document.createElement('div');
chain.id = 'chain';
chain.className = 'chain';
const miningProgress = document.createElement('div');
miningProgress.className = 'mining-progress';
const progressBar = document.createElement('div');
progressBar.id = 'progress-bar';
progressBar.className = 'progress-bar';
miningProgress.appendChild(progressBar);
const mineBlockButton = document.createElement('button');
mineBlockButton.id = 'mine-block';
mineBlockButton.textContent = 'Mine Block with LayerEdge';
const resetGameButton = document.createElement('button');
resetGameButton.id = 'reset-game';
resetGameButton.textContent = 'Reset Game';
const shareScoreButton = document.createElement('button');
shareScoreButton.id = 'share-score';
shareScoreButton.textContent = 'Share Score on X';
const powerUp = document.createElement('div');
powerUp.id = 'power-up';
powerUp.className = 'power-up hidden';
powerUp.textContent = 'Power-Up!';
const nftTeaser = document.createElement('div');
nftTeaser.id = 'nft-teaser';
nftTeaser.className = 'nft-teaser hidden';
const nftTitle = document.createElement('h3');
nftTitle.textContent = 'Congrats! You\'ve earned a LayerEdge NFT!';
const nftPreview = document.createElement('div');
nftPreview.className = 'nft-preview';
nftTeaser.append(nftTitle, nftPreview);
const message = document.createElement('div');
message.id = 'message';
message.className = 'message';
const footer = document.createElement('footer');
footer.innerHTML = 'Developed by Karol | <a href="https://x.com/iveobod" target="_blank">Follow @iveobod on X</a>';
gameContainer.append(title, scoreDisplay, leaderboard, chain, miningProgress, mineBlockButton, resetGameButton, shareScoreButton, powerUp, nftTeaser, message, footer);

// Ajouter les éléments au DOM
app.append(introModal, gameContainer);

// Logique du jeu
let blockCount = 0;
let nftCount = 0;
let timeLeft = 30;
let timerRunning = false;
let clicksToMine = 5;
let currentClicks = 0;
let leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
let doubleScore = false;

const messages = [
    "LayerEdge secures your transactions with cutting-edge cryptography!",
    "Unmatched scalability with LayerEdge's innovative technology!",
    "Decentralized future powered by LayerEdge!",
    "Lightning-fast transactions with LayerEdge's optimized network!"
];

// Afficher le leaderboard
function updateLeaderboard() {
    leaderboardList.innerHTML = '';
    leaderboardData.sort((a, b) => b - a).slice(0, 5).forEach((score, index) => {
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
        document.getElementById('timer').textContent = `${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerRunning = false;
            mineBlockButton.disabled = true;
            message.textContent = `Time's up! Final Score: ${blockCount}, NFTs: ${nftCount}. Share it or reset!`;
            leaderboardData.push(blockCount);
            localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
            updateLeaderboard();
        }
    }, 1000);
}

// Réinitialiser le jeu
function resetGame() {
    blockCount = 0;
    nftCount = 0;
    timeLeft = 30;
    currentClicks = 0;
    timerRunning = false;
    doubleScore = false;
    document.getElementById('score').textContent = blockCount;
    document.getElementById('security-level').textContent = '0%';
    document.getElementById('timer').textContent = `${timeLeft}s`;
    document.getElementById('nft-count').textContent = nftCount;
    chain.innerHTML = '';
    message.textContent = '';
    nftTeaser.classList.add('hidden');
    powerUp.classList.add('hidden');
    progressBar.style.width = '0%';
    mineBlockButton.disabled = false;
    startTimer();
}

// Afficher un power-up
function spawnPowerUp() {
    powerUp.classList.remove('hidden');
    setTimeout(() => {
        powerUp.classList.add('hidden');
    }, 3000);
}

// Activer un power-up
function activatePowerUp() {
    const effects = [
        () => { doubleScore = true; message.textContent = 'Double Score Activated!'; setTimeout(() => doubleScore = false, 5000); },
        () => { timeLeft += 5; message.textContent = 'Time Extended by 5s!'; }
    ];
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    randomEffect();
    powerUp.classList.add('hidden');
    message.style.animation = 'none';
    setTimeout(() => message.style.animation = 'fadeIn 1s forwards', 10);
}

// Afficher le jeu
startGameButton.addEventListener('click', () => {
    introModal.style.display = 'none';
    gameContainer.style.display = 'block';
    startTimer();
    updateLeaderboard();
});

// Miner un bloc
mineBlockButton.addEventListener('click', () => {
    if (!timerRunning) return;
    currentClicks++;
    progressBar.style.width = `${(currentClicks / clicksToMine) * 100}%`;
    if (currentClicks >= clicksToMine) {
        currentClicks = 0;
        progressBar.style.width = '0%';
        blockCount += doubleScore ? 2 : 1;
        const block = document.createElement('div');
        block.className = 'block';
        block.textContent = `Block ${blockCount}`;
        chain.appendChild(block);

        // Mettre à jour le score et le niveau de sécurité
        document.getElementById('score').textContent = blockCount;
        const securityLevel = Math.min(blockCount * 10, 100);
        document.getElementById('security-level').textContent = `${securityLevel}%`;

        // Afficher un message promotionnel
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        message.textContent = randomMessage;
        message.style.animation = 'none';
        setTimeout(() => message.style.animation = 'fadeIn 1s forwards', 10);

        // Afficher le teaser NFT tous les 5 blocs
        if (blockCount % 5 === 0) {
            nftCount++;
            document.getElementById('nft-count').textContent = nftCount;
            nftTeaser.classList.remove('hidden');
            setTimeout(() => nftTeaser.classList.add('hidden'), 3000);
        }

        // Afficher un power-up à certains blocs
        if ([3, 8, 12].includes(blockCount)) {
            spawnPowerUp();
        }

        // Défilement automatique
        chain.scrollLeft = chain.scrollWidth;
    }
});

// Activer le power-up
powerUp.addEventListener('click', activatePowerUp);

// Réinitialiser le jeu
resetGameButton.addEventListener('click', resetGame);

// Partager le score
shareScoreButton.addEventListener('click', () => {
    const tweetText = `I mined ${blockCount} blocks and earned ${nftCount} NFTs with LayerEdge in Blockchain Builder! 🚀 Try it! #LayerEdge @iveobod`;
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank');
});
