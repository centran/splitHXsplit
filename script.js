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
    const container = document.querySelector('.container');
    // Customization Elements
    const bgColorInput = document.getElementById('bg-color-input');
    const containerBgColorInput = document.getElementById('container-bg-color-input');
    const wordBoxBgColorInput = document.getElementById('word-box-bg-color-input');
    const wordTextColorInput = document.getElementById('word-text-color-input');
    const progressColorInput = document.getElementById('progress-color-input');
    const progressDirectionSelect = document.getElementById('progress-direction-select');
    const textSizeSlider = document.getElementById('text-size-slider');


    // App state
    let words = [];
    let isRunning = false;
    let timerInterval;
    let countdownInterval;
    let progressDirection = 'drain'; // Default direction

    // --- Customization ---

    const handleBgColorChange = (e) => {
        document.body.style.backgroundColor = e.target.value;
    };

    const handleContainerBgColorChange = (e) => {
        container.style.backgroundColor = e.target.value;
    };

    const handleWordBoxBgColorChange = (e) => {
        randomWordBox.style.backgroundColor = e.target.value;
    };

    const handleWordTextColorChange = (e) => {
        randomWordEl.style.color = e.target.value;
    };

    const handleProgressColorChange = (e) => {
        progressBar.style.backgroundColor = e.target.value;
    };

    const handleProgressDirectionChange = (e) => {
        progressDirection = e.target.value;
    };

    const handleTextSizeChange = (e) => {
        randomWordEl.style.fontSize = `${e.target.value}rem`;
    };

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

    // --- Go/Stop Logic ---

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

        if (progressDirection === 'drain') {
            progressBar.style.width = '100%';
            void progressBar.offsetWidth; // Reflow
            progressBar.style.transition = `width ${durationInSeconds}s linear`;
            progressBar.style.width = '0%';
        } else { // 'fill'
            progressBar.style.width = '0%';
            void progressBar.offsetWidth; // Reflow
            progressBar.style.transition = `width ${durationInSeconds}s linear`;
            progressBar.style.width = '100%';
        }


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

    // --- Event Listeners ---
    addWordBtn.addEventListener('click', addWords);
    wordInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            addWords();
        }
    });
    goStopBtn.addEventListener('click', () => {
        if (isRunning) {
            stop();
        } else {
            start();
        }
    });
    bgColorInput.addEventListener('input', handleBgColorChange);
    containerBgColorInput.addEventListener('input', handleContainerBgColorChange);
    wordBoxBgColorInput.addEventListener('input', handleWordBoxBgColorChange);
    wordTextColorInput.addEventListener('input', handleWordTextColorChange);
    progressColorInput.addEventListener('input', handleProgressColorChange);
    progressDirectionSelect.addEventListener('input', handleProgressDirectionChange);
    textSizeSlider.addEventListener('input', handleTextSizeChange);


    // --- Initialization ---
    const initializeSettings = () => {
        // Set initial values from controls
        document.body.style.backgroundColor = bgColorInput.value;
        container.style.backgroundColor = containerBgColorInput.value;
        randomWordBox.style.backgroundColor = wordBoxBgColorInput.value;
        randomWordEl.style.color = wordTextColorInput.value;
        progressBar.style.backgroundColor = progressColorInput.value;
        progressDirection = progressDirectionSelect.value;
        randomWordEl.style.fontSize = `${textSizeSlider.value}rem`;
        goStopBtn.classList.add('go');
    };

    initializeSettings();
});
