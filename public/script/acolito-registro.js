import { db } from './firebase-client.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const form = document.getElementById('acolyte-form');
const submitBtn = document.getElementById('submit-btn');
const feedbackMessage = document.getElementById('feedback-message');

const storage = getStorage();

async function uploadFile(file, path) {
    if (!file) return null;
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'A processar...';
    feedbackMessage.style.display = 'none';

    try {
        const nome = document.getElementById('nome').value;
        const nascimento = document.getElementById('nascimento').value;

        // 1. Fazer o upload dos ficheiros para o Firebase Storage
        const fotoFile = document.getElementById('foto').files[0];
        const certidaoFile = document.getElementById('certidao').files[0];
        const docEscolarFile = document.getElementById('docEscolar').files[0];
        
        const fotoURL = await uploadFile(fotoFile, `acolitos/${nome}/foto_${fotoFile.name}`);
        const certidaoURL = await uploadFile(certidaoFile, `acolitos/${nome}/certidao_${certidaoFile.name}`);
        const docEscolarURL = await uploadFile(docEscolarFile, `acolitos/${nome}/docEscolar_${docEscolarFile.name}`);

        // 2. Preparar o objeto de dados para o Firestore
        const acolyteData = {
            nomeCompleto: nome,
            dataNascimento: nascimento,
            escola: document.getElementById('escola').value,
            serie: document.getElementById('serie').value,
            historicoSaude: {
                alergias: document.getElementById('alergias').value,
                medicamentos: document.getElementById('medicamentos').value,
                condicoesMedicas: document.getElementById('condicoes').value,
            },
            contatosEmergencia: [{
                nome: document.getElementById('contato1_nome').value,
                telefone: document.getElementById('contato1_telefone').value,
                parentesco: 'Não especificado'
            }],
            urlFotoIdentificacao: fotoURL,
            urlCertidaoNascimento: certidaoURL,
            urlDocumentoEscolar: docEscolarURL,
            dataInclusao: new Date()
        };

        // 3. Guardar os dados no Firestore
        await addDoc(collection(db, "acolitos"), acolyteData);

        feedbackMessage.textContent = 'Acólito registado com sucesso!';
        feedbackMessage.style.color = 'green';
        form.reset();

    } catch (error) {
        console.error("Erro ao registar acólito: ", error);
        feedbackMessage.textContent = 'Erro ao registar. Tente novamente.';
        feedbackMessage.style.color = 'red';
    } finally {
        feedbackMessage.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Registar Acólito';
    }
});