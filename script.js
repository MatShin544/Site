function showForm(module) {
    const formContainer = document.getElementById('form-container');
    const formTitle = document.getElementById('form-title');
    const formContent = document.getElementById('form-content');

    formContainer.classList.remove('hidden');
    formTitle.innerHTML = `> Módulo: <span style="color: #fff">Geração de Dorks (Investigação Nominal)</span>`;

    formContent.innerHTML = `
        <div class="input-group">
            <label>NOME COMPLETO DO ALVO:</label>
            <input type="text" id="input-nome" placeholder="ex: João da Silva" autocomplete="off">
        </div>
        <div class="input-group">
            <label>CIDADE / ESTADO (OPCIONAL):</label>
            <input type="text" id="input-local" placeholder="ex: São Paulo" autocomplete="off">
        </div>
    `;
    
    // Esconde a workspace na iniciação e limpa inputs
    document.getElementById('workspace').classList.add('hidden');
    
    setTimeout(() => {
        const firstInput = formContent.querySelector('input');
        if(firstInput) firstInput.focus();
    }, 100);
}

async function startSearch() {
    const log = document.getElementById('log');
    const workspace = document.getElementById('workspace');
    
    // Mostra o log e o dossie (workspace grid)
    workspace.classList.remove('hidden');
    
    // Animação inicial
    log.style.opacity = '0.5';
    setTimeout(() => log.style.opacity = '1', 200);

    log.innerHTML = ''; // Limpar log 

    const nome = document.getElementById('input-nome').value.trim();
    if (!nome) {
        alert("Favor inserir o nome do alvo.");
        return;
    }
    const local = document.getElementById('input-local').value.trim();
    
    // Atualiza nome no dossiê
    const inputsDossie = document.querySelectorAll('.dossier-input');
    if (inputsDossie.length > 0) {
        inputsDossie[0].value = nome;
        if(local) inputsDossie[2].value = local;
    }
    
    const exactName = `"${nome}"`;
    const localString = local ? ` "${local}"` : '';
    
    const dorks = [
        { name: "Busca Geral Exata", url: `https://www.google.com/search?q=${encodeURIComponent(exactName + localString)}` },
        { name: "LinkedIn (Perfis / Referências)", url: `https://www.google.com/search?q=${encodeURIComponent(exactName + localString + " site:linkedin.com")}` },
        { name: "Pastebin (Textos / Vazamentos)", url: `https://www.google.com/search?q=${encodeURIComponent(exactName + " site:pastebin.com")}` },
        { name: "Arquivos PDF (Currículos, editais)", url: `https://www.google.com/search?q=${encodeURIComponent(exactName + " filetype:pdf")}` },
        { name: "Processos (JusBrasil)", url: `https://www.google.com/search?q=${encodeURIComponent(exactName + localString + " site:jusbrasil.com.br")}` }
    ];

    const d = new Date();
    const timeString = d.toTimeString().split(' ')[0];

    const steps = [
        `[${timeString}] <span class="log-info">SYS</span> Iniciando motor de Dorking para: <span class="log-highlight">${nome}</span>`,
        `[${timeString}] <span class="log-info">SYS</span> Preparando ambiente do Dossiê...`,
        `[${timeString}] <span class="log-info">NET</span> Gerando sintaxes de interceptação (Google Dorks)...`,
        `[${timeString}] <span class="log-highlight">OK</span> Sintaxes prontas!`,
        `<br>`,
        `<b>[!] LINKS PRONTOS PARA EXECUÇÃO:</b>`,
    ];

    dorks.forEach(dork => {
        steps.push(`  ➤ <a href="${dork.url}" target="_blank" class="dork-link">[ABRIR]</a> ${dork.name}`);
    });

    steps.push(`<br>`);
    steps.push(`[${timeString}] <span class="log-info">DICA:</span> Clique em [ABRIR] para acessar os dados no Google, e anote as descobertas ao lado no seu Dossiê!`);

    for (let i = 0; i < steps.length; i++) {
        const speed = steps[i].includes('<a href') ? 5 : 15; 
        await typeLine(steps[i], speed);
        let delay = (Math.random() * 250) + 100;
        await sleep(delay);
    }
}

function typeLine(htmlText, speed) {
    return new Promise(resolve => {
        const log = document.getElementById('log');
        const div = document.createElement('div');
        div.className = 'log-entry typing-line';
        log.appendChild(div);
        
        if (htmlText.includes('<')) {
            div.innerHTML = htmlText;
            div.classList.remove('typing-line');
            log.scrollTop = log.scrollHeight;
            resolve();
        } else {
            let i = 0;
            function typeWriter() {
                if (i < htmlText.length) {
                    div.innerHTML += htmlText.charAt(i);
                    i++;
                    log.scrollTop = log.scrollHeight;
                    setTimeout(typeWriter, speed);
                } else {
                    div.classList.remove('typing-line');
                    resolve();
                }
            }
            typeWriter();
        }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
