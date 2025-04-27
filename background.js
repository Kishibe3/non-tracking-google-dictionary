let lang = 'zh-TW';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if ((request.origin === 'ntgd-content.js' || request.origin === 'ntgd-popup.js') && request.word !== '') {
        fetch('https://clients5.google.com/translate_a/single?dj=1&dt=t&dt=sp&dt=ld&dt=bd&client=dict-chrome-ex&sl=auto&tl=' + lang + '&q=' + request.word)
        .then(e => e.json())
        .then(e => sendResponse(e))
        .catch(e => {console.log('There is something wrong with internet connection.');});
        return true;
    }
});

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        id: 'ntgd',
        title: 'Translate selected words',
        contexts: ['selection']
    });
});

chrome.contextMenus.onClicked.addListener(function (data, tab) {
    if (data.menuItemId === 'ntgd' && data.selectionText) {
        fetch('https://clients5.google.com/translate_a/single?dj=1&dt=t&dt=sp&dt=ld&dt=bd&client=dict-chrome-ex&sl=auto&tl=' + lang + '&q=' + data.selectionText)
        .then(e => e.json())
        .then(e => {
            // send to content.js
            chrome.tabs.sendMessage(tab.id, {
                origin: 'ntgd-background.js',
                word: data.selectionText,
                translated_result: e
            });
        })
        .catch(e => {console.log('There is something wrong with internet connection.');});
    }
});