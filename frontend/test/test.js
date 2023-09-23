document.addEventListener('DOMContentLoaded', function() {
    //Array of URL objects with Status (0 for legitimate, 1 for phishing)
    const urlData = [
        { URL: 'http://www.iptvlinkusa.com/', Status: '0' },
        { URL: 'https://genius.com/Kendrick-lamar-dna-lyrics', Status: '0' },
        { URL: 'https://www.ingame.de/', Status: '0' },
        { URL: 'https://www.hfunderground.com/wiki/Ionosphere', Status: '0' },
        { URL: 'https://www.onecklace.com/fingerprint-jewelry/', Status: '0' },
        { URL: 'https://www.facebook.com/savers', Status: '0' },
        { URL: 'https://chicowhitaker.wordpress.com/', Status: '0' },
        { URL: 'https://www.alteredgamer.com/', Status: '0' },
        { URL: 'https://raphaelhammoud.wordpress.com/', Status: '0' },
        { URL: 'http://z80-heaven.wikidot.com', Status: '0' },

        { URL: 'https://ipfs.io/ipfs/bafybeibypplezegcx4izrjuliijemehr6vxhewqa67jpnefzbys6ehdd6q/', Status: '1' },
        { URL: 'https://bafybeibypplezegcx4izrjuliijemehr6vxhewqa67jpnefzbys6ehdd6q.ipfs.cf-ipfs.com', Status: '1' },
        { URL: 'https://bafybeibypplezegcx4izrjuliijemehr6vxhewqa67jpnefzbys6ehdd6q.ipfs.cf-ipfs.com/', Status: '1' },
        { URL: 'https://cloudflare-ipfs.com/ipfs/bafybeih5wd6tejd6od3bzlyn4ngqj46r3yovcqndoffkfjyqoijxeweo4u', Status: '1' },
        { URL: 'https://cloudflare-ipfs.com/ipfs/bafybeie5qwx2uvwzz4zq5oljdex25bculix2drspl5hzlq3yjkaw4qprly/rfvscvr4f3fevsf.html', Status: '1' },
        { URL: 'https://ipfs.io/ipfs/QmS994bS7gWxqZ8x1sU92cumAmeH1PCiA8L3QFgMnymSif/', Status: '1' },
        { URL: 'https://bafybeie5qwx2uvwzz4zq5oljdex25bculix2drspl5hzlq3yjkaw4qprly.ipfs.cf-ipfs.com/rfvscvr4f3fevsf.html', Status: '1' },
        { URL: 'https://bafkreihrgd7u3qrfwwar5cymm74e3gw6t4np2gwbc3nqlrrrngejdes4me.ipfs.cf-ipfs.com', Status: '1' },
        { URL: 'https://cloudflare-ipfs.com/ipfs/bafkreicnm3jowwk7zvihyd6z5c2m5llg3c72kbmuvv5zqkexncfjbv3neu', Status: '1' },
        { URL: 'https://bafkreicnm3jowwk7zvihyd6z5c2m5llg3c72kbmuvv5zqkexncfjbv3neu.ipfs.cf-ipfs.com', Status: '1' },

    ];

    function evaluateAlgorithm() {
        try {
          //declaring and initialising variables. (at the begining all variables are initalise with 0)
            let truePositives = 0; 
            let falsePositives = 0;
            let trueNegatives = 0;
            let falseNegatives = 0;

            urlData.forEach((row) => { //looping through URL array elements
                const url = row.URL; //store the URL from the array eleent
                const actualLabel = parseInt(row.Status); // store the actual status of the URL
                const algorithmLabel = applyRuleBasedAlgorithm(url); //store the predicted status by algorithm
                //conditional statements based on actual status and predicted status
                if (algorithmLabel === 1 && actualLabel === 1) {
                    truePositives++;
                } else if (algorithmLabel === 1 && actualLabel === 0) {
                    falsePositives++;
                } else if (algorithmLabel === 0 && actualLabel === 0) {
                    trueNegatives++;
                } else if (algorithmLabel === 0 && actualLabel === 1) {
                    falseNegatives++;
                }
            });

            // Calculate accuracy, precision, and recall
            const accuracy = (truePositives + trueNegatives) * 100 / urlData.length;
            const precision = truePositives *100 / (truePositives + falsePositives);
            const recall = truePositives *100 / (truePositives + falseNegatives);
        
            document.getElementById('accuracy').textContent = accuracy.toFixed(2); //passing the value to html page
            document.getElementById('precision').textContent = precision.toFixed(2);  //passing the value to html page
            document.getElementById('recall').textContent = recall.toFixed(2); //passing the value to html page
           //printing console messages
            console.log('Accuracy:', accuracy);
            console.log('TruePositive',truePositives);
            console.log('FalsePositive',falsePositives);
            console.log('FalseNegaitive',falseNegatives);
            console.log('TrueNegaitive',trueNegatives);
            console.log('Precision:', precision);
            console.log('Recall:', recall);
        } catch (error) {
            console.error('Error during evaluation:', error);
        }
    }

    function applyRuleBasedAlgorithm(url) {
        var total = 0;
        var threshold = 0.3;
        const currentURL =url;
        //Rule 1 - Check for suspicious characters in URL hostname
        
        const suspiciousCharacters = ["-", "#", "_", "@"];
        
        const hostname = new URL(currentURL).hostname;
        
        const hasSuspiciousCharacters = suspiciousCharacters.some(char => hostname.includes(char));
        
        if (hasSuspiciousCharacters) {
          total += 0.1;
        } else {
          console.log('Current URL has no suspicious characters.');
        }
        
        //Rule 2 - Check for <script data-cookieconsent="ignore">
        
        function checkCookieConsentIgnoreScript() {
          const scripts = document.querySelectorAll('script[data-cookieconsent="ignore"]');
          return scripts.length > 0;
        }
        const hasIgnoreScript = checkCookieConsentIgnoreScript();
        if (hasIgnoreScript) {
          console.log('Cookie consent ignore script is present');
          total += 0.1;
        } else {
          console.log('Cookie consent ignore script is not present');
        }
        
        //Rule 3 - Check for cookies settings/ preference display for users
        
        function hasCookieSettingClasses() {
          const cookieSettingElements = document.querySelectorAll('[class^="cookie-setting"], [class*="cookie setting"],[class*="cookie-setting"],[class^="cookie setting"]');
          const idElements = Array.from(document.querySelectorAll('*')).filter(tag => 
               (tag.id && tag.id.includes('cookie')) || tag.textContent.includes('cookie')
             );
          return cookieSettingElements.length > 0 || idElements.length > 0;
         }
        const hasCookieSettingClassesElement = hasCookieSettingClasses();
        
        if (hasCookieSettingClassesElement) {
          console.log("'cookie-setting' or containing 'cookie setting' are present on the page.");
        } else {
          console.log("No  'cookie-setting' or containing 'cookie setting' are present on the page.");
          total += 0.1;
        }
        
        //Rule 4 - @ and // symbol in URLs within the url
        function hasSpecialCharactersAfterProtocol() {
          const currentURL = window.location.href.toLowerCase();
          const protocolIndex = currentURL.indexOf("://");
          
          if (protocolIndex !== -1) {
            const afterProtocol = currentURL.substring(protocolIndex + 3); // Skip protocol and "://"
            return afterProtocol.includes("@") || afterProtocol.includes("//");
          }
        
          return false; 
        }
        
        if (hasSpecialCharactersAfterProtocol()) {
          console.log("The current URL contains '@' or '//' after a protocol.");
          total += 0.1;
        }
        else{
          console.log("The current URL doesn't contains '@' or '//' after a protocol.");
        }
        
        //Rule 5 - javascripts avaialabilty 
        
        const scriptTags = document.querySelectorAll('script');
        
        if (scriptTags.length > 0) {
          console.log('JavaScript available.');
          total += 0.1;
        } else {
          console.log('No JavaScript found.');
        }
        
        //Rule 6 - iframe availability
        
        function hasIFrames() {
          const iframeElements = document.getElementsByTagName('iframe');
          const iframes = document.querySelectorAll('iframe');
          return iframeElements.length > 0 || iframes.length > 0;
         }
         const hasIFramesElement = hasIFrames();
         
         if (hasIFramesElement) {
          console.log("The page contains <iframe> elements.");
          total += 0.1;
          
          //Check the iframe src subdomains
          const iframes = document.querySelectorAll('iframe');
          const mainURL = window.location.hostname;
          
          for (const iframe of iframes) {
           let mismatchFound = true;
         
            try {
              const iframeSrc = new URL(iframe.src);
              const iframeHost = iframeSrc.hostname;
              const mainDomains = mainURL.split('.').reverse();
              const iframeDomains = iframeHost.split('.').reverse();
            
           
              mainDomains.shift(); // Remove TLD
           
              iframeDomains.shift(); // Remove TLD
              // Check if any subdomain of the main URL matches any subdomain of the iframe's subdomains
              for (const mainDomain of mainDomains) {
                if (iframeDomains.includes(mainDomain)) {
                 if(mainDomain==='www'){
                   continue;
                 }
                 else{
                 console.log('iframesub:',iframeDomains);
                 console.log('mainSub:',mainDomains);
                 console.log('Subdomain match found', mainDomain);
                  mismatchFound = false; // Set the flag to indicate a mismatch
                  break; // Exit the loop for this iframe
                 }
                }
              }
         
              // If a mismatch was found in this iframe, break the loop for all iframes
              if (mismatchFound) {
               total += 0.1;
               console.log('Mismatch value');
                break;
              }
            } catch (error) {
              console.error('Error checking iframe');
            }
          }
         
         } else {
          console.log("The page does not contain <iframe> elements.");
         }
         
        
    

        if (total >= threshold) {
            return 1; // Phishing
        } else {
            return 0; // Legitimate
        }
    }

    // Call the evaluation function
    evaluateAlgorithm();
});
