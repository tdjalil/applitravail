let fiches = [];
let currentFicheIndex = 0;
let currentQuestionIndex = 0;
let score = 0;

const btnGenFiche = document.getElementById("genFiche");
const btnPrev = document.getElementById("prevFiche");
const btnNext = document.getElementById("nextFiche");
const btnSave = document.getElementById("saveFiches");
const ficheTitle = document.getElementById("ficheTitle");
const ficheContent = document.getElementById("ficheContent");
const tableBody = document.getElementById("tableBody");

const quizQuestionEl = document.getElementById("quizQuestion");
const quizOptionsEl = document.getElementById("quizOptions");
const quizFeedbackEl = document.getElementById("quizFeedback");
const nextQuestionBtn = document.getElementById("nextQuestion");
const scoreEl = document.getElementById("score");
const totalQuestionsEl = document.getElementById("totalQuestions");

totalQuestionsEl.textContent = Object.values(data).reduce((sum, arr) => sum + arr.length, 0);

function getRandomFiche() {
    const subjects = Object.keys(data);
    const subj = subjects[Math.floor(Math.random() * subjects.length)];
    const fichesSubj = data[subj];
    const fiche = fichesSubj[Math.floor(Math.random() * fichesSubj.length)];
    return { sujet: subj, contenu: fiche.contenu, question: fiche.question, options: fiche.options, answer: fiche.answer };
}

function genererFiche() {
    const fiche = getRandomFiche();
    fiches.push(fiche);
    currentFicheIndex = fiches.length - 1;
    afficherFiche(currentFicheIndex);
    majTableau();
}

function afficherFiche(index) {
    if(fiches[index]) {
        ficheTitle.textContent = fiches[index].sujet;
        ficheContent.textContent = fiches[index].contenu;
        currentQuestionIndex = index; // synchronise quiz
        loadQuestion();
    }
}

function fichePrecedente() {
    if(currentFicheIndex > 0) {
        currentFicheIndex--;
        afficherFiche(currentFicheIndex);
    }
}

function ficheSuivante() {
    if(currentFicheIndex < fiches.length - 1) {
        currentFicheIndex++;
        afficherFiche(currentFicheIndex);
    }
}

function majTableau() {
    tableBody.innerHTML = "";
    fiches.forEach((f, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${index+1}</td><td>${f.sujet}</td><td>${f.contenu}</td>`;
        tableBody.appendChild(row);
    });
}

function saveFiches() {
    localStorage.setItem("fichesMega", JSON.stringify(fiches));
    alert("💾 Fiches sauvegardées !");
}

function loadFiches() {
    const dataLocal = localStorage.getItem("fichesMega");
    if(dataLocal) {
        fiches = JSON.parse(dataLocal);
        afficherFiche(currentFicheIndex);
        majTableau();
    }
}

function loadQuestion() {
    if(!fiches[currentQuestionIndex]) return;
    const current = fiches[currentQuestionIndex];
    quizFeedbackEl.textContent = "";
    quizQuestionEl.textContent = current.question;
    quizOptionsEl.innerHTML = "";
    current.options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.addEventListener("click", () => checkAnswer(option));
        quizOptionsEl.appendChild(btn);
    });
}

function checkAnswer(selected) {
    const current = fiches[currentQuestionIndex];
    if(selected === current.answer) {
        quizFeedbackEl.textContent = "✅ Correct !";
        score++;
        scoreEl.textContent = score;
    } else {
        quizFeedbackEl.textContent = `❌ Faux ! La bonne réponse était : ${current.answer}`;
    }
}

nextQuestionBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if(currentQuestionIndex >= fiches.length) {
        alert(`Quiz terminé ! Score final : ${score} / ${fiches.length}`);
        currentQuestionIndex = 0;
        score = 0;
        scoreEl.textContent = score;
    }
    loadQuestion();
});

btnGenFiche.addEventListener("click", genererFiche);
btnPrev.addEventListener("click", fichePrecedente);
btnNext.addEventListener("click", ficheSuivante);
btnSave.addEventListener("click", saveFiches);

loadFiches();
