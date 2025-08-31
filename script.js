document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const wordInput = document.getElementById('word-input');
    const addWordBtn = document.getElementById('add-word-btn');
    const wordList = document.getElementById('word-list');
    const goStopBtn = document.getElementById('go-stop-btn');
    const randomWordEl = document.getElementById('random-word');
    const timerInput = document.getElementById('timer-input');
    const countdownEl = document.getElementById('countdown');
    const progressBar = document.getElementById('progress-bar');
    const randomWordBox = document.getElementById('random-word-box');

    // App state
    let words = [];
    let isRunning = false;
    let timerInterval;
    let countdownInterval;

    // --- Word Management ---

    const addWords = () => {
        const newWords = wordInput.value.split(',')
            .map(word => word.trim())
            .filter(word => word.length > 0 && !words.includes(word));

        if (newWords.length > 0) {
            words.push(...newWords);
            renderWordList();
        }
        wordInput.value = '';
    };

    const removeWord = (wordToRemove) => {
        words = words.filter(word => word !== wordToRemove);
        renderWordList();
    };

    const renderWordList = () => {
        wordList.innerHTML = '';
        words.forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            const removeSpan = document.createElement('span');
            removeSpan.textContent = 'X';
            removeSpan.className = 'remove-word';
            removeSpan.onclick = () => removeWord(word);
            li.appendChild(removeSpan);
            wordList.appendChild(li);
        });
    };

    addWordBtn.addEventListener('click', addWords);
    wordInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            addWords();
        }
    });

    // --- Go/Stop Logic ---

    goStopBtn.addEventListener('click', () => {
        if (isRunning) {
            stop();
        } else {
            start();
        }
    });

    const start = () => {
        if (words.length < 2) {
            alert('Please add at least two words to the list.');
            return;
        }

        isRunning = true;
        goStopBtn.textContent = 'STOP';
        goStopBtn.className = 'stop';
        wordInput.disabled = true;
        addWordBtn.disabled = true;
        timerInput.disabled = true;

        const timerValue = parseFloat(timerInput.value);
        if (isNaN(timerValue) || timerValue <= 0) {
            alert('Please enter a valid time in minutes.');
            return;
        }

        pickAndDisplayWord();
        timerInterval = setInterval(pickAndDisplayWord, timerValue * 60 * 1000);
    };

    const stop = () => {
        isRunning = false;
        goStopBtn.textContent = 'GO';
        goStopBtn.className = 'go';
        wordInput.disabled = false;
        addWordBtn.disabled = false;
        timerInput.disabled = false;

        clearInterval(timerInterval);
        clearInterval(countdownInterval);

        randomWordEl.textContent = '';
        countdownEl.textContent = '';
        progressBar.style.width = '0%';
        progressBar.style.transition = 'none';
    };

    const pickAndDisplayWord = () => {
        // Exclude the currently displayed word from the next random choice
        const currentWord = randomWordEl.textContent;
        const availableWords = words.filter(w => w !== currentWord);
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const newWord = availableWords[randomIndex];

        randomWordEl.textContent = newWord;

        startCountdown();
    };

    // --- Timer and Countdown ---

    const startCountdown = () => {
        clearInterval(countdownInterval);

        const durationInMinutes = parseFloat(timerInput.value);
        const durationInSeconds = durationInMinutes * 60;
        let remainingTime = Math.ceil(durationInSeconds);

        // Reset progress bar
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        // Force reflow to apply the reset instantly
        void progressBar.offsetWidth;

        // Start new transition
        progressBar.style.transition = `width ${durationInSeconds}s linear`;
        progressBar.style.width = '100%';


        const updateCountdown = () => {
            countdownEl.textContent = `${remainingTime}s`;
            if (remainingTime > 0) {
                remainingTime--;
            } else {
                clearInterval(countdownInterval);
            }
        };

        updateCountdown(); // Initial display
        countdownInterval = setInterval(updateCountdown, 1000);
    };

    // Set initial button class
    goStopBtn.classList.add('go');
});
