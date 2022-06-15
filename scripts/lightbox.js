/*
  Proud to say that this is my original solution, that is to say I did not use external solutions to this problem.
*/

// I miss TypeScript interfaces and types..
// Current active item and its rect.
// This is global because only one lightbox can be active at a time.

/* 
    ! KNOWN BUG: Since entering modal prevents scrolling, the scrollbar disappears. (body: overflow: hidden) 
      This is an okay behavior except that the grid then (auto-fill) shifts to fill in the blank space
      Which changes the position of all the grid items, which throws the center calculation
      out of whack. I would fix this but I am running out of time for this project.

    ! KNOWN BUG 2: getBoundingClientRect takes CSS transforms into consideration which messes up with the calculation later down the line, failing to center it.
      To fix this problem I would need to get the computed transform matrix and try to work with that, but I am not good with math and in all honesty it would take me too long to solve it. I believe I would've came to a solution in the end but its already late into the project.

    ! KNOWN BUG 3: This does not account for document flow changes. If grid resizes or places things differently, it will fail to center it.
*/
let currPresentedItem = null;
let currPresentedItemRect = null;

class Lightbox {
  constructor(wrapperElem, itemsArr, modalElem, closeBtnElem) {
    this.wrapperElem = wrapperElem;
    this.itemsArr = itemsArr;
    this.modalElem = modalElem;
    this.closeBtnElem = closeBtnElem;
    this.isModalOpen = false;
  }

  openModal(itemElem) {
    this.modalElem.classList.remove("modal-closed");
    this.modalElem.setAttribute("aria-expanded", "true");
    this.isModalOpen = true;

    currPresentedItem = itemElem;
    currPresentedItemRect = itemElem.getBoundingClientRect();

    // Set style attributes
    const centerTransformRules = centerStyle(itemElem, currPresentedItemRect);
    itemElem.setAttribute("style", `${centerTransformRules};`);
    itemElem.classList.add("presented");

    // Prevent scrolling
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";

    // Create CustomEvent for onLightboxModalOpen
    const eventData = { currentElement: itemElem };
    const onModalOpen = new CustomEvent("onLightboxModalOpen", { detail: eventData });

    // Emit globally that the lightboxModal is open
    document.dispatchEvent(onModalOpen);
  }

  closeModal() {
    this.modalElem.classList.add("modal-closed");
    this.modalElem.setAttribute("aria-expanded", "false");
    this.isModalOpen = false;

    currPresentedItem.style = "";
    currPresentedItem.style.zIndex = `${zIndex}`;
    currPresentedItem.classList.remove("presented");

    document.body.style.overflow = "";
    document.body.style.height = "";

    // Create CustomEvent for onLightboxModalClosed
    const eventData = { currentElement: currPresentedItem };
    const onModalClosed = new CustomEvent("onLightboxModalClosed", { detail: eventData });

    // Emit globally that the lightboxModal is closed
    document.dispatchEvent(onModalClosed);

    currPresentedItem = null;
    currPresentedItemRect = null;
  }
}

const zIndex = 10001;
// Get every instance of lightbox on the page
const lightboxWrappers = Array.from(document.querySelectorAll(".lightbox-wrapper"));

// Generate Lightbox[]
const lightboxArr = lightboxWrappers.map((wrapper) => {
  const lightboxItems = Array.from(wrapper.querySelectorAll(".lightbox-item"));
  const modalElem = wrapper.querySelector(".lightbox-modal");
  const closeBtn = wrapper.querySelector(".lightbox-modal-close");

  return new Lightbox(wrapper, lightboxItems, modalElem, closeBtn);
});

// Get width and height of viewport
// html instead of window.innerWidth to exclude scrollbar.
const html = document.querySelector("html");
let viewportDimensions = {
  width: html.clientWidth,
  height: html.clientHeight,
};

// For every Lightbox object, add event listeners to openModal and Close modal
lightboxArr.forEach((lightbox) => {
  // Open modal
  lightbox.itemsArr.forEach((item) => {
    item.addEventListener("click", (event) => {
      // If we are already open, don't do anything.
      if (lightbox.isModalOpen === true) return;

      // Open modal
      lightbox.openModal(item);
    });

    // When transitioning back, make sure current item is still on top of everything.
    // Remove remove the extra line once transition finishes.
    item.addEventListener("transitionend", (event) => {
      item.style.zIndex = "";
    });
  });

  // Close modal
  lightbox.closeBtnElem.addEventListener("click", (event) => {
    lightbox.closeModal();
  });
});

// Handle resizes
window.addEventListener("resize", (event) => {
  viewportDimensions.width = html.clientWidth;
  viewportDimensions.height = html.clientHeight;

  // Recenter item
  if (currPresentedItem) {
    // TODO: Still buggy on resize but I am running out of time for this project.
    const centerTransformRules = centerStyle(currPresentedItem, currPresentedItemRect);
    currPresentedItem.setAttribute("style", `${centerTransformRules}`);
  }
});

// ? See explanation at the bottom
function centerStyle(item, rect) {
  if (!item) throw Error(`${item} is ${typeof item}.`);
  if (!rect) throw Error(`No boundingClientRect.`);
  // Get position of current element in relation to the viewport
  let boundingClientRect = rect;
  let boundingClientXY = item.getBoundingClientRect();

  const desiredY = -boundingClientXY.top + viewportDimensions.height / 2;
  const desiredX = -boundingClientXY.left + viewportDimensions.width / 2;

  console.log(desiredX, desiredY);

  const translateX = `translateX(calc(${desiredX}px - 50%))`;
  const translateY = `translateY(calc(${desiredY}px - 50%))`;

  // Figure out which one of width or hight of the item are closer to width of height of viewport
  const differenceY = viewportDimensions.height - boundingClientRect.height;
  const differenceX = viewportDimensions.width - boundingClientRect.width;

  // We can't use boundingClientRect.width here because it takes transformations into account.
  // And since we make items slightly bigger on hover... It gives inconsistent results.
  const computedHeight = parseFloat(window.getComputedStyle(item, null).height);
  const computedWidth = parseFloat(window.getComputedStyle(item, null).width);

  const scaleFactor =
    differenceX > differenceY
      ? viewportDimensions.height / computedHeight
      : viewportDimensions.width / computedWidth;

  // scaleFactor / 8 from my experience gives fairly consistent results, but this can be modified.
  const margins = scaleFactor / 8;
  const scale = `scale(${scaleFactor - margins})`;

  const transformStyle = `transform: ${translateX} ${translateY} ${scale}`;
  return transformStyle;
}

/*
    Explanation:
    The goal is to center the image from its current location, to the center of the viewport.

    Currently it looks like this: 

    ---------------
    |    ____     |
    |   |   |     |
    |   ----      |
    |_____________|

    boundingClientRect gives us (along other things) the distance in pixels from the left of the element to from the left of the viewport, and the distance in pixels from the top of the element to the top of the viewport.

    That means that translateY( -boundingClientRect.top ) effectively places the element at the top of the page, with the top of the element touching the top of the page.

    ---------------
    |   |   |     |
    |   ----      |
    |             |
    |_____________|

    We want to center it, so we half boundingClientRect.top and left.
    However, this will bring us to the classic centering using position absolute issue
    where the element is centered with its origin being its top left corner.


    ---------------
    |             |
    |        _____|
    |       |     |
    |_______|_____|


    To avoid this, we add - 50% (from itself) to this equation.

    ---------------
    |     ____    |
    |    |   |    |
    |    ----     |
    |_____________|

    Aaand were done! We can now center it using position absolute regardless of where it is sitting on the page and without setting position absolute, left's right's etc. 

    This means that the images are free to transition themselves all nicely to the center.
*/
