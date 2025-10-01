// Importa as funções necessárias, incluindo doc, deleteDoc e updateDoc
import { db } from './firebase-client.js';
import { collection, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Pega os elementos do HTML
const tableBody = document.getElementById('volunteers-table-body');
const searchInput = document.getElementById('searchInput');
const noResultsMessage = document.getElementById('no-results-message');

let allVolunteers = []; // Array para guardar todos os voluntários

// Função para renderizar os dados na tabela
function renderTable(data) {
    tableBody.innerHTML = '';
    noResultsMessage.style.display = 'none';

    if (data.length === 0) {
        noResultsMessage.style.display = 'block';
        return;
    }

    data.forEach(volunteer => {
        const volunteerData = volunteer.data;
        const formattedDate = volunteerData.data_inscricao.toDate().toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        const row = `
            <tr>
                <td>${volunteerData.nome}</td>
                <td>${volunteerData.email}</td>
                <td>${volunteerData.telefone}</td>
                <td>${volunteerData.mensagem}</td>
                <td>${formattedDate}</td>
                <td>
                    <select class="status-select" data-id="${volunteer.id}">
                        <option value="ativo" ${volunteerData.status === 'ativo' ? 'selected' : ''}>Ativo</option>
                        <option value="inativo" ${volunteerData.status === 'inativo' ? 'selected' : ''}>Inativo</option>
                        <option value="pendente" ${volunteerData.status === 'pendente' ? 'selected' : ''}>Pendente</option>
                    </select>
                </td>
                <td>
                    <button class="delete-btn" data-id="${volunteer.id}">Excluir</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Função para buscar todos os voluntários do Firebase
async function fetchAllVolunteers() {
    try {
        const q = query(collection(db, "voluntarios"), orderBy("data_inscricao", "desc"));
        const querySnapshot = await getDocs(q);
        
        allVolunteers = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
        
        renderTable(allVolunteers);

    } catch (error) {
        console.error("Erro ao buscar voluntários: ", error);
        tableBody.innerHTML = '<tr><td colspan="7">Ocorreu um erro ao carregar os dados.</td></tr>';
    }
}

// Lógica de busca
searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredVolunteers = allVolunteers.filter(v => v.data.nome.toLowerCase().includes(searchTerm));
    renderTable(filteredVolunteers);
});

// Lógica para AÇÕES NA TABELA (Excluir e Mudar Status)
tableBody.addEventListener('click', async (event) => {
    // Se o clique foi num botão de excluir
    if (event.target.classList.contains('delete-btn')) {
        const docId = event.target.dataset.id;
        if (confirm("Tem a certeza de que deseja excluir esta inscrição?")) {
            try {
                await deleteDoc(doc(db, "voluntarios", docId));
                fetchAllVolunteers(); // Recarrega os dados para atualizar a tabela
            } catch (error) {
                console.error("Erro ao excluir documento: ", error);
            }
        }
    }
});

tableBody.addEventListener('change', async (event) => {
    // Se a mudança foi numa caixa de seleção de status
    if (event.target.classList.contains('status-select')) {
        const selectElement = event.target;
        const docId = selectElement.dataset.id;
        const newStatus = selectElement.value;

        // Encontra os dados do voluntário no nosso array local para obter o nome e o status original
        const volunteer = allVolunteers.find(v => v.id === docId);
        if (!volunteer) return; // Sai se o voluntário não for encontrado

        const volunteerName = volunteer.data.nome;
        const originalStatus = volunteer.data.status;

        // Cria a mensagem de confirmação personalizada
        const confirmationMessage = `Tem a certeza de que deseja alterar o status de "${volunteerName}" para "${newStatus}"?`;

        // Pede a confirmação ao administrador
        if (confirm(confirmationMessage)) {
            // Se confirmado, atualiza o Firebase
            try {
                const volunteerRef = doc(db, "voluntarios", docId);
                await updateDoc(volunteerRef, {
                    status: newStatus
                });
                // Atualiza também o status no nosso array local
                volunteer.data.status = newStatus;
            } catch (error) {
                console.error("Erro ao atualizar status: ", error);
                // Se der erro, reverte a mudança na tela
                selectElement.value = originalStatus;
            }
        } else {
            // Se cancelado, reverte a mudança na tela
            selectElement.value = originalStatus;
        }
    }
});


// Carrega os voluntários ao iniciar a página
fetchAllVolunteers();