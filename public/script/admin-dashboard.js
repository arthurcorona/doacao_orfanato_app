console.log("js carregado");


import { db } from './firebase-client.js';
import { 
    collection, 
    getDocs, 
    query, 
    orderBy, 
    doc, 
    deleteDoc, 
    updateDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tableBody = document.getElementById('volunteers-table-body');
const searchInput = document.getElementById('searchInput');
const noResultsMessage = document.getElementById('no-results-message');

const modal = document.getElementById('edit-modal');
const modalCloseBtn = document.querySelector('.modal-close-btn');
const editForm = document.getElementById('edit-volunteer-form');
const editFormId = document.getElementById('edit_volunteer_id');
const referenciasListDiv = document.getElementById('edit_referencias_list');

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
        
        // Formata a data de inscrição
        const formattedDate = volunteerData.data_inscricao?.toDate().toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        }) || 'N/A';

        // --- NOVO CÓDIGO ---
        // Formata a data de nascimento (que está como 'YYYY-MM-DD')
        let dataNasc = 'N/A';
        if (volunteerData.data_nascimento) {
            const partes = volunteerData.data_nascimento.split('-');
            if (partes.length === 3) {
                dataNasc = `${partes[2]}/${partes[1]}/${partes[0]}`; // Formata para DD/MM/YYYY
            }
        }
        // --- FIM DO NOVO CÓDIGO ---

        const row = `
            <tr>
                <td>${volunteerData.nome || 'N/A'}</td>
                <td>${volunteerData.email || 'N/A'}</td>
                <td>${volunteerData.telefone || 'N/A'}</td>
                <td>${formattedDate}</td>
                <td>${dataNasc}</td> <td>
                    <select class="status-select" data-id="${volunteer.id}">
                        <option value="pendente" ${volunteerData.status === 'pendente' ? 'selected' : ''}>Pendente</option>
                        <option value="ativo" ${volunteerData.status === 'ativo' ? 'selected' : ''}>Ativo</option>
                        <option value="inativo" ${volunteerData.status === 'inativo' ? 'selected' : ''}>Inativo</option>
                    </select>
                </td>
                <td class="actions-cell">
                    <button class="view-btn" data-id="${volunteer.id}">Ver/Editar</button>
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
        tableBody.innerHTML = '<tr><td colspan="6">Ocorreu um erro ao carregar os dados.</td></tr>';
    }
}


function openEditModal(volunteer) {
    const data = volunteer.data;
    
    editFormId.value = volunteer.id;
    editForm.nome.value = data.nome || '';
    editForm.email.value = data.email || '';
    editForm.telefone.value = data.telefone || '';
    editForm.data_nascimento.value = data.data_nascimento || '';
    editForm.sexo.value = data.sexo || 'nao_informar';
    editForm.endereco.value = data.endereco || '';
    
    editForm.como_soube.value = data.como_soube || '';
    editForm.projeto_interesse.value = data.projeto_interesse || '';
    editForm.horas_semanais.value = data.horas_semanais || 0;
    editForm.tempo_atuacao.value = data.tempo_atuacao || '';
    editForm.horarios_disponiveis.value = data.horarios_disponiveis || '';
    editForm.motivacao.value = data.motivacao || '';
    editForm.ganhos_pessoais.value = data.ganhos_pessoais || '';

    referenciasListDiv.innerHTML = ''; 
    if (data.referencias && data.referencias.length > 0) {
        data.referencias.forEach((ref, index) => {
            referenciasListDiv.innerHTML += `
                <p>
                    <strong>Ref. ${index + 1}:</strong> ${ref.nome || 'N/A'} <br>
                    <strong>Tel:</strong> ${ref.telefone || 'N/A'}
                </p>
            `;
        });
    } else {
        referenciasListDiv.innerHTML = '<p>Nenhuma referência fornecida.</p>';
    }

    modal.style.display = 'block';
}

function closeEditModal() {
    modal.style.display = 'none';
}

searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredVolunteers = allVolunteers.filter(v => 
        v.data.nome.toLowerCase().includes(searchTerm) ||
        v.data.email.toLowerCase().includes(searchTerm)
    );
    renderTable(filteredVolunteers);
});

tableBody.addEventListener('change', async (event) => {
    if (event.target.classList.contains('status-select')) {
        const selectElement = event.target;
        const docId = selectElement.dataset.id;
        const newStatus = selectElement.value;
        
        if (confirm(`Tem certeza que deseja alterar o status para "${newStatus}"?`)) {
            try {
                const volunteerRef = doc(db, "voluntarios", docId);
                await updateDoc(volunteerRef, { status: newStatus });
                
                // Atualiza o cache local
                const volunteerInCache = allVolunteers.find(v => v.id === docId);
                if (volunteerInCache) volunteerInCache.data.status = newStatus;
                
            } catch (error) {
                console.error("Erro ao atualizar status: ", error);
                alert("Erro ao atualizar status.");
                selectElement.value = allVolunteers.find(v => v.id === docId).data.status; // Reverte
            }
        } else {
            selectElement.value = allVolunteers.find(v => v.id === docId).data.status; // Reverte
        }
    }
});

tableBody.addEventListener('click', async (event) => {
    // Lógica para EXCLUIR
    if (event.target.classList.contains('delete-btn')) {
        const docId = event.target.dataset.id;
        if (confirm("Tem certeza de que deseja EXCLUIR este voluntário? Esta ação não pode ser desfeita.")) {
            try {
                await deleteDoc(doc(db, "voluntarios", docId));
                fetchAllVolunteers(); // Recarrega a tabela
            } catch (error) {
                console.error("Erro ao excluir documento: ", error);
                alert("Erro ao excluir voluntário.");
            }
        }
    }

    // Lógica para ABRIR MODAL
    if (event.target.classList.contains('view-btn')) {
        const docId = event.target.dataset.id;
        const volunteer = allVolunteers.find(v => v.id === docId);
        if (volunteer) {
            openEditModal(volunteer);
        }
    }
});

// Listener para fechar o modal (no 'X')
modalCloseBtn.addEventListener('click', closeEditModal);

// Listener para fechar o modal (clicando fora)
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        closeEditModal();
    }
});

// Listener para SALVAR o formulário do modal
editForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const docId = editFormId.value;
    if (!docId) return;

    const submitButton = editForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Salvando...';

    try {
        const updatedData = {
            nome: editForm.nome.value,
            email: editForm.email.value,
            telefone: editForm.telefone.value,
            data_nascimento: editForm.data_nascimento.value,
            sexo: editForm.sexo.value,
            endereco: editForm.endereco.value,
            como_soube: editForm.como_soube.value,
            projeto_interesse: editForm.projeto_interesse.value,
            horas_semanais: Number(editForm.horas_semanais.value),
            tempo_atuacao: editForm.tempo_atuacao.value,
            horarios_disponiveis: editForm.horarios_disponiveis.value,
            motivacao: editForm.motivacao.value,
            ganhos_pessoais: editForm.ganhos_pessoais.value,
            // Nota: As referências não são editáveis neste formulário
        };

        const volunteerRef = doc(db, "voluntarios", docId);
        await updateDoc(volunteerRef, updatedData);

        alert("Voluntário atualizado com sucesso!");
        closeEditModal();
        fetchAllVolunteers(); // Recarrega a tabela

    } catch (error) {
        console.error("Erro ao salvar alterações: ", error);
        alert("Ocorreu um erro ao salvar. Tente novamente.");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Salvar Alterações';
    }
});

fetchAllVolunteers();