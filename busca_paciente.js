const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  databaseURL: "https://SEU_PROJETO-default-rtdb.firebaseio.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const pacientesRef = db.ref('pacientes');

const buscarForm = document.getElementById('buscar-form');
const resultadosDiv = document.getElementById('resultados');
const cadastroDiv = document.getElementById('cadastro');
const cadastroForm = document.getElementById('cadastro-form');

buscarForm.addEventListener('submit', (e) => {
  e.preventDefault();
  resultadosDiv.innerHTML = '';
  cadastroDiv.style.display = 'none';

  const nomeBusca = document.getElementById('nome-busca').value.toLowerCase();
  const nascBusca = document.getElementById('nasc-busca').value;

  pacientesRef.once('value', (snapshot) => {
    const pacientes = snapshot.val();
    let encontrados = [];

    for (let id in pacientes) {
      const p = pacientes[id];
      if (p.nome.toLowerCase() === nomeBusca && p.nascimento === nascBusca) {
        encontrados.push({id, ...p});
      }
    }

    if (encontrados.length > 0) {
      encontrados.forEach(p => {
        const div = document.createElement('div');
        div.classList.add('paciente');
        div.innerHTML = `<strong>${p.nome}</strong> - Nascimento: ${p.nascimento} - CPF: ${p.cpf} - Telefone: ${p.telefone} - Endereço: ${p.endereco || ''} 
          <button onclick="atenderPaciente('${p.id}', '${p.nome}')">Atender</button>`;
        resultadosDiv.appendChild(div);
      });
    } else {
      const btnCadastrar = document.createElement('button');
      btnCadastrar.textContent = 'Cadastrar Paciente';
      btnCadastrar.onclick = () => {
        cadastroDiv.style.display = 'block';
        document.getElementById('nome').value = document.getElementById('nome-busca').value;
        document.getElementById('nascimento').value = nascBusca;
      };
      resultadosDiv.appendChild(btnCadastrar);
    }
  });
});

cadastroForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const nascimento = document.getElementById('nascimento').value;
  const cpf = document.getElementById('cpf').value;
  const telefone = document.getElementById('telefone').value;
  const endereco = document.getElementById('endereco').value;

  const newRef = pacientesRef.push({nome, nascimento, cpf, telefone, endereco});
  alert('Paciente cadastrado com sucesso!');

  cadastroForm.reset();
  cadastroDiv.style.display = 'none';

  resultadosDiv.innerHTML = '';
  const btnAtender = document.createElement('button');
  btnAtender.textContent = 'Atender Paciente';
  btnAtender.onclick = () => atenderPaciente(newRef.key, nome);
  resultadosDiv.appendChild(btnAtender);
});

function atenderPaciente(id, nome) {
  localStorage.setItem('pacienteId', id);
  localStorage.setItem('pacienteNome', nome);
  window.location.href = 'paciente.html';
}