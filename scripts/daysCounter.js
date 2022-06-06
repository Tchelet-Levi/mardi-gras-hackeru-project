// Countdown till Mardi Gras
const daysCounter = document.getElementById("days-counter");
const nextMgTime = 1677103200000;

function getDaysTillMG(mgTime) {
  const currTime = Date.now();

  const timeTillMgInMs = Math.abs(mgTime - currTime);
  const timeTillMgInDays = Math.floor(timeTillMgInMs / 86400000);

  return timeTillMgInDays;
}

const days = getDaysTillMG(nextMgTime);

if (days === 1) {
  daysCounter.parentElement.innerHTML = `is here <span id="days-counter" class="days-counter">Tomorrow!</span>`;
}

if (days === 0) {
  daysCounter.parentElement.innerHTML = `is here <span id="days-counter" class="days-counter">Today!</span>`;
}

daysCounter.textContent = days;
