document.addEventListener('DOMContentLoaded', function() {
    const donationTypeRadios = document.querySelectorAll('input[name="tipo_doacao"]');
    const infoDinheiro = document.getElementById('info-dinheiro');
    const infoOutros = document.getElementById('info-outros');

    function toggleDonationInfo() {
        const selectedType = document.querySelector('input[name="tipo_doacao"]:checked').value;

        if (selectedType === 'dinheiro') {
            infoDinheiro.classList.add('active');
            infoOutros.classList.remove('active');
        } else {
            infoDinheiro.classList.remove('active');
            infoOutros.classList.add('active');
        }
    }

    donationTypeRadios.forEach(radio => {
        radio.addEventListener('change', toggleDonationInfo);
    });

    toggleDonationInfo();
});
