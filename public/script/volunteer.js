import { db } from './firebase-client.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById('volunteer-form');
const successMessage = document.getElementById('success-message');

form.addEventListener('submit', async (event) => {
    // Previne o comportamento padrão do formulário
    event.preventDefault();

    try {
        const nome = form.nome.value;
        const email = form.email.value;
        const telefone = form.telefone.value;
        const mensagem = form.mensagem.value;

        const docRef = await addDoc(collection(db, "voluntarios"), {
            nome: nome,
            email: email,
            telefone: telefone,
            mensagem: mensagem,
            data_inscricao: new Date(),
            status: 'ativo'
        });

        console.log("Documento salvo com ID: ", docRef.id);
        
        form.reset();
        successMessage.style.display = 'block';

    } catch (e) {
        console.error("Erro ao adicionar documento: ", e);
        alert("Ocorreu um erro ao enviar sua inscrição. Tente novamente.");
    }
});
