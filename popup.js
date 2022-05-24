let word = '';

setTimeout(function () {
    document.getElementById('word').focus();
}, 300);

function showResult(resp) {
    word = he.encode(word);
    let bubbleMain = document.querySelector('#ntgd-bubble-main');
    if (bubbleMain)
        bubbleMain.remove();
    
    bubbleMain = document.createElement('div');
    bubbleMain.id = 'ntgd-bubble-main';
    bubbleMain.innerHTML = 
    `<a id="ntgd-bubble-query" target="_blank" href="https://translate.google.com?sl=auto&tl=zh-TW&q=${word}">${word}</a>
    <div id="ntgd-bubble-meaning">` + 
        (resp.hasOwnProperty('dict') ? 
            `<ul>
                ${resp.dict.map(e => `<li><b>${e.pos}</b><div>${e.terms.join(', ')}</div></li>`).join('')}
            </ul>`
        : resp.hasOwnProperty('sentences') ?
            `${resp.sentences.map(e => e.trans).join(', ')}`
        :
            `Not Found.`
        ) + 
    `</div>`;

    document.body.append(bubbleMain);
}

function process() {
    word = document.getElementById('word').value.replace(/^\s+|\s+$/g, '');
    if (word === '')
        return;
    
    chrome.runtime.sendMessage({
        origin: 'ntgd-popup.js',
        word: word
    }, function (resp) {
        showResult(resp);
    });
}

document.getElementById('btn').addEventListener('click', process);
document.body.addEventListener('keydown', function (e) {
    if (e.key === 'Enter')
        process();
});