import { auth } from './firebase-client.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const logoutButton = document.getElementById('logout-btn');

if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        signOut(auth).then(() => {
            console.log('Logout efetuado com sucesso. Redirecionando...');
            
            window.location.href = '/login';

        }).catch((error) => {
            console.error('Erro ao fazer logout:', error);
        });
    });
}