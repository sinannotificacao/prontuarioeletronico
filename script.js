// Configure aqui seu Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  databaseURL: "https://SEU_PROJETO-default-rtdb.firebaseio.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Referência ao chat
const chatRef = db.ref('chat');

// Seleção do formulário e chat
const form = document.getElementById('chat-form');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const mensagem = document.getElementById('mensagem').value;

  chatRef.push().set({
    nome,
    mensagem,
    timestamp: Date.now()
  });

  form.reset();
});

// Ouvir novas mensagens
chatRef.on('child_added', (snapshot) => {
  const data = snapshot.val();
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<strong>${data.nome}:</strong> ${data.mensagem}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
});