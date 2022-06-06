const questionHeader = document.getElementById("quiz-question");
const quizNumHeader = document.getElementById("question-number");
const playerScore = document.getElementById("quiz-player-score");
const optionsContainer = document.getElementById("options-container");

const radioOption1 = document.getElementById("quiz-answer-1");
const optionLabel1 = document.getElementById("quiz-label-1");

const radioOption2 = document.getElementById("quiz-answer-2");
const optionLabel2 = document.getElementById("quiz-label-2");

const radioOption3 = document.getElementById("quiz-answer-3");
const optionLabel3 = document.getElementById("quiz-label-3");

const checkBtn = document.getElementById("quiz-check-btn");

const radioOptions = [radioOption1, radioOption2, radioOption3];
const optionLabels = [optionLabel1, optionLabel2, optionLabel3];

// Questions object
const quiz = [
  {
    question: "What is the day before Mardi Gras called?",
    options: ["Rali Gras", "Lundi Gras", "Marti Gras"],
    answer: 1, // option[index]
  },
  {
    question: "What day comes after Mardi Gras?",
    options: ["Ash Wednesday", "Fat Day", "Candy Wednesday"],
    answer: 0,
  },
  {
    question: "Where was the first known carnival celebration?",
    options: ["New Orleans", "Spain", "France"],
    answer: 2,
  },
  {
    question:
      "What famous father and son were each crowned King Bacchus at New Orleans Mardi Gras?",
    options: ["Alan and Robin Thicke", "James and Alan Thicke", "John and Michael Thicke"],
    answer: 0,
  },
  {
    question: "When was the earliest known carnival celebration?",
    options: ["1285", "1294", "1298"],
    answer: 1,
  },
  {
    question: "What is the signature Mardi Gras dessert?",
    options: ["Queen muffin", "Royal cake", "King cake"],
    answer: 2,
  },
  {
    question: "What is traditionally hidden inside a king cake?",
    options: ["A plastic baby", "Strawberry jam", "A purple egg"],
    answer: 0,
  },
  {
    question: "Bacchus is the Roman god of what?",
    options: ["Water", "Wine", "The sun"],
    answer: 1,
  },
  {
    question: "What is the most popular food for Shrove Tuesday?",
    options: ["Pancakes", "Muffins", "King cake"],
    answer: 0,
  },
  {
    question: "How many king cakes are sold during an average carnival season?",
    options: ["~300,000", "~500,000", "~700,000"],
    answer: 1,
  },
  {
    question: "What time does New Orleans law require masks to be removed on Mardi Gras?",
    options: ["12 a.m", "4 p.m", "6 p.m"],
    answer: 2,
  },
  {
    question: "What song is the anthem of Mardi Gras in New Orleans?",
    options: ["Til the morning comes", "Love prevails", "If I cease to love"],
    answer: 2,
  },
  {
    question: "What does purple signify during Mardi Gras?",
    options: ["Justice", "Strength", "Luxury"],
    answer: 0,
  },
  {
    question: "What does green signify during Mardi Gras?",
    options: ["Nature", "Faith", "Happiness"],
    answer: 1,
  },
  {
    question: "What does gold signify during Mardi Gras?",
    options: ["Money", "Power", "Pride"],
    answer: 1,
  },
];

let correctGuesses = 0;
let currentQuestionIdx = 0;

function updateQuiz(idx) {
  if (idx < quiz.length) {
    questionHeader.textContent = quiz[idx].question;
    quizNumHeader.textContent = currentQuestionIdx + 1;

    optionLabel1.textContent = quiz[idx].options[0];
    optionLabel2.textContent = quiz[idx].options[1];
    optionLabel3.textContent = quiz[idx].options[2];

    optionLabels.forEach((label) => {
      // Remove any correct or wrong styles after previous answer
      label.parentElement.classList.remove("correct", "wrong", "would-be-correct");
    });

    // Uncheck any previously checked options and enable inputs
    radioOptions.forEach((option) => {
      option.checked = false;
      option.disabled = false;
    });

    checkBtn.textContent = "Check";
  } else {
    optionsContainer.classList.add("hidden");
    playerScore.textContent = `${correctGuesses} / ${quiz.length}`;

    // Set custom after-quiz text
    const correctGuessesPercentage = (correctGuesses / quiz.length) * 100;

    if (correctGuessesPercentage === 100) {
      return (questionHeader.innerHTML = `You're amazing!!<br/>You got it all right!`);
    }

    if (correctGuessesPercentage > 75) {
      return (questionHeader.innerHTML = `Way to go!<br/>You got almost all of it right!`);
    }

    if (correctGuessesPercentage > 50) {
      return (questionHeader.innerHTML = `Not bad!<br/>You got half of it right!`);
    } else {
      return (questionHeader.innerHTML = `Everyone has to start somewhere.<br>Join us on the next Mardi Gras!`);
    }
  }
}

updateQuiz(currentQuestionIdx);
playerScore.textContent = correctGuesses;

checkBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (checkBtn.textContent === "Next question") {
    return updateQuiz(currentQuestionIdx);
  }

  let checkedOption;
  radioOptions.forEach((option) => {
    if (option.checked) checkedOption = option;
  });

  // string => int
  const checkedValue = parseInt(checkedOption.value);
  const correctAnswer = quiz[currentQuestionIdx].answer;

  if (checkedValue === correctAnswer) {
    // You got it! Add one to the score and make checkedOption green.
    correctGuesses++;
    optionLabels[checkedValue].parentElement.classList.add("correct");
  } else {
    // Sorry, that wasn't correct. Make CheckedOption red, make the right answer green.
    optionLabels[checkedValue].parentElement.classList.add("wrong");
    optionLabels[correctAnswer].parentElement.classList.add("would-be-correct");
  }

  // Disable all checkboxes.
  radioOptions.forEach((option) => {
    option.disabled = true;
  });

  // Update score
  playerScore.textContent = `${correctGuesses}`;

  // Make check button value to 'next question'
  checkBtn.textContent = "Next question";

  // Increment question index
  currentQuestionIdx++;
});
