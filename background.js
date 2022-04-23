let lang = 'zh-TW';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (sender.tab) {
        fetch('https://clients5.google.com/translate_a/single?dj=1&dt=t&dt=sp&dt=ld&dt=bd&client=dict-chrome-ex&sl=auto&tl=' + lang + '&q=' + request.word)
        .then(e => e.json())
        .then(e => sendResponse(e));
        return true;
    }
});