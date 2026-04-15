let currentModule = '';

function showForm(module) {
    currentModule = module;
    const formContainer = document.getElementById('form-container');
    const formTitle = document.getElementById('form-title');
    const formContent = document.getElementById('form-content');

    formContainer.classList.remove('hidden');
    formTitle.innerHTML = `<span class="prompt">></span> Carga do Módulo [${module}] efetuada. Aguardando parâmetros...`;

    if (module === 'Nome') {
        formContent.innerHTML = `
            <label>> NOME COMPLETO:</label>
            <input type="text" id="input-nome" placeholder="ex: John Doe" autocomplete="off">
            <label>> IDADE (opcional):</label>
            <input type="text" id="input-idade" placeholder="ex: 35" autocomplete="off">
            <label>> LOCAL / TRABALHO (opcional):</label>
            <input type="text" id="input-local" placeholder="ex: Acme Corp, New York" autocomplete="off">
        `;
    } else {
        formContent.innerHTML = `
            <label>> TARGET USERNAME (${module.toUpperCase()}):</label>
            <input type="text" id="input-username" placeholder="ex: target_user123" autocomplete="off">
        `;
    }
}

async function startSearch() {
    const log = document.getElementById('log');
    log.innerHTML = ''; // Limpar log anterior

    let targetInfo = '';
    let extraInfo = '';
    if (currentModule === 'Nome') {
        const nome = document.getElementById('input-nome').value || 'Desconhecido';
        const idade = document.getElementById('input-idade').value || 'N/A';
        const local = document.getElementById('input-local').value || 'N/A';
        targetInfo = nome;
        extraInfo = `(Idade: ${idade}, Local: ${local})`;
    } else {
        const username = document.getElementById('input-username').value || 'Desconhecido';
        targetInfo = username;
    }

    const d = new Date();
    const timestamp = d.toISOString();

    const steps = [
        `[${timestamp}] Inicializando sequências de varredura...`,
        `[+] Carregando módulo base: ${currentModule}`,
        `[+] Estabelecendo túnel criptografado via proxies dinâmicos...`,
        `[+] Túnel estabelecido com sucesso. IP mascarado.`,
        `[*] Alvo selecionado: [${targetInfo}] ${extraInfo}`,
        `[*] Consultando bibliotecas públicas e APIs abertas...`,
        `[!] AVISO: Esta é uma simulação front-end. Dados complexos exigem backend de OSINT dedicado.`,
        `[-] Cruzando registros em bases de dados abertas...`,
        `[-] Simulando extração de DOM elements... OK`,
        `[+] Footprints digitais encontrados. Analisando...`,
        `[*] Decodificando metadados e compondo relatório parcial...`,
        `======================================================`,
        `[+] RELATÓRIO DO ALVO (SIMULAÇÃO):`,
        `    - Identificação: ${targetInfo}`,
        `    - Possível Email Associado: ${targetInfo.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'alvo'}@email-simulado.com`,
        `    - Status Operacional: Ativo (3 redes cruzadas)`,
        `    - Extração de Bio: "Usuário padrão do sistema. Log de OSINT gerado por IA."`,
        `======================================================`,
        `[+] Varredura concluída. Limpando rastro digital...`,
        `[+] Desconectado.`
    ];

    for (let i = 0; i < steps.length; i++) {
        await typeLine(steps[i], (Math.random() * 20) + 10); // Velocidade variável
        await sleep((Math.random() * 500) + 200); // Pausa variável entre linhas
    }
}

function typeLine(text, speed) {
    return new Promise(resolve => {
        const log = document.getElementById('log');
        const div = document.createElement('div');
        div.className = 'log-entry typing-line';
        log.appendChild(div);

        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                div.innerHTML += text.charAt(i);
                i++;
                log.scrollTop = log.scrollHeight; // Auto-scroll
                setTimeout(typeWriter, speed);
            } else {
                div.classList.remove('typing-line');
                resolve();
            }
        }
        typeWriter();
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
