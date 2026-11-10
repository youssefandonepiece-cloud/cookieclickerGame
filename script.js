const counter = document.getElementById("counter");
const clickArea = document.getElementById("clickArea");
const buyAutoClicker = document.getElementById("buyAutoClicker");
const grandmaClick = document.getElementById("grandmaclick");
const modals = document.getElementById("modals");
const modalAutoClicker = document.getElementById("modalAutoClicker");
const modalGrandMaHelp = document.getElementById("modalGrandMaHelp");
const buyAutoClickerButton = document.getElementById("BuyAutoCLicker");
const buyGrandmaButton = document.getElementById("BuyGrandma");
const autoMessage = document.getElementById("autoMessage");
const grandmaMessage = document.getElementById("grandmaMessage");
const closeButtons = document.querySelectorAll(".close-modal");

const STORAGE_KEY = "cookieClickerSave";

let mainScore = 0;
let autoScore = 0;
let grandmaCount = 0;

function saveGame() {
    const saveData = {
        mainScore,
        autoScore,
        grandmaCount,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
}

function loadGame() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
        const data = JSON.parse(saved);
        mainScore = Number(data.mainScore) || 0;
        autoScore = Number(data.autoScore) || 0;
        grandmaCount = Number(data.grandmaCount) || 0;
    } catch (error) {
        console.error("Failed to load save data:", error);
    }

    counter.innerText = mainScore;
}

function clearMessages() {
    autoMessage.textContent = "";
    grandmaMessage.textContent = "";
}

function triggerScorePulse() {
    counter.classList.remove("score-pop");
    void counter.offsetWidth;
    counter.classList.add("score-pop");

    setTimeout(() => {
        counter.classList.remove("score-pop");
    }, 260);
}

function createFloatingScore(value) {
    const floatText = document.createElement("div");
    floatText.className = "floating-score";
    floatText.textContent = `+${value}`;
    document.body.appendChild(floatText);

    const clickRect = clickArea.getBoundingClientRect();
    floatText.style.left = `${clickRect.left + clickRect.width / 2}px`;
    floatText.style.top = `${clickRect.top + clickRect.height / 2}px`;

    setTimeout(() => {
        floatText.remove();
    }, 700);
}

function openModal(modal) {
    clearMessages();
    modals.classList.remove("hidden");
    modalAutoClicker.classList.add("hidden");
    modalGrandMaHelp.classList.add("hidden");
    modal.classList.remove("hidden");

    requestAnimationFrame(() => {
        modal.classList.add("visible");
    });
}

function closeModals() {
    clearMessages();
    modals.classList.add("hidden");
    modalAutoClicker.classList.add("hidden");
    modalGrandMaHelp.classList.add("hidden");
    modalAutoClicker.classList.remove("visible");
    modalGrandMaHelp.classList.remove("visible");
}

function showNotEnoughCookies(messageElement, amount) {
    messageElement.textContent = `Not enough cookies. You need ${amount} cookies.`;
}

clickArea.addEventListener("click", () => {
    mainScore += 1;
    counter.innerText = mainScore;
    triggerScorePulse();
    createFloatingScore(1);
    saveGame();

    clickArea.style.transform = "scale(0.9) rotate(-2deg)";
    clickArea.style.filter = "drop-shadow(0 0 18px rgba(255, 214, 102, 0.9))";
    setTimeout(() => {
        clickArea.style.transform = "scale(1) rotate(0deg)";
        clickArea.style.filter = "drop-shadow(0 0 0 rgba(0,0,0,0))";
    }, 120);
});

buyAutoClicker.addEventListener("click", () => {
    openModal(modalAutoClicker);
});

grandmaClick.addEventListener("click", () => {
    openModal(modalGrandMaHelp);
});

buyAutoClickerButton.addEventListener("click", () => {
    if (mainScore >= 10) {
        mainScore -= 10;
        autoScore += 1;
        counter.innerText = mainScore;
        triggerScorePulse();
        saveGame();
        closeModals();
        return;
    }

    showNotEnoughCookies(autoMessage, 10);
});

buyGrandmaButton.addEventListener("click", () => {
    if (mainScore >= 100) {
        mainScore -= 100;
        grandmaCount += 1;
        counter.innerText = mainScore;
        triggerScorePulse();
        saveGame();
        closeModals();
        return;
    }

    showNotEnoughCookies(grandmaMessage, 100);
});

closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        closeModals();
    });
});

modals.addEventListener("click", (event) => {
    if (event.target === modals) {
        closeModals();
    }
});

setInterval(() => {
    if (autoScore > 0) {
        mainScore += autoScore;
        counter.innerText = mainScore;
        triggerScorePulse();
        saveGame();
    }
}, 1000);

setInterval(() => {
    if (grandmaCount > 0) {
        mainScore += grandmaCount * 10;
        counter.innerText = mainScore;
        triggerScorePulse();
        saveGame();
    }
}, 5000);

loadGame();
