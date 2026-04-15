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
    
    // Auto focus the first input
    setTimeout(() => {
        const firstInput = formContent.querySelector('input');
        if(firstInput) firstInput.focus();
    }, 100);
}

async function startSearch() {
    const log = document.getElementById('log');
    
    // Animação inicial
    log.style.opacity = '0.5';
    setTimeout(() => log.style.opacity = '1', 200);

    log.innerHTML = ''; // Limpar log anterior

    const nome = document.getElementById('input-nome').value.trim();
    if (!nome) {
        alert("Favor inserir o nome do alvo.");
        return;
    }
    const local = document.getElementById('input-local').value.trim();
    
    // Construção das Dorks
    const exactName = `"${nome}"`;
    const localString = local ? ` "${local}"` : '';
    
    // Array com as URLs formatadas
    const dorks = [
        {
            name: "Busca Geral Exata",
            url: `https://www.google.com/search?q=${encodeURIComponent(exactName + localString)}`
        },
        {
            name: "Busca no LinkedIn (Perfis ou menções)",
            url: `https://www.google.com/search?q=${encodeURIComponent(exactName + localString + " site:linkedin.com")}`
        },
        {
            name: "Vazamentos / Textos no Pastebin",
            url: `https://www.google.com/search?q=${encodeURIComponent(exactName + " site:pastebin.com")}`
        },
        {
            name: "Buscador de PDFs Públicos (Currículos, diários)",
            url: `https://www.google.com/search?q=${encodeURIComponent(exactName + " filetype:pdf")}`
        },
        {
            name: "Busca no JusBrasil (Processos Jurídicos)",
            url: `https://www.google.com/search?q=${encodeURIComponent(exactName + localString + " site:jusbrasil.com.br")}`
        }
    ];

    const d = new Date();
    const timeString = d.toTimeString().split(' ')[0];

    // Passos de processamento na interface
    const steps = [
        `[${timeString}] <span class="log-info">SYS</span> Iniciando motor de Dorking para: <span class="log-highlight">${nome}</span>`,
        `[${timeString}] <span class="log-info">SYS</span> Estruturando sintaxe de busca avançada...`,
        `[${timeString}] <span class="log-info">NET</span> Contornando limitações de CORS (Delegando conexões para Client-Side)...`,
        `[${timeString}] <span class="log-highlight">OK</span> Sintaxes geradas.`,
        `<br>`,
        `<b>[!] LINKS PRONTOS PARA EXECUÇÃO:</b>`,
    ];

    // Adiciona os links dork criados no log
    dorks.forEach(dork => {
        steps.push(`  ➤ <a href="${dork.url}" target="_blank" class="dork-link">[ABRIR]</a> ${dork.name}`);
    });

    steps.push(`<br>`);
    steps.push(`[${timeString}] <span class="log-info">SYS</span> Clique nos links acima. Cada link executa uma requisição direta no banco de dados do Google. O resultado da busca já estará filtrado.`);

    // Loop que exibe os passos com atrasos realistas
    for (let i = 0; i < steps.length; i++) {
        const speed = steps[i].includes('<a href') ? 5 : 20; // links aparecem mais rápido
        await typeLine(steps[i], speed);
        
        let delay = (Math.random() * 300) + 150;
        await sleep(delay);
    }
}

function typeLine(htmlText, speed) {
    return new Promise(resolve => {
        const log = document.getElementById('log');
        const div = document.createElement('div');
        div.className = 'log-entry typing-line';
        log.appendChild(div);
        
        // Renderiza conteúdo que tem HTML imediatamente
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
                    log.scrollTop = log.scrollHeight; // Auto-scroll
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
