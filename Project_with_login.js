
/*
  Tambahan: Proteksi kata sandi sederhana.
  - Default PASSWORD = "rahasia123"
  - Ubah nilai PASSWORD di bawah jika ingin memakai kata sandi lain.
  - Script asli tidak diubah selain dibungkus dalam fungsi startBypass().
  - Jika kata sandi salah, script tidak akan aktif sehingga file tidak akan merusak atau menjalankan aksi.
*/
(function(){
    const PASSWORD = "kiwkiw"; // <-- Ganti kata sandi di sini jika perlu
    const overlayId = "mdw-password-overlay";

    if (document.getElementById(overlayId)) {
        // Jika overlay sudah ada, jangan buat lagi
    } else {
        const ov = document.createElement("div");
        ov.id = overlayId;
        Object.assign(ov.style, {
            position: "fixed", top: "0", left: "0", right: "0", bottom: "0",
            zIndex: 2147483646, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.6)", fontFamily: "system-ui, sans-serif"
        });

        const card = document.createElement("div");
        Object.assign(card.style, {
            width: "320px", padding: "18px", borderRadius: "10px", background: "linear-gradient(180deg, #111, #222)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)", color: "#fff", textAlign: "center"
        });

        const title = document.createElement("div");
        title.innerText = "Masukkan kata sandi untuk menjalankan script";
        title.style.marginBottom = "10px";
        title.style.fontSize = "14px";
        title.style.opacity = "0.95";
        card.appendChild(title);

        const input = document.createElement("input");
        input.type = "password";
        Object.assign(input.style, {
            width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #444",
            background: "#0b0b0b", color: "#fff", marginBottom: "10px", outline: "none", fontSize: "14px"
        });
        input.placeholder = "Kata sandi...";
        card.appendChild(input);

        const hint = document.createElement("div");
        hint.innerText = "Di buat oleh Cowo polos No: +6285942914772 Ini Gratis";
        hint.style.fontSize = "12px";
        hint.style.opacity = "0.6";
        hint.style.marginBottom = "12px";
        card.appendChild(hint);

        const btn = document.createElement("button");
        btn.innerText = "Buka";
        Object.assign(btn.style, {
            padding: "10px 14px", borderRadius: "8px", border: "none", cursor: "pointer",
            background: "#1f8ef1", color: "#fff", fontWeight: "600"
        });
        card.appendChild(btn);

        const msg = document.createElement("div");
        msg.style.marginTop = "10px";
        msg.style.fontSize = "13px";
        msg.style.opacity = "0.9";
        card.appendChild(msg);

        ov.appendChild(card);
        document.documentElement.appendChild(ov);

        function unlock() {
            const val = input.value || "";
            if (val === PASSWORD) {
                // Hapus overlay dan jalankan script
                ov.remove();
                try {
                    startBypass(); // memanggil fungsi utama yang berisi kode asli
                } catch (e) {
                    console.error("Gagal menjalankan startBypass():", e);
                }
            } else {
                msg.innerText = "Kata sandi salah.";
                msg.style.color = "#ff6b6b";
                // animasi kecil
                card.animate([{ transform: "translateX(0)" }, { transform: "translateX(-8px)" }, { transform: "translateX(8px)" }, { transform: "translateX(0)" }], { duration: 300 });
            }
        }

        btn.addEventListener("click", unlock);
        input.addEventListener("keydown", function(e){ if (e.key === "Enter") unlock(); });
    }

    // Definisi fungsi startBypass() berisi kode asli (dibawah)
})();


function startBypass() {
// ==UserScript==
// @name         Bypass Quizizz
// @version      34.0
// @description  Selesaikan pertanyaan Quizizz dengan perbaikan bug pada kontrol timeout.
// @author       Cowo.polos
// @icon         https://tse1.mm.bing.net/th/id/OIP.Ydweh29BuHk_PGD4dGJXbAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3
// @match        https://wayground.com/join/game/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // -----------------------------------------------------------------------------------
    // PENTING: DAFTAR KUNCI API
    // -----------------------------------------------------------------------------------
    const GEMINI_API_KEYS = [
        "CHAVE1",   // Kunci 1
        "CHAVE2",  // Kunci 2
        "CHAVE3"  // Kunci 3
    ];
    let currentApiKeyIndex = 0;
    let lastAiResponse = '';
    // -----------------------------------------------------------------------------------

    function waitForElement(selector, all = false, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const elements = all ? document.querySelectorAll(selector) : document.querySelector(selector);
                if ((all && elements.length > 0) || (!all && elements)) {
                    clearInterval(interval);
                    resolve(elements);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    reject(new Error(`Elemento(s) "${selector}" tidak ditemukan setelah ${timeout / 1000} detik.`));
                }
            }, 100);
        });
    }

    async function extrairDadosDaQuestao() {
    try {
        const questionTextElement = document.querySelector('#questionText .question-text-color');
        const questionText = questionTextElement ? questionTextElement.innerText.trim().replace(/\s+/g, ' ') : "Tidak dapat menemukan teks pertanyaan.";
        const questionImageElement = document.querySelector('img[data-testid="question-container-image"]');
        const questionImageUrl = questionImageElement ? questionImageElement.src : null;
        const extractText = (el) => {
            const mathElement = el.querySelector('annotation[encoding="application/x-tex"]');
            return mathElement ? mathElement.textContent.trim() : el.querySelector('#optionText')?.innerText.trim() || '';
        };

        const dropdownButtons = document.querySelectorAll('button.options-dropdown');
        if (dropdownButtons.length > 1) {
            console.log("Tipe Multiple Dropdowns terdeteksi.");
            const dropdowns = [];
            let questionTextWithPlaceholders = questionTextElement.innerHTML;

            dropdownButtons.forEach((btn, i) => {
                const placeholder = ` [JAWABAN ${i + 1}] `;
                const wrapper = btn.closest('.dropdown-wrapper');
                if (wrapper) {
                     questionTextWithPlaceholders = questionTextWithPlaceholders.replace(wrapper.outerHTML, placeholder);
                }
            });

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = questionTextWithPlaceholders;
            const cleanQuestionText = tempDiv.innerText.replace(/\s+/g, ' ');

            for (let i = 0; i < dropdownButtons.length; i++) {
                const btn = dropdownButtons[i];
                btn.click();
                try {
                    const optionElements = await waitForElement('.v-popper__popper--shown button.dropdown-option', true, 2000);
                    const options = Array.from(optionElements).map(el => el.innerText.trim());
                    dropdowns.push({ button: btn, options: options, placeholder: `[JAWABAN ${i + 1}]` });
                } catch (e) {
                    console.error(`Tidak dapat membaca opsi dropdown #${i+1}.`);
                    document.body.click();
                    await new Promise(r => setTimeout(r, 200));
                    continue;
                }
                document.body.click();
                await new Promise(r => setTimeout(r, 200));
            }

            return { questionText: cleanQuestionText, questionImageUrl, questionType: 'multi_dropdown', dropdowns };
        }

        if (dropdownButtons.length === 1) {
            return { questionText, questionImageUrl, questionType: 'dropdown', dropdownButton: dropdownButtons[0] };
        }

        const equationEditor = document.querySelector('div[data-cy="equation-editor"]');
        if (equationEditor) {
            return { questionText, questionImageUrl, questionType: 'equation' };
        }
        const droppableBlanks = document.querySelectorAll('button.droppable-blank');
        const dragOptions = document.querySelectorAll('.drag-option');
        if (droppableBlanks.length > 1 && dragOptions.length > 0) {
            const questionContainer = document.querySelector('.drag-drop-text > div');
            const dropZones = [];
            if (questionContainer) {
                const children = Array.from(questionContainer.children);
                for (let i = 0; i < children.length; i++) {
                    const blankButton = children[i].querySelector('button.droppable-blank');
                    if (blankButton) {
                        const precedingSpan = children[i - 1];
                        if (precedingSpan && precedingSpan.tagName === 'SPAN') {
                            let promptText = precedingSpan.innerText.trim().replace(/:\s*$/, '').replace(/\s+/g, ' ');
                            dropZones.push({ prompt: promptText, blankElement: blankButton });
                        }
                    }
                }
            }
            const draggableOptions = Array.from(dragOptions).map(el => ({ text: el.innerText.trim(), element: el }));
            return { questionText: questionContainer.innerText.trim(), questionImageUrl, questionType: 'multi_drag_into_blank', draggableOptions, dropZones };
        }
        if (droppableBlanks.length === 1 && dragOptions.length > 0) {
             const draggableOptions = Array.from(dragOptions).map(el => ({ text: el.querySelector('.dnd-option-text')?.innerText.trim() || '', element: el }));
            return { questionText, questionImageUrl, questionType: 'drag_into_blank', draggableOptions, dropZone: { element: droppableBlanks[0] } };
        }
        const matchContainer = document.querySelector('.match-order-options-container');
        if (matchContainer) {
            const draggableItems = Array.from(matchContainer.querySelectorAll('.match-order-option.is-option-tile')).map(el => ({ text: extractText(el), element: el }));
            const dropZones = Array.from(matchContainer.querySelectorAll('.match-order-option.is-drop-tile')).map(el => ({ text: extractText(el), element: el }));
            if (draggableItems.length > 0 && dropZones.length > 0) {
                const questionType = questionText.toLowerCase().includes('reorder') ? 'reorder' : 'match_order';
                return { questionText, questionImageUrl, questionType, draggableItems, dropZones };
            }
        }
        const openEndedTextarea = document.querySelector('textarea[data-cy="open-ended-textarea"]');
        if (openEndedTextarea) {
            return { questionText, questionImageUrl, questionType: 'open_ended', answerElement: openEndedTextarea };
        }
        const optionElements = document.querySelectorAll('.option.is-selectable');
        if (optionElements.length > 0) {
            const isMultipleChoice = Array.from(optionElements).some(el => el.classList.contains('is-msq'));
            const options = Array.from(optionElements).map(el => ({ text: extractText(el), element: el }));
            return { questionText, questionImageUrl, questionType: isMultipleChoice ? 'multiple_choice' : 'single_choice', options };
        }
        console.error("pertanyaan tidak dikenali. Silahkan Coba lagi !");
        return null;
    } catch (error) {
        console.error("Kesalahan saat mengekstrak data pertanyaan:", error);
        return null;
    }
}

    async function obterRespostaDaIA(quizData) {
    lastAiResponse = '';
    const viewResponseBtn = document.getElementById('view-raw-response-btn');
    if (viewResponseBtn) viewResponseBtn.style.display = 'none';
    for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
        const currentKey = GEMINI_API_KEYS[currentApiKeyIndex];
        if (!currentKey || currentKey.includes("CHAVE") || currentKey.length < 30) {
            console.warn(`Kunci API #${currentApiKeyIndex + 1} tampaknya merupakan placeholder. Melompati...`);
            currentApiKeyIndex = (currentApiKeyIndex + 1) % GEMINI_API_KEYS.length;
            continue;
        }
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${currentKey}`;
        let promptDeInstrucao = "", formattedOptions = "";
        switch (quizData.questionType) {
            case 'multi_dropdown':
                promptDeInstrucao = `Ini adalah pertanyaan dengan beberapa celah untuk diisi dengan opsi dropdown. Untuk setiap placeholder '[JAWABAN X]', tentukan jawaban yang benar dari opsi yang tersedia untuk dropdown tersebut. Jawab dengan setiap jawaban di baris baru, dalam format '[JAWABAN X]: Jawaban Benar'.`;
                let allOptionsText = '';
                quizData.dropdowns.forEach((dd, index) => {
                    allOptionsText += `Opsi untuk ${dd.placeholder}: ${dd.options.join(', ')}\n`;
                });
                formattedOptions = allOptionsText;
                break;
             case 'multi_drag_into_blank': promptDeInstrucao = `Ini adalah pertanyaan mencocokkan beberapa kalimat dengan ekspresi yang benar. Jawab dengan pasangan dalam format PERSIS: 'Kalimat pertanyaan -> Ekspresi opsi', dengan setiap pasangan di baris baru.`; const prompts = quizData.dropZones.map(item => `- "${item.prompt}"`).join('\n'); const options = quizData.draggableOptions.map(item => `- "${item.text}"`).join('\n'); formattedOptions = `Kalimat:\n${prompts}\n\nEkspresi (Opsi):\n${options}`; break;
            case 'equation': promptDeInstrucao = `Selesaikan persamaan atau pertidaksamaan berikut. Berikan hanya ekspresi akhir yang disederhanakan (misalnya: x = 5, atau y > 3).`; formattedOptions = `PERSAMAAN: "${quizData.questionText}"`; break;
            case 'dropdown': case 'single_choice': promptDeInstrucao = `Jawab HANYA dengan teks pasti dari SATU alternatif yang benar.`; formattedOptions = "OPSI:\n" + quizData.options.map(opt => `- "${opt.text}"`).join('\n'); break;
            case 'reorder': promptDeInstrucao = `Tugasnya adalah: "${quizData.questionText}". Berikan urutan yang benar dengan mencantumkan teks item, satu per baris, dari yang pertama hingga yang terakhir.`; formattedOptions = "Item untuk diurutkan:\n" + quizData.draggableItems.map(item => `- "${item.text}"`).join('\n'); break;
            case 'drag_into_blank': promptDeInstrucao = `Jawab HANYA dengan teks dari SATU opsi yang benar yang mengisi celah.`; formattedOptions = "Opsi untuk diseret:\n" + quizData.draggableOptions.map(item => `- "${item.text}"`).join('\n'); break;
            case 'match_order': promptDeInstrucao = `Jawab dengan pasangan dalam format PERSIS: 'Teks Lokasi Jatuhkan -> Teks Item untuk Diseret', dengan setiap pasangan di baris baru.`; const draggables = quizData.draggableItems.map(item => `- "${item.text}"`).join('\n'); const droppables = quizData.dropZones.map(item => `- "${item.text}"`).join('\n'); formattedOptions = `Item untuk Diseret:\n${draggables}\n\nLokasi Jatuhkan:\n${droppables}`; break;
            case 'open_ended': promptDeInstrucao = `Jawab HANYA dengan kata atau frasa pendek yang mengisi celah.`; break;
            case 'multiple_choice': promptDeInstrucao = `Jawab HANYA dengan teks pasti dari SEMUA alternatif yang benar, pisahkan masing-masing di BARIS BARU.`; formattedOptions = "OPSI:\n" + quizData.options.map(opt => `- "${opt.text}"`).join('\n'); break;
        }
        const textPrompt = `${promptDeInstrucao}\n\n---\nPERTANYAAN: "${quizData.questionText}"\n---\n${formattedOptions}`;
        let promptParts = [{ text: textPrompt }];
        if (quizData.questionImageUrl) {
            const base64Image = await imageUrlToBase64(quizData.questionImageUrl);
            if (base64Image) {
                const [header, data] = base64Image.split(',');
                let mimeType = header.match(/:(.*?);/)[1];
                const supportedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
                if (!supportedMimeTypes.includes(mimeType)) mimeType = 'image/jpeg';
                promptParts.push({ inline_data: { mime_type: mimeType, data: data } });
            }
        }
        try {
            const response = await fetchWithTimeout(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: promptParts }] })
            });
            if (response.ok) {
                const data = await response.json();
                const aiResponseText = data.candidates[0].content.parts[0].text;
                console.log(`Berhasil dengan Kunci API #${currentApiKeyIndex + 1}.`);
                console.log("Jawaban mentah AI:", aiResponseText);
                lastAiResponse = aiResponseText;
                return aiResponseText;
            }
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || `Error ${response.status}`;
            console.warn(`Kunci API #${currentApiKeyIndex + 1} gagal: ${errorMessage}. Mencoba yang berikutnya...`);
            lastAiResponse = `Gagal pada Kunci #${currentApiKeyIndex + 1}: ${errorMessage}`;
        } catch (error) {
            console.warn(`Kesalahan permintaan dengan Kunci API #${currentApiKeyIndex + 1}: ${error.message}. Mencoba yang berikutnya...`);
            lastAiResponse = `Gagal pada Kunci #${currentApiKeyIndex + 1}: ${error.message}`;
        }
        currentApiKeyIndex = (currentApiKeyIndex + 1) % GEMINI_API_KEYS.length;
    }
    alert("Semua kunci API gagal. Periksa kunci dan kuota Anda di Google AI Studio.");
    return null;
}

    async function performAction(aiAnswerText, quizData) {
    if (!aiAnswerText) return;

    // Fungsi pembantu untuk mendapatkan warna elemen, termasuk dari gradien
    const getElementColor = (element) => {
        const style = window.getComputedStyle(element);
        const bgImage = style.backgroundImage;
        if (bgImage && bgImage.includes('gradient')) {
            const match = bgImage.match(/rgb\(\d+, \d+, \d+\)/);
            if (match) return match[0];
        }
        return style.backgroundColor || 'rgba(0, 255, 0, 0.5)';
    };

    switch (quizData.questionType) {
        case 'multi_dropdown':
            const answers = aiAnswerText.split('\n').map(line => {
                const match = line.match(/\[JAWABAN (\d+)\]:\s*(.*)/i);
                if (!match) return null;
                return {
                    index: parseInt(match[1], 10) - 1,
                    answer: match[2].trim().replace(/["'`]/g, '')
                };
            }).filter(Boolean);

            for (const res of answers) {
                const dd = quizData.dropdowns[res.index];
                if (dd) {
                    dd.button.click();
                    try {
                        const optionElements = await waitForElement('.v-popper__popper--shown button.dropdown-option', true, 2000);
                        const targetOption = Array.from(optionElements).find(el => el.innerText.trim() === res.answer);
                        if (targetOption) {
                            targetOption.click();
                        } else {
                            console.error(`Opsi "${res.answer}" tidak ditemukan untuk dropdown #${res.index + 1}`);
                            document.body.click(); // Tutup menu jika tidak ditemukan
                        }
                        await new Promise(r => setTimeout(r, 300)); // Jeda antar aksi
                    } catch (e) {
                        console.error(`Kesalahan saat mencoba memilih untuk dropdown #${res.index + 1}: ${e.message}`);
                        document.body.click();
                        await new Promise(r => setTimeout(r, 200));
                    }
                }
            }
            break;

        case 'multi_drag_into_blank':
            const highlightColors = ['#FFD700', '#00FFFF', '#FF00FF', '#7FFF00', '#FF8C00', '#DA70D6'];
            let colorIndex = 0;
            const cleanPairPartMulti = (str) => str.replace(/[`"']/g, '').trim();
            const pairingsMulti = aiAnswerText.split('\n').filter(line => line.includes('->')).map(line => {
                const parts = line.split('->');
                return parts.length === 2 ? [cleanPairPartMulti(parts[0]), cleanPairPartMulti(parts[1])] : null;
            }).filter(Boolean);
            if (pairingsMulti.length === 0) { console.error("Tidak dapat mengekstrak pasangan yang valid dari jawaban AI."); return; }
            const draggableMap = new Map(quizData.draggableOptions.map(i => [i.text, i.element]));
            const dropZoneMap = new Map(quizData.dropZones.map(i => [i.prompt, i.blankElement]));
            for (const [promptText, optionText] of pairingsMulti) {
                const bestPromptMatch = [...dropZoneMap.keys()].find(key => key.includes(promptText) || promptText.includes(key));
                const blankEl = dropZoneMap.get(bestPromptMatch);
                const optionEl = draggableMap.get(optionText);
                if (blankEl && optionEl) {
                    const color = highlightColors[colorIndex % highlightColors.length];
                    const highlightStyle = `box-shadow: 0 0 15px 5px ${color}; border-radius: 4px;`;
                    blankEl.style.cssText = highlightStyle;
                    optionEl.style.cssText = highlightStyle;
                    colorIndex++;
                } else {
                    console.warn(`Pasangan tidak ditemukan di DOM: "${promptText}" -> "${optionText}"`);
                }
            }
            break;

        case 'equation':
            const KEYPAD_MAP = {
                '0': 'icon-fas-0', '1': 'icon-fas-1', '2': 'icon-fas-2', '3': 'icon-fas-3', '4': 'icon-fas-4',
                '5': 'icon-fas-5', '6': 'icon-fas-6', '7': 'icon-fas-7', '8': 'icon-fas-8', '9': 'icon-fas-9',
                '+': 'icon-fas-plus', '-': 'icon-fas-minus', '*': 'icon-fas-times', '×': 'icon-fas-times',
                '/': 'icon-fas-divide', '÷': 'icon-fas-divide', '=': 'icon-fas-equals', '.': 'icon-fas-period',
                '<': 'icon-fas-less-than', '>': 'icon-fas-greater-than',
                '≤': 'icon-fas-less-than-equal', '≥': 'icon-fas-greater-than-equal',
                'x': 'icon-fas-variable', 'y': 'icon-fas-variable', 'z': 'icon-fas-variable',
                '(': 'icon-fas-brackets-round', ')': 'icon-fas-brackets-round',
                'π': 'icon-fas-pi', 'e': 'icon-fas-euler',
            };
            let answerSequence = aiAnswerText.trim().replace(/\s/g, '').replace(/<=/g, '≤').replace(/>=/g, '≥');
            console.log(`Mengetikkan jawaban: ${answerSequence}`);
            const editor = document.querySelector('div[data-cy="equation-editor"]');
            if (editor) {
                editor.click();
                await new Promise(r => setTimeout(r, 100));
            } else {
                console.error("Tidak dapat menemukan editor persamaan untuk difokuskan.");
                return;
            }
            for (const char of answerSequence) {
                const iconClass = KEYPAD_MAP[char.toLowerCase()];
                if (iconClass) {
                    const keyElement = document.querySelector(`.editor-button i.${iconClass}`);
                    if (keyElement) {
                        const button = keyElement.closest('button');
                        if (button) {
                            button.click();
                            await new Promise(r => setTimeout(r, 100));
                        }
                    } else {
                        console.error(`Tidak dapat menemukan tombol untuk karakter: "${char}" (ikon: ${iconClass})`);
                    }
                } else {
                    console.error(`Karakter tidak terpetakan di papan kunci: "${char}"`);
                }
            }
            break;

        case 'reorder':
            const cleanText = (str) => str.replace(/["'`]/g, '').trim();
            const orderedItems = aiAnswerText.split('\n').map(cleanText).filter(Boolean);
            const draggablesMapReorder = new Map(quizData.draggableItems.map(i => [i.text, i.element]));
            const dropZonesInOrder = quizData.dropZones;
            if (orderedItems.length === dropZonesInOrder.length) {
                for (let i = 0; i < orderedItems.length; i++) {
                    const sourceText = orderedItems[i];
                    const sourceEl = draggablesMapReorder.get(sourceText);
                    const destinationEl = dropZonesInOrder[i].element;
                    if (sourceEl && destinationEl) {
                        const color = getElementColor(sourceEl);
                        const highlightStyle = `box-shadow: 0 0 15px 5px ${color}; border-radius: 8px;`;
                        sourceEl.style.cssText = highlightStyle;
                        destinationEl.style.cssText = highlightStyle;
                    }
                }
            }
            break;

        case 'drag_into_blank':
            const cleanAiAnswerBlank = aiAnswerText.trim().replace(/["'`]/g, '');
            const targetOption = quizData.draggableOptions.find(opt => opt.text === cleanAiAnswerBlank);
            if (targetOption) {
                const color = getElementColor(targetOption.element);
                const highlightStyle = `box-shadow: 0 0 15px 5px ${color}`;
                targetOption.element.style.cssText = highlightStyle;
                quizData.dropZone.element.style.cssText = highlightStyle;
            }
            break;

        case 'match_order':
            const cleanPairPart = (str) => str.replace(/[`"']/g, '').trim();
            const pairings = aiAnswerText.split('\n').filter(line => line.includes('->')).map(line => {
                const parts = line.split('->');
                return parts.length === 2 ? [cleanPairPart(parts[0]), cleanPairPart(parts[1])] : null;
            }).filter(Boolean);
            if (pairings.length === 0) { console.error("Tidak dapat mengekstrak pasangan yang valid dari jawaban AI."); return; }
            const draggablesMapMatch = new Map(quizData.draggableItems.map(i => [i.text, i.element]));
            const dropZonesMap = new Map(quizData.dropZones.map(i => [i.text, i.element]));
            for (const [partA, partB] of pairings) {
                let sourceEl, destinationEl;
                if (dropZonesMap.has(partA) && draggablesMapMatch.has(partB)) {
                    destinationEl = dropZonesMap.get(partA);
                    sourceEl = draggablesMapMatch.get(partB);
                } else if (dropZonesMap.has(partB) && draggablesMapMatch.has(partA)) {
                    destinationEl = dropZonesMap.get(partB);
                    sourceEl = draggablesMapMatch.get(partA);
                } else { continue; }
                if (sourceEl && destinationEl) {
                    const color = getElementColor(sourceEl);
                    const highlightStyle = `box-shadow: 0 0 15px 5px ${color}; border-radius: 8px;`;
                    sourceEl.style.cssText = highlightStyle;
                    destinationEl.style.cssText = highlightStyle;
                }
            }
            break;

        default:
            const normalize = (str) => {
                if (typeof str !== 'string') return '';
                let cleaned = str.replace(/[^a-zA-Z\u00C0-\u017F\s]/g, '').replace(/\s+/g, ' ');
                return cleaned.trim().toLowerCase();
            };
            if (quizData.questionType === 'open_ended') {
                await new Promise(resolve => {
                    quizData.answerElement.focus();
                    quizData.answerElement.value = aiAnswerText.trim();
                    quizData.answerElement.dispatchEvent(new Event('input', { bubbles: true }));
                    setTimeout(resolve, 100);
                });
                setTimeout(() => document.querySelector('.submit-button-wrapper button, button.submit-btn')?.click(), 500);
            } else if (quizData.questionType === 'multiple_choice') {
                const aiAnswers = aiAnswerText.split('\n').map(normalize).filter(Boolean);
                quizData.options.forEach(opt => {
                    if (aiAnswers.includes(normalize(opt.text))) {
                        opt.element.style.border = '5px solid #00FF00';
                        opt.element.click();
                    }
                });
            } else if (quizData.questionType === 'single_choice') {
                const normalizedAiAnswer = normalize(aiAnswerText);
                const bestMatch = quizData.options.find(opt => normalize(opt.text) === normalizedAiAnswer);
                if (bestMatch) {
                    bestMatch.element.style.border = '5px solid #00FF00';
                    bestMatch.element.click();
                }
            }
            break;
    }
}

    async function resolverQuestao() {
    const button = document.getElementById('ai-solver-button');
    button.disabled = true;
    button.innerText = "Berpikir...";
    button.style.transform = 'scale(0.95)';
    button.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
    try {
        const quizData = await extrairDadosDaQuestao();
        if (!quizData) {
            alert("Tidak dapat mengekstrak data pertanyaan.");
            return;
        }

        if (quizData.questionType === 'multi_dropdown') {
             console.log("Menggunakan AI untuk menyelesaikan beberapa dropdown...");
             const aiAnswer = await obterRespostaDaIA(quizData);
             if (aiAnswer) {
                 await performAction(aiAnswer, quizData);
             }
        } else if (quizData.questionType === 'dropdown') {
            console.log("Memulai alur yang dioptimalkan untuk Dropdown...");
            quizData.dropdownButton.click();
            try {
                const optionElements = await waitForElement('.v-popper__popper--shown button.dropdown-option', true);
                quizData.options = Array.from(optionElements).map(el => ({ text: el.innerText.trim() }));
                const aiAnswer = await obterRespostaDaIA(quizData);
                if (aiAnswer) {
                    const cleanAiAnswerDrop = aiAnswer.trim().replace(/["'`]/g, '');
                    const targetOptionDrop = Array.from(optionElements).find(el => el.innerText.trim() === cleanAiAnswerDrop);
                    if (targetOptionDrop) {
                        targetOptionDrop.click();
                    } else {
                        console.error(`Tidak dapat menemukan opsi dropdown dengan teks: "${cleanAiAnswerDrop}"`);
                        document.body.click();
                    }
                } else {
                     document.body.click();
                }
            } catch (error) {
                console.error("Gagal memproses dropdown:", error.message);
                document.body.click();
            }
        } else {
            const isMath = quizData.options && quizData.options.length > 0 && (quizData.options[0].text.includes('\\') || quizData.questionText.toLowerCase().includes('nilai dari'));
            const matchValue = quizData.questionText.match(/nilai dari ([\d.]+)/i);
            if (isMath && matchValue) {
                console.log("Pertanyaan matematika terdeteksi. Menyelesaikan secara lokal...");
                const targetValue = parseFloat(matchValue[1]);
                quizData.options.forEach(option => {
                    const computableExpr = (() => {
                        let c = option.text.replace(/\\left/g, '').replace(/\\right/g, '').replace(/\\div/g, '/').replace(/\\times/g, '*').replace(/\\ /g, '').replace(/(\d+)\s*\(/g, '$1 * (').replace(/\)\s*(\d+)/g, ') * $1');
                        // PERBAIKAN (v33): Memperbaiki kesalahan pengetikan pada ekspresi reguler di bawah
                        c = c.replace(/(\d+)\\frac\{(\d+)\}\{(\d+)\}/g, '($1+$2/$3)');
                        c = c.replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '($1/$2)');
                        return c;
                    })();
                    const result = (() => { try { return new Function('return ' + computableExpr)(); } catch (e) { return null; } })();
                    if (result !== null && Math.abs(result - targetValue) < 0.001) {
                        option.element.style.border = '5px solid #00FF00';
                        option.element.click();
                    }
                });
            } else {
                console.log("Menggunakan AI untuk menyelesaikan...");
                const aiAnswer = await obterRespostaDaIA(quizData);
                if (aiAnswer) {
                    await performAction(aiAnswer, quizData);
                }
            }
        }
    } catch (error) {
        console.error("Kesalahan tak terduga terjadi di alur utama:", error);
        alert("Terjadi kesalahan umum. Periksa konsol untuk detail.");
    } finally {
        const viewResponseBtn = document.getElementById('view-raw-response-btn');
        if (viewResponseBtn && lastAiResponse) {
            viewResponseBtn.style.display = 'block';
        }
        button.disabled = false;
        button.innerText = "Gasken";
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
    }
}


    function criarFloatingPanel() {
        if (document.getElementById('mdw-floating-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'mdw-floating-panel';
        Object.assign(panel.style, {
            position: 'fixed', bottom: '60px', right: '20px', zIndex: '2147483647',
            display: 'flex', flexDirection: 'column', alignItems: 'stretch',
            gap: '10px', padding: '12px', 
            // Latar belakang 80% transparan (Opasitas 0.2)
            backgroundColor: 'rgba(26, 27, 30, 0.2)', 
            backdropFilter: 'blur(8px)', webkitBackdropFilter: 'blur(8px)', borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
            transform: 'translateY(20px)', opacity: '0'
        });

        const responseViewer = document.createElement('div');
        responseViewer.id = 'ai-response-viewer';
        Object.assign(responseViewer.style, {
            display: 'none', position: 'absolute', bottom: 'calc(100% + 10px)', right: '0',
            width: '300px', maxHeight: '200px', overflowY: 'auto',
            // Pop-up jawaban AI 80% transparan (Opasitas 0.2)
            background: 'rgba(10, 10, 15, 0.2)', 
            backdropFilter: 'blur(5px)',
            borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '12px', color: '#f0f0f0', fontSize: '12px',
            fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
            textAlign: 'left'
        });
        panel.appendChild(responseViewer);

        const viewResponseBtn = document.createElement('button');
        viewResponseBtn.id = 'view-raw-response-btn';
        viewResponseBtn.innerText = 'Lihat Jawaban AI';
        Object.assign(viewResponseBtn.style, {
            background: 'none', 
            border: '1px solid rgba(255, 255, 255, 0.2)',
            // BARU: Teks tombol "Lihat Jawaban AI" 80% transparan
            color: 'rgba(255, 255, 255, 0.2)', 
            cursor: 'pointer',
            fontSize: '11px', padding: '4px 8px', borderRadius: '6px',
            display: 'none', transition: 'all 0.2s ease',
            marginBottom: '4px'
        });
        viewResponseBtn.addEventListener('click', () => {
            if (responseViewer.style.display === 'block') {
                responseViewer.style.display = 'none';
            } else {
                responseViewer.innerText = lastAiResponse || "Belum ada jawaban AI yang diterima.";
                responseViewer.style.display = 'block';
            }
        });
        panel.appendChild(viewResponseBtn);

        const button = document.createElement('button');
        button.id = 'ai-solver-button';
        button.innerHTML = 'Gasken';
        Object.assign(button.style, {
            // Latar belakang tombol Gasken 80% transparan
            background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
            border: 'none', borderRadius: '10px', 
            // BARU: Teks tombol Gasken 80% transparan
            color: 'rgba(255, 255, 255, 0.2)', 
            cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif', fontSize: '15px', fontWeight: '600',
            padding: '10px 20px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease', letterSpacing: '0.5px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
        });
        // Mengubah efek hover agar sesuai dengan transparansi tinggi
        button.addEventListener('mouseover', () => { button.style.transform = 'translateY(-2px)'; button.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.1)'; });
        button.addEventListener('mouseout', () => { button.style.transform = 'translateY(0)'; button.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.05)'; });
        button.addEventListener('mousedown', () => { button.style.transform = 'translateY(1px)'; button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.05)'; });
        button.addEventListener('mouseup', () => { button.style.transform = 'translateY(-2px)'; button.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.1)'; });
        button.addEventListener('click', resolverQuestao);
        panel.appendChild(button);
        
        const btnStop = document.createElement('button');
    btnStop.id = 'stop-aktif-btn';
    btnStop.innerText = 'Stop';
    Object.assign(btnStop.style, {
      padding: '6px 12px', 
      // Latar belakang tombol Stop 80% transparan
      background: 'rgba(220, 53, 69, 0.2)', 
      // BARU: Teks tombol Stop 80% transparan
      color: 'rgba(255, 255, 255, 0.2)', 
      border: 'none',
      borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%'
    });

    btnStop.addEventListener('click', () => {
      panel.remove(); // Hapus panel dari DOM
    });

    panel.appendChild(btnStop);
        

        const watermark = document.createElement('div');
        watermark.innerHTML = `
            <div style="display: flex; gap: 8px; align-items: center; 
            /* BARU: Teks Watermark 80% transparan */
            color: rgba(255,255,255,0.2); 
            margin-top: 8px; justify-content: flex-end;">
                <span style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 13px; font-weight: 400;">Created • Cowo.Polos</span>
            </div>
        `;
        watermark.querySelectorAll('a').forEach(link => {
            link.addEventListener('mouseover', () => link.style.color = 'white');
            // BARU: Teks link watermark (mouseout) 80% transparan
            link.addEventListener('mouseout', () => link.style.color = 'rgba(255,255,255,0.2)');
        });
        panel.appendChild(watermark);
        document.body.appendChild(panel);

        setTimeout(() => {
            panel.style.transform = 'translateY(0)';
            panel.style.opacity = '1';
        }, 100);
        console.log("Bypass Succes !");
    }

    async function fetchWithTimeout(resource, options = {}, timeout = 15000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(resource, { ...options, signal: controller.signal });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            if (error.name === 'AbortError') throw new Error('Permintaan terlalu lama dan dibatalkan (Timeout).');
            throw error;
        }
    }

    async function imageUrlToBase64(url) {
        try {
            const r = await fetchWithTimeout(url);
            const b = await r.blob();
            return new Promise(res => {
                const reader = new FileReader();
                reader.onloadend = () => res(reader.result);
                reader.readAsDataURL(b);
            });
        } catch (e) {
            console.error("Kesalahan saat mengkonversi gambar:", e);
            return null;
        }
    }

    setTimeout(criarFloatingPanel, 2000);
})();

}

// Catatan: startBypass() akan dipanggil setelah kata sandi benar.
