document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os elementos do DOM
    const donationTypeRadios = document.querySelectorAll('input[name="tipo_doacao"]');
    const infoDinheiro = document.getElementById('info-dinheiro');
    const infoOutros = document.getElementById('info-outros');

    // Função para atualizar a visibilidade das seções
    function toggleDonationInfo() {
        // Pega o valor do radio button selecionado
        const selectedType = document.querySelector('input[name="tipo_doacao"]:checked').value;

        if (selectedType === 'dinheiro') {
            infoDinheiro.classList.add('active');
            infoOutros.classList.remove('active');
        } else {
            infoDinheiro.classList.remove('active');
            infoOutros.classList.add('active');
        }
    }

    // Adiciona um 'listener' para cada radio button
    donationTypeRadios.forEach(radio => {
        radio.addEventListener('change', toggleDonationInfo);
    });

    // Chama a função uma vez no início para garantir que o estado inicial esteja correto
    toggleDonationInfo();
});