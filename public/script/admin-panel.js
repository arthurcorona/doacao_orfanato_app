import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const db = getFirestore();

const tableBody = document.getElementById('volunteers-table-body');

async function fetchVolunteers() {
    try {
        const q = query(collection(db, "voluntarios"), orderBy("data_inscricao", "desc"));
        
        const querySnapshot = await getDocs(q);

        tableBody.innerHTML = ''; 

        if (querySnapshot.empty) {
            tableBody.innerHTML = '<tr><td colspan="5">Nenhuma inscrição encontrada.</td></tr>';
            return;
        }

        //criar tabela
        querySnapshot.forEach((doc) => {
            const volunteer = doc.data();
            
            const formattedDate = volunteer.data_inscricao.toDate().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const row = `
                <tr>
                    <td>${volunteer.nome}</td>
                    <td>${volunteer.email}</td>
                    <td>${volunteer.telefone}</td>
                    <td>${volunteer.mensagem}</td>
                    <td>${formattedDate}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Erro ao buscar voluntários: ", error);
        tableBody.innerHTML = '<tr><td colspan="5">Ocorreu um erro ao carregar os dados.</td></tr>';
    }
}

fetchVolunteers();