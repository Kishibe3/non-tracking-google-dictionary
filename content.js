let word = '';  // selected word

async function process() {
    word = getSelection().toString().replace(/^\s+|\s+$/g, '');
    word = he.encode(word);
    if (getSelection().isCollapsed === true)
        return;
    
    // retry if background.js is sleeping
    for (let i = 0, send = false; i <= 5 && !send; i++) {
		send = await new Promise(resolve => {
			try {
				chrome.runtime.sendMessage({
					origin: 'ntgd-content.js',
					word: word
				}, function (resp) {
					if (chrome.runtime.lastError)
						resolve(false);
					else {
						if (document.getElementById('ntgd-bubble') === null)
							showBubble(resp);
						resolve(true);
					}
				});
			}
			catch (e) {
				resolve(false);
			}
		});
        if (send)
            break;
        await new Promise(e => setTimeout(e, 3000));
    }
}

document.addEventListener('mousedown', e => {
    let t = document.querySelector('#ntgd-bubble');
    if (t && !t.contains(e.target))
        t.remove();
});
document.addEventListener('mouseup', process);
document.addEventListener('dblclick', process);

function showBubble(resp) {
    word = he.encode(word);
    let bubble = document.createElement('div');
    bubble.id = 'ntgd-bubble';
    bubble.shadow = bubble.attachShadow({mode: 'open'});
    bubble.shadow.innerHTML = `<style>* {box-sizing: border-box;} #ntgd-bubble-main {background-color: #FFD; z-index: 99997; border: 1px solid #999; border-radius: 4px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.5); color: #222; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 14px; line-height: normal; padding: 9px; position: absolute; width: 300px;} #ntgd-bubble-close {position: absolute; top: 0; right: 0; width: 16px; height: 16px; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAYUlEQVQYV12PwQ2AMAwD2w3YBEaAycsIsAkbgC+qowikeyCfHLe31l5xiUM8gm8RQ2x9hmuRECIUNwL2KSwhRCh2BFda4j9CTlbBtQi5ySfy5mzMTXWka3FyEwLPzJv/TR8o8xvGTnBWXwAAAABJRU5ErkJggg=='); background-position: center; background-repeat: no-repeat; cursor: pointer; opacity: 0.35;} #ntgd-bubble-query {display: inline-block; height: 20px; vertical-align: top; font-size: 16px; font-weight: bold;} #ntgd-bubble-meaning {line-height: 1.3; margin-top: 9px;} a {text-decoration: none; color: black;} a:hover {text-decoration: underline;} ul {list-style-type: circle; padding-left: 30px; margin: 0px;} #ntgd-arrow {position: absolute; z-index: 99998;} #ntgd-arrow-inner-up, #ntgd-arrow-inner-down {background: transparent; border-left: 10px solid transparent; border-right: 10px solid transparent; left: 2px; position: absolute; width: 0; z-index: 99999;} #ntgd-arrow-inner-up {border-bottom: 10px solid #ffd; top: 2px;} #ntgd-arrow-inner-down {border-top: 10px solid #ffd;} #ntgd-arrow-outer-up, #ntgd-arrow-outer-down {background: transparent; border-left: 12px solid transparent; border-right: 12px solid transparent; left: 0; position: absolute; width: 0;} #ntgd-arrow-outer-up {border-bottom: 12px solid #999;} #ntgd-arrow-outer-down {border-top: 12px solid #999;}</style>`;
    if (!getSelection() || getSelection().rangeCount === 0)
        return;
    let select = getSelection().getRangeAt(0).getBoundingClientRect();
    let bubbleMain = document.createElement('div');
    bubbleMain.id = 'ntgd-bubble-main';
    bubbleMain.innerHTML = 
    `<div id="ntgd-bubble-close"></div>
    <a id="ntgd-bubble-query" target="_blank" href="https://translate.google.com?sl=auto&tl=zh-TW&q=${word}">${word}</a>
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
    bubble.shadow.append(bubbleMain);
    document.documentElement.append(bubble);

    let pointTo = (select.top - 12 - bubbleMain.offsetHeight < 0), l = (select.left + select.right - bubbleMain.offsetWidth) / 2 + window.pageXOffset;
    if ((select.left + select.right + bubbleMain.offsetWidth) / 2 > document.documentElement.offsetWidth)
        l = window.pageXOffset + document.documentElement.offsetWidth - bubbleMain.offsetWidth;
    if (l < window.pageXOffset)
        l = window.pageXOffset;
    bubbleMain.style.left = l + 'px';
    bubbleMain.style.top = pointTo ? (select.bottom + window.pageYOffset + 12 - 1) + 'px' : (select.top + window.pageYOffset - 12 - bubbleMain.offsetHeight + 1) + 'px';

    let bubbleArrow = document.createElement('div');
    bubbleArrow.id = 'ntgd-arrow'
    bubbleArrow.innerHTML = 
    pointTo ? 
        `<div id="ntgd-arrow-inner-up"></div>
        <div id="ntgd-arrow-outer-up"></div>`
     : 
        `<div id="ntgd-arrow-inner-down"></div>
        <div id="ntgd-arrow-outer-down"></div>`;
    bubbleArrow.style.left = ((select.left + select.right - 24) / 2 + window.pageXOffset) + 'px';
    bubbleArrow.style.top = pointTo ? (select.bottom + window.pageYOffset) + 'px' : (select.top - 12 + window.pageYOffset) + 'px';
            
    bubble.shadow.append(bubbleArrow);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.origin === 'ntgd-background.js' && request.word !== '' && request.translated_result !== '') {
        word = request.word;
        showBubble(request.translated_result);
    }
});
