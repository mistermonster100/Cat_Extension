document.getElementById('toggle-cat').addEventListener('change', (event) => {
  const catVisible = event.target.checked;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.executeScript(tabs[0].id, {
      code: `
        let cat = document.getElementById('wandering-cat');
        if (!cat) {
          cat = document.createElement('img');
          cat.id = 'wandering-cat';
          cat.src = '${chrome.runtime.getURL('cat.png')}';
          cat.style.position = 'fixed';
          cat.style.width = '100px';
          cat.style.height = '100px';
          cat.style.zIndex = '1000';
          cat.style.transition = 'left 1s, top 1s';
          document.body.appendChild(cat);
        }
        cat.style.display = '${catVisible ? 'block' : 'none'}';
      `
    });
  });
});

// Initialize the switch based on the current visibility of the cat
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.executeScript(tabs[0].id, {
    code: `
      (function() {
        const cat = document.getElementById('wandering-cat');
        return cat && cat.style.display !== 'none';
      })();
    `
  }, (results) => {
    if (results && results[0]) {
      document.getElementById('toggle-cat').checked = true;
    }
  });
});
