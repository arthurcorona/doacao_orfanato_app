import { db } from './firebase-client.js';
import { collection, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tableBody = document.getElementById('volunteers-table-body');
const searchInput = document.getElementById('searchInput');
const noResultsMessage = document.getElementById('no-results-message');

let allVolunteers = [];

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

searchInput.addEventListener('input', (event) => {
    console.log("Digitando! Valor atual:", event.target.value);
    const searchTerm = event.target.value.toLowerCase();
    const filteredVolunteers = allVolunteers.filter(v => v.data.nome.toLowerCase().includes(searchTerm));
    renderTable(filteredVolunteers);
});

tableBody.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const docId = event.target.dataset.id;
        if (confirm("Tem a certeza de que deseja excluir esta inscrição?")) {
            try {
                await deleteDoc(doc(db, "voluntarios", docId));
                fetchAllVolunteers();
            } catch (error) {
                console.error("Erro ao excluir documento: ", error);
            }
        }
    }
});

tableBody.addEventListener('change', async (event) => {
    if (event.target.classList.contains('status-select')) {
        const selectElement = event.target;
        const docId = selectElement.dataset.id;
        const newStatus = selectElement.value;

        const volunteer = allVolunteers.find(v => v.id === docId);
        if (!volunteer) return;

        const volunteerName = volunteer.data.nome;
        const originalStatus = volunteer.data.status;

        const confirmationMessage = `Tem a certeza de que deseja alterar o status de "${volunteerName}" para "${newStatus}"?`;

        if (confirm(confirmationMessage)) {
            try {
                const volunteerRef = doc(db, "voluntarios", docId);
                await updateDoc(volunteerRef, {
                    status: newStatus
                });
                volunteer.data.status = newStatus;
            } catch (error) {
                console.error("Erro ao atualizar status: ", error);
                selectElement.value = originalStatus;
            }
        } else {
            selectElement.value = originalStatus;
        }
    }
});


fetchAllVolunteers();