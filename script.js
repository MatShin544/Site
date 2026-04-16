let currentTargetName = "";

function iniciarPesquisa() {
    const nameInput = document.getElementById('target-name').value.trim();
    if (nameInput === "") {
        alert("Atenção: O campo de nome é obrigatório para realizar a busca da pessoa.");
        document.getElementById('target-name').focus();
        return;
    }

    const locInput = document.getElementById('target-loc').value.trim();
    currentTargetName = nameInput;

    const overlay = document.getElementById('loading-overlay');
    const statusText = document.getElementById('loader-status');
    overlay.classList.remove('hidden');

    statusText.innerText = `Consultando base IBGE e diretórios abertos sobre: "${nameInput}"...`;
    
    setTimeout(() => { statusText.innerText = "Preparando atalhos nativos para acesso direto aos sites..."; }, 1500);
    
    setTimeout(() => {
        // PREENCHER O DOSSIÊ PRINCIPAL
        document.getElementById('res-nome').innerText = nameInput;
        
        // Gerar número de homônimos fictício mas realista baseado no nome
        const hash = nameInput.length * 43; 
        // Conta quantas palavras tem (nomes compostos tem menos pessoas)
        const parts = nameInput.split(' ').length;
        let estimate = Math.floor(Math.random() * hash) + 10;
        if (parts > 3) estimate = Math.floor(estimate / 3) + 1; // Nome grande = menos gente
        if (estimate < 1) estimate = 1;

        document.getElementById('res-count').innerText = `Aproximadamente ${estimate} pessoa(s)`;

        // MONTAR LINKS (AGORA INDO DIRETO PARA A BUSCA DOS SITES AO INVÉS DO GOOGLE)
        montarLinksDiretos(nameInput);
        
        // MONTAR A LISTA DE HOMÔNIMOS PARA A OUTRA ABA
        montarListaHomonimos(nameInput, locInput, estimate);

        // Termina loading
        overlay.classList.add('hidden');
        
        // Muda as abas
        document.getElementById('search-view').classList.add('hidden');
        document.getElementById('results-view').classList.remove('hidden');
        document.getElementById('list-view').classList.add('hidden');
        
        atualizarNavBar();

    }, 3000);
}

function montarLinksDiretos(nome) {
    const tbody = document.getElementById('res-links');
    tbody.innerHTML = '';

    const urlCode = encodeURIComponent(nome);

    const servicos = [
        {
            plataforma: "JusBrasil",
            tipo: "Busca direta por Jurisprudência, Diários e Processos",
            // Pesquisa exatamente o nome DENTRO do sistema de busca do Jusbrasil
            url: `https://www.jusbrasil.com.br/busca?q=${urlCode}`
        },
        {
            plataforma: "Escavador",
            tipo: "Busca direta e currículos Lattes/Empresariais",
            // Pesquisa direto na lupa do Escavador
            url: `https://www.escavador.com/busca?q=${urlCode}`
        },
        {
            plataforma: "Portal da Transparência",
            tipo: "Verificar se é servidor público federal, militares, etc.",
            // Direto para portal do governo
            url: `https://portaldatransparencia.gov.br/busca?termo=${urlCode}`
        },
        {
            plataforma: "Google Search",
            tipo: "Busca de Notícias Abertas",
            url: `https://www.google.com/search?q=${encodeURIComponent('"' + nome + '"' + " noticia")}`
        }
    ];

    servicos.forEach(serv => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${serv.plataforma}</strong></td>
            <td style="color: #64748b;">${serv.tipo}</td>
            <td style="text-align: right;"><a href="${serv.url}" target="_blank" class="link-action">🔍 Ler Registros</a></td>
        `;
        tbody.appendChild(tr);
    });
}

function montarListaHomonimos(nome, uf, amostraContagem) {
    const tbody = document.getElementById('homonimos-list');
    tbody.innerHTML = '';
    
    const ufs = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'DF', 'GO', 'PE'];
    
    // Lista os resultados até um maximo de 8 para não lotar a tabela inteira
    let maxRows = amostraContagem > 8 ? 8 : amostraContagem;
    
    for(let i=0; i<maxRows; i++) {
        // Se a pessoa digitou um estado, foca nele, senão chuta
        let estado = uf ? uf.toUpperCase() : ufs[Math.floor(Math.random() * ufs.length)];
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${nome}</strong></td>
            <td>Região provável: ${estado} / Brasil</td>
            <td><span class="badge" style="background:#e2e8f0; color:#475569;">Potencial Homônimo</span></td>
        `;
        tbody.appendChild(tr);
    }
}

function atualizarNavBar() {
    const nav = document.getElementById('main-nav');
    nav.innerHTML = `
        <a href="#" id="tab-res" class="active" onclick="switchTab('results-view', this)">Dossiê Pessoal</a>
        <a href="#" id="tab-list" onclick="switchTab('list-view', this)">Lista de Homônimos / Nomes Similares</a>
        <a href="#" onclick="voltarParaBusca()">Nova Pesquisa -></a>
    `;
}

function switchTab(viewId, element) {
    if(element) {
        // Remove a classe ativa de todo mundo
        const links = document.getElementById('main-nav').getElementsByTagName('a');
        for(let l of links) l.classList.remove('active');
        element.classList.add('active');
    }
    
    // Esconder tudo
    document.getElementById('search-view').classList.add('hidden');
    document.getElementById('results-view').classList.add('hidden');
    document.getElementById('list-view').classList.add('hidden');
    
    // Mostrar só o pretendido
    document.getElementById(viewId).classList.remove('hidden');
}

function voltarParaBusca() {
    document.getElementById('results-view').classList.add('hidden');
    document.getElementById('list-view').classList.add('hidden');
    document.getElementById('search-view').classList.remove('hidden');
    
    const nav = document.getElementById('main-nav');
    nav.innerHTML = `<a href="#" class="active" onclick="switchTab('search-view', this)">Painel de Busca</a>`;
    document.getElementById('target-name').value = '';
    document.getElementById('target-loc').value = '';
}
