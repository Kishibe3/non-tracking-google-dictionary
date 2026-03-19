let word = '';

setTimeout(function () {
    document.getElementById('word').focus();
}, 300);

function showResult(resp) {
    let bubbleMain = document.querySelector('#ntgd-bubble-main');
    if (bubbleMain)
        bubbleMain.remove();
    
    bubbleMain = document.createElement('div');
    bubbleMain.id = 'ntgd-bubble-main';
    bubbleMain.innerHTML = 
    `<a id="ntgd-bubble-query" target="_blank" href="https://translate.google.com?sl=auto&tl=zh-TW&q=${encodeURIComponent(word)}"></a>
    <div id="ntgd-bubble-meaning">Not Found.</div>`;
    
    bubbleMain.querySelector('#ntgd-bubble-query').textContent = word;
    if (resp.hasOwnProperty('dict')) {
        bubbleMain.querySelector('#ntgd-bubble-meaning').innerHTML = 
        `<ul>
            ${resp.dict.map(e => `<li><b>${e.pos}</b><div>${e.terms.join(', ')}</div></li>`).join('')}
        </ul>`;
    }
    else if (resp.hasOwnProperty('sentences'))
        bubbleMain.querySelector('#ntgd-bubble-meaning').textContent = `${resp.sentences.map(e => e.trans).join(', ')}`;
    
    document.body.append(bubbleMain);
}

function process() {
    word = document.getElementById('word').value.replace(/^\s+|\s+$/g, '');
    if (word === '')
        return;

    // send to background.js
    chrome.runtime.sendMessage({
        origin: 'ntgd-popup.js',
        word: word
    }, function (resp) {
        showResult(resp);
    });
}

document.getElementById('word').addEventListener('input', process);
document.getElementById('btn').addEventListener('click', process);
document.body.addEventListener('keydown', function (e) {
    if (e.key === 'Enter')
        process();
});
