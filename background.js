let lang = 'zh-TW';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if ((request.origin === 'ntgd-content.js' || request.origin === 'ntgd-popup.js') && request.word !== '') {
        fetch('https://clients5.google.com/translate_a/single?dj=1&dt=t&dt=sp&dt=ld&dt=bd&client=dict-chrome-ex&sl=auto&tl=' + lang + '&q=' + request.word)
        .then(e => e.json())
        .then(e => sendResponse(e));
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

chrome.contextMenus.onClicked.addListener(function (data) {
    if (data.menuItemId === 'ntgd' && data.frameId > 0 && data.selectionText) {
        fetch('https://clients5.google.com/translate_a/single?dj=1&dt=t&dt=sp&dt=ld&dt=bd&client=dict-chrome-ex&sl=auto&tl=' + lang + '&q=' + data.selectionText)
        .then(e => e.json())
        .then(e => {});
    }
});