import { db, collection, addDoc, serverTimestamp } from './firebase-client.js';

const form = document.getElementById('acolyte-form');
const submitBtn = document.getElementById('submit-btn');
const feedbackMessage = document.getElementById('feedback-message');

/**
 * Função auxiliar que converte um arquivo para uma string Base64.
 * @param {File} file
 * @returns {Promise<string|null>} 
 */
const converterParaBase64 = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};


form.addEventListener('submit', async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = 'A registar...';
    feedbackMessage.style.display = 'none';
    feedbackMessage.className = '';

    try {
        const dadosPessoais = {
            nome: document.getElementById('nome').value,
            nascimento: document.getElementById('nascimento').value,
            escola: document.getElementById('escola').value,
            serie: document.getElementById('serie').value,
        };

        const historicoSaude = {
            alergias: document.getElementById('alergias').value,
            medicamentos: document.getElementById('medicamentos').value,
            condicoes: document.getElementById('condicoes').value,
        };

        const contatosEmergencia = {
            contato1_nome: document.getElementById('contato1_nome').value,
            contato1_telefone: document.getElementById('contato1_telefone').value,
        };

        // --- Conversão dos arquivos para Base64 
        const fotoFile = document.getElementById('foto').files[0];
        const certidaoFile = document.getElementById('certidao').files[0];
        const docEscolarFile = document.getElementById('docEscolar').files[0];

        const fotoBase64 = await converterParaBase64(fotoFile);
        const certidaoBase64 = await converterParaBase64(certidaoFile);
        const docEscolarBase64 = await converterParaBase64(docEscolarFile);

        // objeto final salvo no firestore
        const acolyteData = {
            ...dadosPessoais,
            ...historicoSaude,
            ...contatosEmergencia,
            fotoBase64,       
            certidaoBase64,   
            docEscolarBase64, 
            registadoEm: serverTimestamp()
        };

        await addDoc(collection(db, "acolitos"), acolyteData);

        feedbackMessage.textContent = 'Acólito registado com sucesso!';
        feedbackMessage.className = 'success';
        feedbackMessage.style.display = 'block';
        alert("Registrado com sucesso.")
        form.reset();

    } catch (error) {
        console.error("Erro ao registar acólito: ", error);
        alert("Erro ao registar acólito")
        feedbackMessage.textContent = 'Ocorreu um erro ao registar. Tente novamente.';
        feedbackMessage.className = 'error';
        feedbackMessage.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Registar Acólito';
    }
});