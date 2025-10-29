import { db } from './firebase-client.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById('volunteer-form');
const successMessage = document.getElementById('success-message');
const submitButton = form.querySelector('button[type="submit"]');

// --- Bloco do Botão de Adicionar Referência ---
const addRefButton = document.getElementById('add-referencia-btn');
const referenciasContainer = document.getElementById('referencias-container');
let referenciaCount = 1; // Já temos a Referência 1 na página

addRefButton.addEventListener('click', () => {
    referenciaCount++; // Incrementa o contador

    // Cria um novo 'div' para o grupo de campos
    const newRefGroup = document.createElement('div');
    newRefGroup.classList.add('referencia-group', 'form-group');

    // Define o HTML interno do novo 'div'
    newRefGroup.innerHTML = `
        <label for="ref${referenciaCount}_nome">Referência ${referenciaCount}: Nome</label>
        <input type="text" id="ref${referenciaCount}_nome" name="ref_nome"> 
        
        <label for="ref${referenciaCount}_telefone">Referência ${referenciaCount}: Telefone</label>
        <input type="tel" id="ref${referenciaCount}_telefone" name="ref_telefone" placeholder="(XX) XXXXX-XXXX">
    `;

    // Adiciona o novo grupo de campos ao container
    referenciasContainer.appendChild(newRefGroup);
});


// --- Bloco de Envio do Formulário (MODIFICADO) ---
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    successMessage.style.display = 'none';

    try {
        const nomesRefs = form.querySelectorAll('input[name="ref_nome"]');
        const telefonesRefs = form.querySelectorAll('input[name="ref_telefone"]');
        const referenciasArray = [];

        for (let i = 0; i < nomesRefs.length; i++) {
            const nome = nomesRefs[i].value;
            const telefone = telefonesRefs[i].value;

            if (nome.trim() !== '' || telefone.trim() !== '') {
                referenciasArray.push({ 
                    nome: nome, 
                    telefone: telefone 
                });
            }
        }

        const dadosVoluntario = {
            nome: form.nome.value,
            data_nascimento: form.data_nascimento.value,
            sexo: form.sexo.value,
            endereco: form.endereco.value,
            email: form.email.value,
            telefone: form.tel_comercial.value, 
            como_soube: form.como_soube.value,
            projeto_interesse: form.projeto_interesse.value,
            horas_semanais: form.horas_semanais.value,
            tempo_atuacao: form.tempo_atuacao.value,
            horarios_disponiveis: form.horarios_disponiveis.value,
            motivacao: form.motivacao.value,
            ganhos_pessoais: form.ganhos_pessoais.value,

            referencias: referenciasArray,
            termo_lei_aceito: form.termo_lei.checked,
            data_inscricao: new Date(),
            status: 'pendente'
        };

        const docRef = await addDoc(collection(db, "voluntarios"), dadosVoluntario);

        console.log("Documento salvo com ID: ", docRef.id);
        referenciasContainer.innerHTML = `
            <div class="referencia-group form-group">
                <label for="ref1_nome">Referência 1: Nome</label>
                <input type="text" id="ref1_nome" name="ref_nome"> 
                <label for="ref1_telefone">Referência 1: Telefone</label>
                <input type="tel" id="ref1_telefone" name="ref_telefone" placeholder="(XX) XXXXX-XXXX">
            </div>
        `;
        referenciaCount = 1;
        form.reset();
        successMessage.style.display = 'block';

    } catch (e) {
        console.error("Erro ao adicionar documento: ", e);
        alert("Ocorreu um erro ao enviar sua inscrição. Verifique se todos os campos obrigatórios estão preenchidos e tente novamente.");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar Inscrição';
    }
});