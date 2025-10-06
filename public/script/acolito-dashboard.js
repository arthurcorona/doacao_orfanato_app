import { db } from './firebase-client.js';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tableBody = document.getElementById('acolytes-table-body');
const searchInput = document.getElementById('searchInput');
const noResultsMessage = document.getElementById('no-results-message');

let allAcolytes = []; 

function renderTable(data) {
    tableBody.innerHTML = '';
    noResultsMessage.style.display = 'none';

    if (data.length === 0) {
        noResultsMessage.style.display = 'block';
        return;
    }

    data.forEach(acolyte => {
        const acolyteData = acolyte.data;

        const contatos = `${acolyteData.contato1_nome}: ${acolyteData.contato1_telefone}`;

        const documentosLinks = `
            ${acolyteData.fotoBase64 ? `<a href="${acolyteData.fotoBase64}" target="_blank">Ver Foto</a>` : 'N/A'} <br>
            ${acolyteData.certidaoBase64 ? `<a href="${acolyteData.certidaoBase64}" download="certidao_${acolyteData.nome}.pdf">Baixar Certidão</a>` : 'N/A'} <br>
            ${acolyteData.docEscolarBase64 ? `<a href="${acolyteData.docEscolarBase64}" target="_blank">Ver Doc. Escolar</a>` : 'N/A'}
        `;

        const row = `
            <tr>
                <td>${acolyteData.nome}</td>
                <td>${new Date(acolyteData.nascimento).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                <td>${acolyteData.escola} - ${acolyteData.serie}</td>
                <td>${contatos}</td>
                <td>${documentosLinks}</td>
                <td>
                    <button class="delete-btn" data-id="${acolyte.id}" data-name="${acolyteData.nome}">Excluir</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

async function fetchAllAcolytes() {
    try {
        const q = query(collection(db, "acolitos"), orderBy("nome"));
        const querySnapshot = await getDocs(q);
        
        allAcolytes = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
        
        renderTable(allAcolytes);

    } catch (error) {
        console.error("Erro ao buscar acólitos: ", error);
        tableBody.innerHTML = '<tr><td colspan="6">Ocorreu um erro ao carregar os dados.</td></tr>';
    }
}

searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredAcolytes = allAcolytes.filter(acolyte => 
        acolyte.data.nome.toLowerCase().includes(searchTerm)
    );
    renderTable(filteredAcolytes);
});

tableBody.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const docId = event.target.dataset.id;
        const acolyteName = event.target.dataset.name;
        
        if (confirm(`Tem a certeza de que deseja excluir o registo de "${acolyteName}"? Esta ação não pode ser desfeita.`)) {
            try {
                await deleteDoc(doc(db, "acolitos", docId));
                fetchAllAcolytes();
            } catch (error) {
                console.error("Erro ao excluir documento: ", error);
                alert("Ocorreu um erro ao excluir o registo.");
            }
        }
    }
});

fetchAllAcolytes();