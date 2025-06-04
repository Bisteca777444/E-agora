// script.js

const API_BASE = 'http://localhost:5000/api'; // ajuste para o domínio em produção

// Utilitário para salvar e obter o token
function saveToken(token) {
    localStorage.setItem('token', token);
}

function getToken() {
    return localStorage.getItem('token');
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// Verifica se está logado
function isLoggedIn() {
    return !!getToken();
}

// Função para requisições autenticadas
async function fetchWithAuth(url, options = {}) {
    const token = getToken();
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Content-Type': 'application/json',
            'x-auth-token': token
        }
    });
}

// FORM DE LOGIN
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (res.ok) {
                saveToken(data.token);
                alert("Login bem-sucedido!");
                window.location.href = "games.html";
            } else {
                alert(data.msg || "Erro ao logar.");
            }
        } catch (err) {
            console.error(err);
            alert("Erro de conexão com o servidor.");
        }
    });
}

// FORM DE REGISTRO
const registerForm = document.getElementById("register-form");
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            const data = await res.json();
            if (res.ok) {
                alert("Cadastro realizado. Faça login.");
                window.location.href = "login.html";
            } else {
                alert(data.msg || "Erro ao cadastrar.");
            }
        } catch (err) {
            console.error(err);
            alert("Erro de conexão com o servidor.");
        }
    });
}

// GAMES: Mostrar dados do usuário logado
if (window.location.pathname.includes("games.html")) {
    if (!isLoggedIn()) {
        alert("Você precisa estar logado para acessar os jogos.");
        window.location.href = "login.html";
    } else {
        fetchWithAuth(`${API_BASE}/users/me`)
            .then(res => res.json())
            .then(user => {
                const gamesList = document.querySelector(".games-list");
                if (user && gamesList) {
                    const welcome = document.createElement("div");
                    welcome.innerHTML = `
                        <h3>Bem-vindo, ${user.username}!</h3>
                        <p>Saldo atual: R$ ${user.balance.toFixed(2)}</p>
                        <button onclick="logout()">Sair</button>
                    `;
                    gamesList.prepend(welcome);
                }
            })
            .catch(() => {
                alert("Sessão expirada.");
                logout();
            });
    }
}

