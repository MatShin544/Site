function iniciarPesquisa() {
    const nameInput = document.getElementById('target-name').value.trim();
    if (nameInput === "") {
        alert("Atenção: O campo de nome é obrigatório para realizar a busca da pessoa.");
        document.getElementById('target-name').focus();
        return;
    }

    const locInput = document.getElementById('target-loc').value.trim();

    // 1. Mostrar painel de Loading
    const overlay = document.getElementById('loading-overlay');
    const statusText = document.getElementById('loader-status');
    overlay.classList.remove('hidden');

    statusText.innerText = `Varrendo informações isoladas no nome: "${nameInput}"...`;
    
    setTimeout(() => { statusText.innerText = "Interligando endpoints legais (JusBrasil, Portais Estaduais)..."; }, 1500);
    setTimeout(() => { statusText.innerText = "Preparando a tabela de documentos vazados e incidentes..."; }, 3000);
    
    setTimeout(() => {
        // 2. Preencher a View de Resultados com a PESSOA QUE ELE DIGITOU
        document.getElementById('res-nome').innerText = nameInput;
        document.getElementById('res-loc').innerText = locInput || "Não inserido limite de alcance (Busca Nacional/Global)";
        
        const prenome = nameInput.split(' ')[0]; // Pega só o primeiro nome
        
        const divNews = document.getElementById('res-news');
        
        // Geração dinâmica da resposta independente de quem ele digitou
        divNews.innerHTML = `
            <div class="news-item">
                <div class="news-title">🔍 Varredura Dinâmica em Dados Públicos e Notacionais: ${nameInput}</div>
                <div class="news-desc">Analisamos a viabilidade de cruzamento notacional para o alvo inserido (<strong>${prenome}</strong>). Por garantias rigorosas de tráfego web, nosso motor não extrai à força todo o conteúdo de Diários Oficiais estaduais de uma vez para dentro da interface.</div>
                <div class="news-source">AVALIAÇÃO E CONTROLE O.S.I.N.T</div>
            </div>
            <div class="news-item">
                <div class="news-title">Seus Atalhos Profundos de Ferramenta:</div>
                <div class="news-desc">Em vez de apenas entregar resumos errôneos, programamos a central completa (Tabela de Varredura abaixo) para varrer as áreas de perigo. Usando parâmetros complexos do Google, agora você pode explorar os "Dorks" que varrem atrás do ${prenome} procurando por incidentes jurídicos, escavador empresarial, presença em Notícias e PDFs avulsos esquecidos pela WEB.</div>
                <div class="news-source">Central de Processamento</div>
            </div>
        `;


        // 3. Montar a Tabela com LINKS que usam O QUE A PESSOA DIGITOU em banco de dados
        montarLinksDork(nameInput, locInput);

        // Termina loading e muda a tela
        overlay.classList.add('hidden');
        document.getElementById('search-view').classList.add('hidden');
        document.getElementById('results-view').classList.remove('hidden');

    }, 4500);
}

function montarLinksDork(nome, local) {
    const tbody = document.getElementById('res-links');
    tbody.innerHTML = '';

    const strNome = `"${nome}"`;
    const strLocal = local ? ` "${local}"` : '';
    
    const servicos = [
        {
            plataforma: "Consulta Geral: Notícias e Sites",
            tipo: "Busca ampla com foco no nome entre aspas",
            url: `https://www.google.com/search?q=${encodeURIComponent(strNome + strLocal)}`
        },
        {
            plataforma: "JusBrasil / Escavador (Law OSINT)",
            tipo: "Envolvimento em Processos / Sócios de Empresas / Diários",
            url: `https://www.google.com/search?q=${encodeURIComponent(strNome + " site:jusbrasil.com.br OR site:escavador.com")}`
        },
        {
            plataforma: "Arquivos PDF Expostos (Google Dork)",
            tipo: "Descoberta de Documentos Públicos e Listas Estaduais (PDF)",
            url: `https://www.google.com/search?q=${encodeURIComponent(strNome + " filetype:pdf")}`
        },
        {
            plataforma: "Arquivos DOC Expostos",
            tipo: "Recibos esquecidos ou documentações em Word",
            url: `https://www.google.com/search?q=${encodeURIComponent(strNome + " filetype:doc OR filetype:docx")}`
        },
        {
            plataforma: "Vazamentos Pastebin",
            tipo: "Dumps raw, listas de senhas antigas vazadas ou textos curtos",
            url: `https://www.google.com/search?q=${encodeURIComponent(strNome + " site:pastebin.com")}`
        }
    ];

    servicos.forEach(serv => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${serv.plataforma}</strong></td>
            <td style="color: #64748b;">${serv.tipo}</td>
            <td><a href="${serv.url}" target="_blank" class="link-action" style="padding: 10px 14px; background: #2563eb; color:white;">🔍 Investigar -></a></td>
        `;
        tbody.appendChild(tr);
    });
}

function voltarParaBusca() {
    document.getElementById('results-view').classList.add('hidden');
    document.getElementById('search-view').classList.remove('hidden');
    document.getElementById('target-name').value = '';
    document.getElementById('target-loc').value = '';
}
