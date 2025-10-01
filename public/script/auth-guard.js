import { auth } from './firebase-client.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {

        if (window.location.pathname !== '/login') {
            console.log('Utilizador não autenticado. A redirecionar para o login...');
            window.location.href = '/';
        }
    } else {
        const logoutButton = document.getElementById('logout-btn');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                signOut(auth).then(() => {
                    console.log('Logout efetuado com sucesso.');
                }).catch((error) => {
                    console.error('Erro ao fazer logout:', error);
                });
            });
        }
    }
});