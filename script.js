let currentTargetName = "";

function iniciarPesquisa() {
    const nameInput = document.getElementById('target-name').value.trim();
    if (nameInput === "") {
        alert("Atenção: O campo de nome é obrigatório para realizar a busca da pessoa.");
        document.getElementById('target-name').focus();
        return;
    }

    const locInput = document.getElementById('target-loc').value.trim();
    const ageInput = document.getElementById('target-age').value.trim();
    
    currentTargetName = nameInput;

    const overlay = document.getElementById('loading-overlay');
    const statusText = document.getElementById('loader-status');
    overlay.classList.remove('hidden');

    statusText.innerText = `Processando Idade e Nome na base IBGE: "${nameInput}"...`;
    
    setTimeout(() => { statusText.innerText = "Calculando reduções de Homônimos através da Idade restrita..."; }, 1500);
    
    setTimeout(() => {
        // PREENCHER O DOSSIÊ PRINCIPAL
        document.getElementById('res-nome').innerText = nameInput;
        document.getElementById('res-idade').innerText = ageInput ? ageInput + " informados" : "Desconhecida";
        document.getElementById('res-estado').innerText = locInput || "Busca de Dados Nacional";
        
        // Gerar número de homônimos fictício mas realista baseado no nome
        const hash = nameInput.length * 43; 
        const parts = nameInput.split(' ').length;
        let estimate = Math.floor(Math.random() * hash) + 10;
        if (parts > 3) estimate = Math.floor(estimate / 3) + 1; // Nome grande = menos gente
        
        // Magia da Idade e Localidade (reduz homônimos drásticamente)
        if (locInput !== "") estimate = Math.floor(estimate / 3) + 1;
        if (ageInput !== "") estimate = Math.floor(estimate / 5) + 1;
        
        if (estimate < 1) estimate = 1;

        // Se colocou idade, é mais raro e fácil achar a pessoa
        document.getElementById('res-count').innerText = 
            estimate === 1 ? "1 ÚNICA CORRESPONDÊNCIA! (Rastreio Direto Potencial)" : `Cerca de ${estimate} pessoa(s)`;
            
        if (estimate === 1) document.getElementById('res-count').style.color = "#16a34a"; // Fica verde se achar só 1

        // MONTAR LINKS
        montarLinksDiretos(nameInput, locInput);
        
        // MONTAR A LISTA DE HOMÔNIMOS PARA A OUTRA ABA
        montarListaHomonimos(nameInput, locInput, ageInput, estimate);

        // Termina loading
        overlay.classList.add('hidden');
        
        // Muda as abas
        document.getElementById('search-view').classList.add('hidden');
        document.getElementById('results-view').classList.remove('hidden');
        document.getElementById('list-view').classList.add('hidden');
        
        atualizarNavBar();

    }, 3000);
}

function montarLinksDiretos(nome, loc) {
    const tbody = document.getElementById('res-links');
    tbody.innerHTML = '';

    const urlCode = encodeURIComponent(nome + (loc ? " " + loc : ""));

    const servicos = [
        {
            plataforma: "JusBrasil",
            tipo: "Busca direta por Jurisprudência, Diários e Processos",
            url: `https://www.jusbrasil.com.br/busca?q=${urlCode}`
        },
        {
            plataforma: "Escavador",
            tipo: "Busca direta e currículos Lattes/Empresariais",
            url: `https://www.escavador.com/busca?q=${urlCode}`
        },
        {
            plataforma: "Portal da Transparência",
            tipo: "Verificar se é servidor público federal, militares, etc.",
            url: `https://portaldatransparencia.gov.br/busca?termo=${urlCode}`
        },
        {
            plataforma: "Google Search Limits",
            tipo: "Busca de Notícias Abertas e Cadastros",
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

function montarListaHomonimos(nome, uf, age, amostraContagem) {
    const tbody = document.getElementById('homonimos-list');
    tbody.innerHTML = '';
    
    const ufs = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'DF', 'GO', 'PE'];
    
    // Lista os resultados até um maximo de 8
    let maxRows = amostraContagem > 8 ? 8 : amostraContagem;
    
    for(let i=0; i<maxRows; i++) {
        let estado = uf ? uf.toUpperCase() : ufs[Math.floor(Math.random() * ufs.length)];
        
        // Se a pessoa digitou idade, cria homônimos todos na mesma faixa de idade.
        // Se não digitou, gera um random de 18 a 60
        let fakeAgeInt = age ? parseInt(age) : (Math.floor(Math.random() * 42) + 18);
        
        // Da uma variada pequena pra não ficar tudo igual se não for o alvo exato
        if (i !== 0 && age) fakeAgeInt = fakeAgeInt + (Math.floor(Math.random() * 5) - 2); 
        
        let labelAge = `${fakeAgeInt} anos estimados`;
        let riskColor = i === 0 && age ? "#ef4444" : "#475569";
        let riskText = i === 0 && age ? "100% de Compatibilidade" : "Potencial Homônimo";
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${nome}</strong></td>
            <td style="color: #475569;">${labelAge}</td>
            <td>Região: ${estado} / Brasil</td>
            <td><span class="badge" style="background:#e2e8f0; color:${riskColor}; font-weight:bold;">${riskText}</span></td>
        `;
        tbody.appendChild(tr);
    }
}

function atualizarNavBar() {
    const nav = document.getElementById('main-nav');
    nav.innerHTML = `
        <a href="#" id="tab-res" class="active" onclick="switchTab('results-view', this)">Dossiê Pessoal</a>
        <a href="#" id="tab-list" onclick="switchTab('list-view', this)">Lista de Homônimos / Similares</a>
        <a href="#" onclick="voltarParaBusca()">Nova Pesquisa -></a>
    `;
}

function switchTab(viewId, element) {
    if(element) {
        // Remove a classe ativa
        const links = document.getElementById('main-nav').getElementsByTagName('a');
        for(let l of links) l.classList.remove('active');
        element.classList.add('active');
    }
    
    // Esconder tudo
    document.getElementById('search-view').classList.add('hidden');
    document.getElementById('results-view').classList.add('hidden');
    document.getElementById('list-view').classList.add('hidden');
    
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
    document.getElementById('target-age').value = '';
}
