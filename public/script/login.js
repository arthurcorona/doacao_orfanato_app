import { auth } from './firebase-client.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('Login bem-sucedido:', userCredential.user);
            window.location.href = '/acolito';
        })
        .catch((error) => {
            console.error('Erro no login:', error.code);
            errorMessage.textContent = 'E-mail ou senha incorretos. Tente novamente.';
            errorMessage.style.display = 'block';
        });
});