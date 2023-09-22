

browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
    if (message.action === "checklocalBlaklist") {  
      const savedURLs = localStorage.getItem('blacklistURLs');
      const blacklistURLs = savedURLs ? JSON.parse(savedURLs) : [];     
      browser.tabs.sendMessage(currentTab.id, {
            action: "checkblacklist",
            data: blacklistURLs,
        });
    }
    if(message.action === "checkdeveloperDatabase"){
        const isChecked = localStorage.getItem("developerCheckboxState") === "true";
        browser.tabs.sendMessage(currentTab.id, {
                    action: "developerDatabase",
                    data: isChecked,
                  });
             
    }
    if(message.action === "checklocalstoragePermission"){
      const isAllowed = localStorage.getItem("localstoragePermission") === "true";
      browser.tabs.sendMessage(currentTab.id, {
                  action: "storageAllow",
                  data: isAllowed,
                });
           
  }
    if(message.action === "checkActiveStatus"){
        const isActive = localStorage.getItem("activateCheckboxState") === "true";
        browser.tabs.sendMessage(currentTab.id, {
                    action: "activeStatus",
                    data: isActive,
                  });
             
    }
});
  });

const developerCheckbox = document.getElementById("developerCheckbox");
const isChecked = localStorage.getItem("developerCheckboxState") === "true";
developerCheckbox.checked = isChecked;
developerCheckbox.addEventListener("change", function () {
  const isChecked = developerCheckbox.checked;
  localStorage.setItem("developerCheckboxState", isChecked.toString());
});

const localstoragePermission = document.getElementById("localstoragePermission");
const isAllowed = localStorage.getItem("localstoragePermission") === "true";
localstoragePermission.checked = isAllowed;

localstoragePermission.addEventListener("change", function () {
  const isAllowed = localstoragePermission.checked;

  localStorage.setItem("localstoragePermission", isAllowed.toString());
});

const activateCheckbox = document.getElementById("activateCheckbox");
const isActive = localStorage.getItem("activateCheckboxState") === "true";
activateCheckbox.checked = isActive;


activateCheckbox.addEventListener("change", function () {
  const isActive = activateCheckbox.checked;
  localStorage.setItem("activateCheckboxState", isActive.toString());
});

