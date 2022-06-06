/* 
  ! This implementation does not yet support less than 4 pictures. Too much of a scope creep for this project..
  If I wanted to support it I would duplicate the first and last carousel-items but it's unnecessary for this project,
  and more messy to do without a framework like React or Svelte.
*/

// Get carousel-wrapper
const carouselWrapper = document.querySelector(".carousel-wrapper");

// Get all carousel-items
const carouselItems = document.querySelectorAll(".carousel-item");

// querySelectorAll doesn't return an array. Convert it into an array.
let carouselItemsArr = Array.from(carouselItems);

// Total number of carousel-item's
const itemsLength = carouselItems.length;

// Assuming all items share the same width, get the width of a single carousel-item.
let itemWidth = carouselItems[0].getBoundingClientRect().width;

// carousel-items moving yet another step while already transitioning looks bad.
// Figure out if we're mid transition or not.
let isTransitioning = false;

carouselItems[0].ontransitionstart = () => {
  isTransitioning = true;
};

carouselItems[0].ontransitionend = () => {
  isTransitioning = false;
};

// initialize the carousel
initializeCarousel();

let canTransition = true;

// Handle resizing
window.onresize = (e) => {
  itemWidth = carouselItems[0].getBoundingClientRect().width;
  initialTransform();

  if (canTransition) {
    carouselItemsArr.forEach((item) => {
      item.setAttribute("style", "transition: none");
    });
    canTransition = false;
  }
};

// Debug
document.addEventListener("keydown", (e) => {
  // Make sure they can move
  canTransition = true;

  if (e.key === "q" && !isTransitioning) {
    // shift left

    carouselItemsArr = arrayRotate(carouselItemsArr, true);
    transitionCarousel(carouselItemsArr, itemWidth);
  }

  if (e.key === "e" && !isTransitioning) {
    // shift right

    carouselItemsArr = arrayRotate(carouselItemsArr);
    transitionCarousel(carouselItemsArr, itemWidth);
  }
});

function transitionCarousel(carouselItems, itemWidth) {
  carouselItems.forEach((item, idx) => {
    const twoLeft = idx - 2;

    item.style.transform = `translateX(${twoLeft * itemWidth}px)`;
    item.style.opacity = "1";

    if (idx > 3) {
      item.style.opacity = "0";
    }

    // Prevents first index from sliding across the screen, breaking the illusion.
    if (idx === 0) {
      item.style.opacity = "0";
    }
  });
}

function arrayRotate(arr, reverse) {
  if (reverse) arr.unshift(arr.pop());
  else arr.push(arr.shift());
  return arr;
}

function initializeCarousel() {
  // Shift the entire list two to the left
  carouselItemsArr = arrayRotate(carouselItemsArr, true);
  carouselItemsArr = arrayRotate(carouselItemsArr, true);

  initialTransform();
}

function initialTransform() {
  // Initial setup
  carouselItemsArr.forEach((item, idx) => {
    const twoLeft = idx - 2;
    item.style.transform = `translateX(${twoLeft * itemWidth}px)`;
  });
}
