let word = '';

document.getElementById('btn').addEventListener('click', function () {
    word = document.getElementById('word').value.replace(/^\s+|\s+$/g, '');
    if (word === '')
        return;
    
    chrome.runtime.sendMessage({
        origin: 'ntgd-popup.js',
        word: word
    }, function (resp) {
        showResult(resp);
    });
});

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