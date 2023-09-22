document.addEventListener('DOMContentLoaded', () => {
  const addToBlacklistButton = document.getElementById('addToBlacklistButton');
  const checkURL = document.getElementById('checkURL');

  addToBlacklistButton.addEventListener('click', () => {

    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];

      const currentURL = currentTab.url;
      const savedURLs = localStorage.getItem('blacklistURLs');
      const blacklistURLs = savedURLs ? JSON.parse(savedURLs) : [];

      if (!blacklistURLs.includes(currentURL)) {
        blacklistURLs.push(currentURL);
        localStorage.setItem('blacklistURLs', JSON.stringify(blacklistURLs))
        browser.tabs.sendMessage(currentTab.id, {
          action: "addtoblacklist",
          data: "URL added to blacklist.",
        });
      } else {
        browser.tabs.sendMessage(currentTab.id, {
          action: "alreadyinblacklist",
          data: "URL already in blacklist.",
        });
      }
    });
  });
  });
   document.addEventListener('DOMContentLoaded', () => {
    const myBlacklistLink = document.getElementById('myBlacklistLink');
    const userInstruction = document.getElementById('userInstruction');
    myBlacklistLink.addEventListener('click', () => {
      browser.tabs.create({ url: 'myblacklist.html' });
    });
    userInstruction.addEventListener('click', () => {
      browser.tabs.create({ url: 'userinstructions.html' });
    });
  });


  
  