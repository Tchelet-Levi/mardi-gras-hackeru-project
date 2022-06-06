// This is my solution. I prefer doing this instead of animating with height because it leverages CSS's timing functions which means I wont have to calculate them myself. I am not good with math lol.
// Note: This is not good for performance. Tested on an old Samsung Note 5, it's slightly laggy but not horrible. Modern devices shouldn't have a problem with it.

const accordions = document.querySelectorAll(".accordion-title-container");

accordions.forEach((accordion) => {
  accordion.addEventListener("click", (event) => {
    const parent = accordion.parentElement;
    const collapsableWrapper = parent.querySelector(".accordion-collapsing-wrapper");
    const contentHeight = parent.querySelector(".accordion-content").scrollHeight;
    const icon = parent.querySelector("ion-icon");

    // Make sure all others are no longer expanded.
    collapseAll(accordion);

    // Toggle expanded class
    collapsableWrapper.classList.toggle("expanded");

    // If we're supposed to be expanded, set max-height to contentHeight
    if (collapsableWrapper.classList.contains("expanded")) {
      collapsableWrapper.style.maxHeight = `${contentHeight}px`;
      icon.classList.add("flipped");

      // Make sure to support screen readers
      parent.setAttribute("aria-expanded", true);
    }

    // If we're not supposed to be expanded, max-height is 0.
    if (!collapsableWrapper.classList.contains("expanded")) {
      collapsableWrapper.style.maxHeight = `${0}px`;
      icon.classList.remove("flipped");

      // Make sure to support screen readers
      parent.setAttribute("aria-expanded", false);
    }
  });
});

/**
 * Will remove all classes and set max-height to 0px on all elements except for current accordion (if provided).
 * */
function collapseAll(currentAccordion) {
  accordions.forEach((accordion) => {
    // Don't remove the expanded from the current accordion.
    if (currentAccordion === accordion) return;

    const parent = accordion.parentElement;
    const collapsableWrapper = parent.querySelector(".accordion-collapsing-wrapper");
    const icon = parent.querySelector("ion-icon");

    collapsableWrapper.classList.remove("expanded");
    collapsableWrapper.style.maxHeight = `${0}px`;
    parent.setAttribute("aria-expanded", false);

    icon.classList.remove("flipped");
  });
}
