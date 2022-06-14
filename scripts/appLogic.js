// Give CSS access to current width and height variables
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit.
const vh = window.innerHeight * 0.01;
const vw = window.innerWidth * 0.01;

// Give CSS access to current height of header
const headerHeight = document.querySelector("header").offsetHeight;

// Then we set the value in the --vh, --vw custom property to the root of the document
document.documentElement.style.setProperty("--vh", `${vh}px`);
document.documentElement.style.setProperty("--vw", `${vw}px`);
document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);

// We listen to the resize event
window.addEventListener("resize", () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  let vw = window.innerWidth * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  document.documentElement.style.setProperty("--vw", `${vw}px`);
  document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);
});

// Show / Hide header
const navHeader = document.getElementById("nav-header");
const btnOpenNav = document.getElementById("btn-header-open-menu");
const btnCloseNav = document.getElementById("btn-header-close-menu");

btnOpenNav.addEventListener("click", (e) => navHeader.classList.add("nav-header-shown"));
btnCloseNav.addEventListener("click", (e) => navHeader.classList.remove("nav-header-shown"));

// Handle sponsor cards expanding / collapsing
const btnSponsorCards = document.querySelectorAll(".btn-sponsor");

function toggleExpandedCards(e, button) {
  e.preventDefault();

  // The .sponsor-card element
  const parent = button.parentElement;
  const content = parent.querySelector(".sponsor-content");
  const icon = button.querySelector("ion-icon");
  const iconName = icon.name;

  // Set
  icon.name = iconName === "chevron-down" ? "chevron-up" : "chevron-down";
  content.classList.toggle("expanded");

  // Close the other cards
  btnSponsorCards.forEach((btn) => {
    if (btn !== button) {
      btn.querySelector("ion-icon").name = "chevron-down";
      btn.parentElement.querySelector(".sponsor-content").classList.remove("expanded");
    }
  });
}

btnSponsorCards.forEach((button) =>
  button.addEventListener("click", (e) => toggleExpandedCards(e, button))
);

// Add the necessary elements to the hover effect.
// This is here because I am adding this right before submitting the project and I don't want to update every single html page. I miss frameworks and component reusability :')
const headerAnchors = document.querySelectorAll("nav ul li a");
headerAnchors.forEach((anchor) => {
  // Create container
  const stripsContainer = document.createElement("div");
  stripsContainer.classList.add("strips-container");

  // Create children
  const strip1 = document.createElement("div");
  strip1.classList.add("rainbow-strip");
  strip1.setAttribute("style", "--strip-index: 0");
  stripsContainer.appendChild(strip1);

  const strip2 = document.createElement("div");
  strip2.classList.add("rainbow-strip");
  strip2.setAttribute("style", "--strip-index: 1");
  stripsContainer.appendChild(strip2);

  const strip3 = document.createElement("div");
  strip3.classList.add("rainbow-strip");
  strip3.setAttribute("style", "--strip-index: 2");
  stripsContainer.appendChild(strip3);

  const strip4 = document.createElement("div");
  strip4.classList.add("rainbow-strip");
  strip4.setAttribute("style", "--strip-index: 3");
  stripsContainer.appendChild(strip4);

  // Append container to anchor
  anchor.appendChild(stripsContainer);
});
