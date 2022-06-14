/*

  The problem:
    Loading every youtube video at once is extremely resource intensive, uses a lot of internet bandwidth and generally is bad for user experiences (very slow loading of the web page).
    Furthermore, once the iframe is there, if you click on it, it will control the video;
    not the lightbox item, which means you wont be able to click on it, enlarge it,
    and play the video.

  The goal:
    By default, every youtube-container is going to display the thumbnail image of the youtube video (iframe) we want to show (since it is much cheaper to load images than iframes).
    Once the user clicks on it, it will allow us to enlarge the video. Clicking on it again once enlarged will allow us to switch out the img tag with the iframe of the full video.
    Once we close the the lightbox modal, switch back to the img thumbnail and allow the process to be repeated indefinitely.

  Thoughts & Problems: 
    This will require communication between lightbox and the youtube-container.
    How will youtube-container know if the lightbox is expanded or not?
    Possible solution: make lightbox emit events whenever something is opened and closed.

    * EDIT 1: Added global event emitters for whenever a lightbox gets opened or closed.
    ! EDIT 2: Current solutions is not a perfect solution. CSS transforms may cause blurry pictures due to          sub-pixel precisions errors (on Chrome based browsers).
*/

let isModalOpen = false;

// deep copy of the youtube-container element we replace an iframe with.
let youtubeContainerDeepCopy = null;

// Listen to the custom events, and get the detail from it.

// Open modal
document.addEventListener("onLightboxModalOpen", (e) => {
  const openedElem = e.detail.currentElement;
  isModalOpen = true;

  // Make a deep copy of youtube-container
  const youtubeContainerElem = openedElem.querySelector(".youtube-container");

  // If didn't click on a youtube elem return.
  if (youtubeContainerElem === null) return;

  youtubeContainerDeepCopy = youtubeContainerElem.cloneNode(true);

  // Replace the contents of youtube-container with the iframe
  const iframeElem = iframeFactory(youtubeContainerElem);
  youtubeContainerElem.innerHTML = "";
  youtubeContainerElem.appendChild(iframeElem);

  // Add styles to modal
  const elemDimensions = { width: openedElem.offsetWidth, height: openedElem.offsetHeight };
  const scaleRule = parseFloat(openedElem.style.cssText.match(/scale\((.+)\)/)[1]);
  const transformStyle = `
  transform:  
  translateX(-50%) 
  translateY(-50%)
  scale(${1 / scaleRule})`;

  const sizeStyle = `
  width: ${Math.round(elemDimensions.width * scaleRule)}px; 
  height: ${Math.round(elemDimensions.height * scaleRule)}px`;

  const style = `${sizeStyle}; ${transformStyle};`;
  youtubeContainerElem.setAttribute("style", style);
});

// Close modal
document.addEventListener("onLightboxModalClosed", (e) => {
  const closedElem = e.detail.currentElement;

  isModalOpen = false;

  // Revert the changes to the youtube-container element and its children.
  const youtubeContainerElem = closedElem.querySelector(".youtube-container");

  // If didn't click on a youtube elem return.
  if (youtubeContainerElem === null) return;

  youtubeContainerElem.innerHTML = "";
  youtubeContainerElem.innerHTML = youtubeContainerDeepCopy.innerHTML;
  youtubeContainerDeepCopy = null;

  // remove styles from modal
  youtubeContainerElem.removeAttribute("style");
});

/**
 *
 * @param {*} url (img src)
 * @returns The video ID.
 * @example "https://img.youtube.com/vi/7i_0sUjBGdg/hqdefault.jpg"
 * return "7i_0sUjBGdg"
 */
function getYoutubeVideoID(url) {
  if (url.length === 0) throw Error("Invalid URL: URL empty.");

  // Return Group1 (the id) or null if none found.
  const regex = new RegExp("vi/(.+?(?=/))");
  return url.match(regex)[1];
}

function imageSrcToIframe(url) {
  const videoID = getYoutubeVideoID(url);
  if (videoID === null) throw Error("videoID is null.");

  const embeddedUrl = `https://www.youtube.com/embed/${videoID}`;
  return embeddedUrl;
}

function iframeFactory(youtubeContainer) {
  const img = youtubeContainer.querySelector("img");
  const embeddedURL = imageSrcToIframe(img.getAttribute("src"));

  const iframeElem = document.createElement("iframe");
  iframeElem.setAttribute("width", "560");
  iframeElem.setAttribute("height", "315");
  iframeElem.setAttribute("src", `${embeddedURL}`);
  iframeElem.setAttribute("title", "Youtube video player");
  iframeElem.setAttribute("frameborder", "0");
  iframeElem.setAttribute("allowfullscreen", "");
  iframeElem.setAttribute(
    "allow",
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  );

  return iframeElem;
}
