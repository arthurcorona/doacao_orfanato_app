import { auth } from './firebase-client.js'; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        if (window.location.pathname !== '/login') {
            console.log('Auth Guard: Usuário não autenticado. Redirecionando...');
            window.location.href = '/login';
        }
    }
});