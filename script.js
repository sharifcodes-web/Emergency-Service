// // script.js — Vanilla JS for: hearts counter, call button (coins deduction), call history, copy button (clipboard) & exact timestamps
// // Include this file just before </body>: <script src="./script.js"></script>

document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');

    // header icons / counters
    const headerHeartImg = header ? header.querySelector('img[src*="heart"]') : null;
    const headerCoinImg = header ? header.querySelector('img[src*="coin"]') : null;
    // header copy counter is a button like "2 Copy" — find it inside header
    const headerCopyBtn = header ? Array.from(header.querySelectorAll('button')).find(b => /copy/i.test(b.textContent)) : null;

    const heartCounterSpan = headerHeartImg ? headerHeartImg.closest('span') : null;
    const coinCounterSpan = headerCoinImg ? headerCoinImg.closest('span') : null;
    const cards = document.querySelectorAll('.bg-white.rounded-lg');
    const historyUl = document.querySelector('aside ul');
    const clearBtn = document.querySelector('aside button');

    if (!historyUl) {
        console.warn('Call history <ul> not found — check your aside markup.');
    }

    if (historyUl) historyUl.innerHTML = '';
    function readNumberFromSpan(span) {
        if (!span) return 0;
        const m = span.textContent.match(/\d+/);
        return m ? parseInt(m[0], 10) : 0;
    }
    function writeNumberToSpanWithImg(span, num) {
        if (!span) return;
        const img = span.querySelector('img');
        span.textContent = String(num) + ' ';
        if (img) span.appendChild(img);
    }

    function readCountFromButton(btn) {
        if (!btn) return 0;
        const m = btn.textContent.match(/\d+/);
        return m ? parseInt(m[0], 10) : 0;
    }
    function writeCountToButton(btn, num) {
        if (!btn) return;
        btn.textContent = `${num} Copy`;
    }
    writeNumberToSpanWithImg(heartCounterSpan, readNumberFromSpan(heartCounterSpan));
    writeNumberToSpanWithImg(coinCounterSpan, readNumberFromSpan(coinCounterSpan));
    if (headerCopyBtn) writeCountToButton(headerCopyBtn, readCountFromButton(headerCopyBtn));

    // format exact timestamp: YYYY-MM-DD HH:MM:SS
    function formatDateExact(d) {
        const y = d.getFullYear();
        const mo = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        const ss = String(d.getSeconds()).padStart(2, '0');
        return `${y}-${mo}-${day} ${hh}:${mm}:${ss}`;
    }
    cards.forEach((card) => {
        // HEART: increase header heart counter on click
        const heart = card.querySelector('img[src*="heart"], i.fa-regular.fa-heart, i.fa-heart');
        if (heart) {
            heart.style.cursor = 'pointer';
            heart.addEventListener('click', () => {
                const current = readNumberFromSpan(heartCounterSpan);
                writeNumberToSpanWithImg(heartCounterSpan, current + 1);
                if (heart.animate) {
                    heart.animate([
                        { transform: 'scale(1)' },
                        { transform: 'scale(1.2)' },
                        { transform: 'scale(1)' }
                    ], { duration: 180 });
                }
            });
        }

        const candidateButtons = Array.from(card.querySelectorAll('button'));
        const callBtn = candidateButtons.find(b => /call/i.test(b.textContent));
        const copyBtn = candidateButtons.find(b => /copy/i.test(b.textContent));

        if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
                const numEl = card.querySelector('h2');
                const serviceNumber = numEl ? numEl.textContent.trim() : '';

                try {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(serviceNumber);
                    } else {
                        const ta = document.createElement('textarea');
                        ta.value = serviceNumber;
                        ta.style.position = 'fixed'; ta.style.left = '-9999px';
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand('copy');
                        ta.remove();
                    }

                    // show alert (requirement)
                    alert(`Hotline copied to clipboard: ${serviceNumber}`);

                    // increment header copy counter
                    if (headerCopyBtn) {
                        const cur = readCountFromButton(headerCopyBtn);
                        writeCountToButton(headerCopyBtn, cur + 1);
                    }
                } catch (err) {
                    alert('Copy failed: ' + (err && err.message ? err.message : 'unknown'));
                }
            });
        }

        // CALL button: deduct coins, alert, and add a call-history item with exact timestamp
        if (callBtn) {
            callBtn.addEventListener('click', () => {
                const coins = readNumberFromSpan(coinCounterSpan);
                if (coins < 20) {
                    alert('Not enough coins — each call costs 20 coins.');
                    return;
                }

                const nameEl = card.querySelector('h3, h4');
                const numEl = card.querySelector('h2');
                const serviceName = nameEl ? nameEl.textContent.trim() : 'Service';
                const serviceNumber = numEl ? numEl.textContent.trim() : '';

                // deduct coins
                writeNumberToSpanWithImg(coinCounterSpan, coins - 20);

                // alert user
                alert(`Calling ${serviceName} — ${serviceNumber}`);

                // exact timestamp
                const now = new Date();
                const ts = formatDateExact(now);

                // add to call history (prepend - newest first)
                if (historyUl) {
                    const li = document.createElement('li');
                    const p = document.createElement('p'); p.className = 'font-semibold'; p.textContent = serviceName;
                    const s = document.createElement('span'); s.className = 'text-xs'; s.textContent = `${serviceNumber} • ${ts}`;
                    li.appendChild(p); li.appendChild(s);
                    historyUl.prepend(li);
                }
            });
        }
    });

    // Clear history button
    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            if (historyUl) historyUl.innerHTML = '';
        });
    }
});


// ----------------
// Helper
// const num = t => parseInt(t) || 0;
// const set = (el, txt) => el.innerHTML = txt;
// const time = () => {
//     let d = new Date();
//     return d.toISOString().replace("T", " ").split(".")[0];
// };

// // Elements
// const heartCounter = document.getElementById("heartCounter"),
//     coinCounter = document.getElementById("coinCounter"),
//     copyCounter = document.getElementById("copyCounter"),
//     callHistory = document.getElementById("callHistory"),
//     clearHistoryBtn = document.getElementById("clearHistory"),
//     cards = document.querySelectorAll(".card");

// // Copy
// cards.forEach(c => {
//     c.querySelector(".copyBtn").onclick = async () => {
//         let numText = c.querySelector(".service-number").textContent;
//         try {
//             await navigator.clipboard.writeText(numText);
//             alert("Hotline copied: " + numText);
//             set(copyCounter, `${num(copyCounter.textContent) + 1} Copy`);
//         } catch { alert("Failed to copy!"); }
//     };
// });

// // Call
// cards.forEach(c => {
//     c.querySelector(".callBtn").onclick = () => {
//         let name = c.querySelector(".service-name").textContent,
//             number = c.querySelector(".service-number").textContent,
//             coins = num(coinCounter.textContent);

//         if (coins < 20) return alert("Not enough coins!");
//         set(coinCounter, `<img src="./assets/coin.png" width="20"> ${coins - 20}`);
//         alert(`Calling ${name} (${number})`);

//         let li = document.createElement("li");
//         li.textContent = `${name} - ${number} • ${time()}`;
//         callHistory.prepend(li);
//     };
// });

// // Heart
// cards.forEach(c => {
//     c.querySelector(".heartBtn").onclick = () => {
//         set(heartCounter, `❤️ ${num(heartCounter.textContent) + 1}`);
//     };
// });

// // Clear History
// clearHistoryBtn.onclick = () => callHistory.innerHTML = "";

