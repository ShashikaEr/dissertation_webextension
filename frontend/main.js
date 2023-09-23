function checkActiveStatus() {
    browser.runtime.sendMessage({ action: "checkActiveStatus" });
  }
  function checklocalBlaklist() {
    browser.runtime.sendMessage({ action: "checklocalBlaklist" });
  }
  function checklocalstoragePermission(){
    browser.runtime.sendMessage({ action: "checklocalstoragePermission" });
  }
  function checkdeveloperBlaklist() {
    browser.runtime.sendMessage({ action: "checkdeveloperDatabase" });
  }
  checkActiveStatus();
  const currentURL = window.location.href;
  console.log("Current URL:", currentURL);

browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "activeStatus") {
        const active = Boolean(message.data);
        if (active) { 
            console.log("Extension is enabled");
            checklocalstoragePermission(); //call for the function to check localstorge access
            browser.runtime.onMessage.addListener(function (message, sender, sendResponse) { //listener for messages
            if (message.action === "storageAllow"){ //if message action is "storageAllow" execute below
                const localaccess = Boolean(message.data); //message data assign to variable(boolean value)
                console.log("Local storage access status", localaccess); //Print true or false
            if(localaccess){ //if local access is allowed, execute below
                checklocalBlaklist(); //call for the function to check in blacklist
                browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "checkblacklist") { //if message action is "checkblacklist" execute below
        const localblacklistURLs = message.data; //get the data from message and assign to variable
    if(localblacklistURLs.includes(currentURL)){ //check whether current url includes in local blacklist data
      console.log("URL is available in local blacklist");
    alert("Blacklist URL"); //if yes, alert user
    }
    else{ //if not available, execute below
      console.log("URL is not available in local blacklist");//console message
      developerDB(); //call for the function to initiate developer blacklist check
    }
}
});
}
else{
  developerDB();
}
}
});
}
}
 
});

function developerDB(){ //function to check developer blacklist
    checkdeveloperBlaklist(); //call for the function to send message to background script
    browser.runtime.onMessage.addListener(function (message, sender, sendResponse) { //listener to messages
        if (message.action === "developerDatabase"){ //if message action is "developerDatabase", execute below
            const access = Boolean(message.data); //message data assign to variable(boolean value)
            console.log("Developer database status", access); //Print true or false
            if(access){ //if developer access is allowed execute below
              //assign the current URL and localhost server link to the variable with encoding
        const fetchURL = 'http://localhost/web_extension/core/init.php?url=' + encodeURIComponent(currentURL); 
        console.log("Fetch URL:", fetchURL); //print log message
        
        fetch(fetchURL) //using fetch API send the url to server(HTTP GET request)
            .then(response => response.json()) //take the response and convert to a jason object
            .then(data => { //data of the jason object used
            if (data.exists) { //if data exisit, execute below
                console.log('Phishing url found in developer blacklist'); //print log message
                alert('Phishing WebSite'); //alert user
            } else { //if data is not available
                console.log('URL not found in the developer blacklist.');//print log message  
                algorithm(); //execute the rule-based algorithm function
        }
            })
            .catch(error => {//if any error when handling fetch
            console.error('An error occurred:', error); //log a message
            });
        }
        else{ //if developer database access is not allowed, execute below
            algorithm(); //execute the rule-based algorithm function
        }
        }});
}


  function algorithm(){
      console.log('Algorithm is running');
  var total = 0; //declaring and initialise 0 to the total at the begining
  var threshold=0.3; //set a threshold value
  
  
  //Rule 1 - Check for suspicious characters in URL hostname
  const suspiciousCharacters = ["-", "#", "_", "@"]; //define the suspicious chars and assign to the variable
  const hostname = new URL(currentURL).hostname; //create a URL object and assign the hostname part
  //check for atleast one suspicious char is available in the hostname part and assign true or false
  const checksuspiciousCharacters = suspiciousCharacters.some(char => hostname.includes(char));
  if (checksuspiciousCharacters) { //if true, execute below
   console.log('Current URL has suspicious characters');//print the log message
   total += 0.1; //increment total by 0.1
  } else { //if false, esecute below
   console.log('Current URL has no suspicious characters.'); //print log message
  }
  
  //Rule 2 - Check for <script data-cookieconsent="ignore">
  function checkCookieConsentIgnoreScript() { //define function to check cookie-consent ignore tag
    //using querySelectorAll, find all the script ellements and assigned to variable
   const scripts = document.querySelectorAll('script[data-cookieconsent="ignore"]');
   return scripts.length > 0; //if variable length is greater than 0, return true
  }
  const hasIgnoreScript = checkCookieConsentIgnoreScript();//calling for the function
  if (hasIgnoreScript) { //if returned value is true, execute below
   console.log('Cookie consent ignore script is available'); //print console log message
   total += 0.1; //increment total by 0.1
  } else { //if return value is false,
   console.log('Cookie consent ignore script is not available'); //print log message
  }
  
  //Rule 3 - Check for cookies settings/ preference banner/popup display for users
  function hasCookieSettingClasses() { //define function to check cookies preference banner
    //looking for class names with cookie settings
   const cookieSettingElements = document.querySelectorAll('[class^="cookie-setting"], [class*="cookie setting"],[class*="cookie-setting"],[class^="cookie setting"]');
   //select all nodelist and filter with id and text which include cookie elements
   const idElements = Array.from(document.querySelectorAll('*')).filter(tag => 
        (tag.id && tag.id.includes('cookie')) || tag.textContent.includes('cookie')
      );
   return cookieSettingElements.length > 0 || idElements.length > 0; //if found any element return true
  }
  const hasCookieSettingClassesElement = hasCookieSettingClasses(); //calling for the function
  if (hasCookieSettingClassesElement) { //if returned value is true, execute below
   console.log("'cookie-setting' or containing 'cookie setting' are present on the page.");//print log message
  } else { //if retrun value is false, execute below
   console.log("No  'cookie-setting' or containing 'cookie setting' are present on the page."); //print log message
   total += 0.1; //increment total by 0.1 if cookie preference banner or message not available
  }
  
  //Rule 4 - @ and // symbol in URLs within the url
  function hasSpecialCharactersAfterProtocol() { //define the function to check special chars
   const currentURL = window.location.href.toLowerCase(); //extract the current URL
   const protocolIndex = currentURL.indexOf("://"); //find the index of ://
 if (protocolIndex !== -1) { //if :// found, execute below
     const afterProtocol = currentURL.substring(protocolIndex + 3); //skip the first :// and take the remaining part 
     return afterProtocol.includes("@") || afterProtocol.includes("//"); //if @ or // available in the remaining part
   }
 return false; 
  }
   if (hasSpecialCharactersAfterProtocol()) { //check the return value of the function
   console.log("URL contains '@' or '//' after a protocol."); //if true print log message
   total += 0.1; //increment total by 0.1;
  }
  else{ //if return value is false, print below line
   console.log("URL doesn't contains '@' or '//' after a protocol.");
  }
  
  //Rule 5 - javascripts avaialabilty 
  
  const scriptTags = document.querySelectorAll('script'); //select all elements with script
  if (scriptTags.length > 0) { //if the length is greater than 0
   console.log('JavaScript available.'); //print console log message
   total += 0.1; //increment total by 0.1
  } else { //if no scripts found, print below on console
   console.log('No JavaScript found.');
  }
  
  //Rule 6 - iframe availability
   function hasIFrames() { //define function to check iframe availability
   const iframeElements = document.getElementsByTagName('iframe'); //find and assign elements with iframe tag name
   const iframes = document.querySelectorAll('iframe'); //select all elements with iframe 
   return iframeElements.length > 0 || iframes.length > 0; //check if both variables has data by length
  }
  const hasIFramesElement = hasIFrames(); //calling for the function
  
  if (hasIFramesElement) { //if returned value is true, execute below
   console.log("The page contains <iframe> elements."); //print the console log message
   total += 0.1; //increment total by 0.1
   
   //Check the iframe src subdomains
   const iframes = document.querySelectorAll('iframe'); //select all elements with iframe
   const mainURL = window.location.hostname;//extract the current url
   for (const iframe of iframes) { //iterate throug nodelist 
    let mismatchFound = true; //initialized mismatchFound to true at the begining
   try {
       const iframeSrc = new URL(iframe.src); //parses iframe src atribute to url object
       const iframeHost = iframeSrc.hostname; //extract the hostname of the src
       const mainDomains = mainURL.split('.').reverse(); //split the main url into subdomains and reverse
       const iframeDomains = iframeHost.split('.').reverse(); //split the hostname url into subdomains and reverse
       mainDomains.shift(); // Remove Top level Domain
       iframeDomains.shift(); // Remove Top level Domain
       // Check if any subdomain of the main URL matches any subdomain of the iframe's subdomains
       for (const mainDomain of mainDomains) { //iterates through subdomains
         if (iframeDomains.includes(mainDomain)) { //check any iframe subdomain matching with main url subdomains
          if(mainDomain==='www'){ //if www id matching continue iteration
            continue;
          }
          else{
          console.log('iframesub:',iframeDomains); //print console log message
          console.log('mainSub:',mainDomains); //print console log message
          console.log('Subdomain match found', mainDomain); //print console log message
           mismatchFound = false; // mismatch found set variable to false
           break; //stop the iteration for current iframe and continue with next
          }
         }
       }
       if (mismatchFound) { //if no match found
        total += 0.1; //increment total by 0.1
        console.log('Mismatch value'); //print log message
         break; //stop iterating 
       }
     } catch (error) { //if any error
       console.error('Error checking iframe'); //print log message
     }   }
  } else { //if iframe doesnt found
   console.log("The page doesn't contain <iframe> elements."); //print log message
  }
  
  //Check for phishing site
  if(total>=threshold){ //compare the total value with threshold value
   alert("Phishing site");// if true alert user
  }
      
  }
  
    browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.action === "addtoblacklist") {
        const addtoblacklist = message.data;
        alert(addtoblacklist);
      }
      if (message.action === "alreadyinblacklist") {
        
        const alreadyinblacklist = message.data;
        alert(alreadyinblacklist);
      }
    });
  
  
  
  
    
  
  
    
   
  
    
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  