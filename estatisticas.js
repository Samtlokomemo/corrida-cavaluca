const resultados = JSON.parse(localStorage.getItem('resultadosCorrida'));

if (!resultados) {
    document.body.innerHTML = "<h1>Nenhuma corrida encontrada</h1>";
}

const tabela = document.getElementById('tabela');

function montarTabela() {
    tabela.innerHTML = `
        <tr>
            <th>Posição</th>
            <th>Cavalo</th>
            <th>Tempo</th>
            <th>Diferença</th>
        </tr>
    `;

    const tempoPrimeiro = resultados[0].tempo;

    resultados.forEach(r => {
        const diferenca = r.tempo - tempoPrimeiro;

        tabela.innerHTML += `
            <tr>
                <td>${r.colocacao}º</td>
                <td>${r.nome}</td>
                <td>${(r.tempo/1000).toFixed(2)}s</td>
                <td>${r.colocacao === 1 ? '-' : '+' + (diferenca/1000).toFixed(2) + 's'}</td>
            </tr>
        `;
    });
}

function voltar() {
    localStorage.setItem('voltarParaPodio', 'true');
    window.location.href = 'corrida.html';
}

montarTabela();