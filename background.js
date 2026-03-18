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

