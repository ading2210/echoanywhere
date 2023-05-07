# EchoAnywhere

This is a POC demonstrating the (limited) use of `chrome.echoPrivate` on any webpage.

## Explanation:
This page exploits the Chrome Goodies component extension, which is used to check device eligibility on the Chromebook Perks page. That page works by putting an extension page inside an iframe (`chrome-extension://kddnkjkcjddckihglkfcickdhbmaodcn/broker.html`) and posting messages to it to allow communication with the extension.

For whatever reason, this is also allowed by the extension on any webpage. Thus, any webpage is able to pretend to be the Perks page and post messages to the iframe in order to redeem codes and get the existing offers.

The webpage can then simply call `iframe.contentWindow.postMessage` on the iframe, which proxies either `chrome.echoPrivate.getUserConsent` or `chrome.echoPrivate.getOfferInfo`. This allows the webpage to leak any existing promo codes, even without user consent. It could also potentially trick the user into redeeming other codes, since the title of the redemption prompt can be arbitrarily changed.

## License:
This repository is licensed under the GNU GPL v3.