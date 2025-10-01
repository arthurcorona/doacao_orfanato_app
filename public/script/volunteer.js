console.log("começo");
import { db } from './firebase-client.js';
// Importa as funções necessárias do Firebase
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Pega o formulário e a mensagem de sucesso do HTML
const form = document.getElementById('volunteer-form');
const successMessage = document.getElementById('success-message');

// Adiciona um "escutador" para o evento de envio do formulário
form.addEventListener('submit', async (event) => {
    // Previne o comportamento padrão do formulário (que é recarregar a página)
    event.preventDefault();

    try {
        // Pega os valores dos campos do formulário
        const nome = form.nome.value;
        const email = form.email.value;
        const telefone = form.telefone.value;
        const mensagem = form.mensagem.value;

        // Adiciona um novo documento à coleção "voluntarios" no Firestore
        const docRef = await addDoc(collection(db, "voluntarios"), {
            nome: nome,
            email: email,
            telefone: telefone,
            mensagem: mensagem,
            data_inscricao: new Date(),
            status: 'ativo'
        });

        console.log("Documento salvo com ID: ", docRef.id);
        
        // Limpa o formulário e mostra a mensagem de sucesso
        form.reset();
        successMessage.style.display = 'block';

    } catch (e) {
        console.error("Erro ao adicionar documento: ", e);
        alert("Ocorreu um erro ao enviar sua inscrição. Tente novamente.");
    }
});
console.log("fim.");
