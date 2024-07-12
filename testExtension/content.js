// Create the cat element only if it doesn't already exist
let cat = document.getElementById('wandering-cat');
if (!cat) {
  cat = document.createElement('img');
  cat.id = 'wandering-cat';
  cat.src = chrome.runtime.getURL('cat.png'); // Ensure you have a cat.png image in your extension directory
  cat.style.position = 'fixed';
  cat.style.width = '50px';
  cat.style.height = '50px';
  cat.style.zIndex = '1000';
  cat.style.transition = 'left 2s, top 1s';

  // Add the cat to the body
  document.body.appendChild(cat);
}

let currentElement = null;
let observer = null;

// Function to check if an element is in the viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Function to get a random visible element to interact with
function getRandomVisibleElement(minDistance) {
  const elements = document.querySelectorAll('img, p, h1, h2, h3');
  const visibleElements = Array.from(elements).filter(isElementInViewport);

  if (visibleElements.length > 0) {
    // Get the current position of the cat
    const catRect = cat.getBoundingClientRect();
    let filteredElements = visibleElements.filter(el => {
      const rect = el.getBoundingClientRect();
      const distance = Math.sqrt(Math.pow(rect.left - catRect.left, 2) + Math.pow(rect.top - catRect.top, 2));
      return distance >= minDistance;
    });

    // If no elements are far enough, just use all visible elements
    if (filteredElements.length === 0) {
      filteredElements = visibleElements;
    }

    return filteredElements[Math.floor(Math.random() * filteredElements.length)];
  }
  return null;
}

// Function to move the cat to an element
function moveCatToElement(element) {
  currentElement = element;
  updateCatPosition();
  observeElementPosition(element);
}

// Function to update the cat's position in three steps
function updateCatPosition() {
  if (currentElement) {
    const rect = currentElement.getBoundingClientRect();
    const elementWidth = rect.width;
    const elementHeight = rect.height;

    // Calculate the target positions
    let targetX = rect.left + Math.random() * (elementWidth - cat.offsetWidth);
    let targetY = rect.top - cat.offsetHeight;

    // Ensure the target positions are within the viewport
    targetX = Math.max(0, Math.min(targetX, window.innerWidth - cat.offsetWidth));
    targetY = Math.max(0, Math.min(targetY, window.innerHeight - cat.offsetHeight));

    // Step 1: Move the cat to the bottom of the screen
    cat.style.top = `${window.innerHeight - cat.offsetHeight}px`;

    // Step 2: Move the cat to the target X position
    setTimeout(() => {
      cat.style.left = `${targetX}px`;

      // Step 3: Move the cat to the target Y position
      setTimeout(() => {
        cat.style.top = `${targetY}px`;
      }, 2000); // Adjust the duration as needed
    }, 1000); // Adjust the duration as needed
  }
}

// Function to make the cat interact with the page
function interactWithPage() {
  const minDistance = 100; // Minimum distance the cat must travel in pixels
  const element = getRandomVisibleElement(minDistance);
  if (element) {
    moveCatToElement(element);
  }
}

// Function to observe the position of the current element
function observeElementPosition(element) {
  if (observer) {
    observer.disconnect();
  }

  observer = new MutationObserver(updateCatPosition);

  observer.observe(element, {
    attributes: true,
    attributeFilter: ['style', 'class'],
    childList: true,
    subtree: true
  });

  const intersectionObserver = new IntersectionObserver(updateCatPosition, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });

  intersectionObserver.observe(element);
}

// Move the cat at intervals and interact with the page
setInterval(interactWithPage, 7000); // Interact every 3 seconds
