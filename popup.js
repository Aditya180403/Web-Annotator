
  
document.getElementById('highlight-btn').addEventListener('click', () => {
    const highlightColor = document.getElementById('highlight-color').value;
    chrome.storage.local.set({ highlightColor });
  });
  
  document.getElementById('save-note-btn').addEventListener('click', () => {
    const note = document.getElementById('note').value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'saveNote', note }, (response) => {
        if (response.status === 'note saved') {
          document.getElementById('note').value = '';
          displayAnnotations();
        }
      });
    });
  });
  
  document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search').value.toLowerCase();
    displayAnnotations(query);
  });
  
  function displayAnnotations(query = '') {
    chrome.storage.local.get(['annotations'], function(result) {
      const annotationsList = document.getElementById('annotations-list');
      annotationsList.innerHTML = '';
      const annotations = result.annotations || {};
      Object.keys(annotations).forEach(pageUrl => {
        annotations[pageUrl].forEach(annotation => {
          if (annotation.text && annotation.text.toLowerCase().includes(query) || annotation.note && annotation.note.toLowerCase().includes(query)) {
            const annotationItem = document.createElement('div');
            annotationItem.className = 'annotation-item';
            annotationItem.textContent = annotation.text || annotation.note;
            annotationsList.appendChild(annotationItem);
          }
        });
      });
    });
  }
  document.getElementById('export-btn').addEventListener('click', () => {
    chrome.storage.local.get(['annotations'], function(result) {
      const annotations = result.annotations || {};
      const blob = new Blob([JSON.stringify(annotations, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = 'annotations.json';
      a.click();
    });
  });
  
  
  displayAnnotations();
 