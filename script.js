const anoSelect = document.getElementById("ano");
const mesSelect = document.getElementById("mes");
const diasGrid = document.getElementById("dias");
const modal = document.getElementById("modal");
const fecharModal = document.getElementById("fechar-modal");
const dataSelecionada = document.getElementById("data-selecionada");
const novaTarefaInput = document.getElementById("nova-tarefa");
const adicionarTarefaBtn = document.getElementById("adicionar-tarefa");
const tarefasDoDia = document.getElementById("tarefas-do-dia");
const listaTarefas = document.getElementById("lista-tarefas");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || {};

function preencherAnoMes() {
  const anoAtual = new Date().getFullYear();
  for (let a = anoAtual - 1; a <= anoAtual + 1; a++) {
    anoSelect.innerHTML += `<option value="${a}">${a}</option>`;
  }

  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  meses.forEach((m, i) => {
    mesSelect.innerHTML += `<option value="${i}">${m}</option>`;
  });

  anoSelect.value = anoAtual;
  mesSelect.value = new Date().getMonth();
  renderizarDias();
}

function renderizarDias() {
  diasGrid.innerHTML = "";
  const ano = parseInt(anoSelect.value);
  const mes = parseInt(mesSelect.value);
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();

  for (let i = 0; i < primeiroDia; i++) {
    diasGrid.innerHTML += `<div></div>`;
  }

  for (let d = 1; d <= diasNoMes; d++) {
    const div = document.createElement("div");
    div.textContent = d;
    div.addEventListener("click", () => abrirModal(ano, mes, d));
    diasGrid.appendChild(div);
  }
}

function abrirModal(ano, mes, dia) {
  const dataKey = `${ano}-${mes + 1}-${dia}`;
  dataSelecionada.textContent = `${dia}/${mes + 1}/${ano}`;
  novaTarefaInput.value = "";
  tarefasDoDia.innerHTML = "";
  modal.style.display = "block";

  if (tarefas[dataKey]) {
    tarefas[dataKey].forEach((tarefa, index) => {
      const li = document.createElement("li");
      li.textContent = tarefa;

      const btnExcluir = document.createElement("button");
      btnExcluir.textContent = "Excluir";
      btnExcluir.onclick = () => {
        tarefas[dataKey].splice(index, 1);
        if (tarefas[dataKey].length === 0) {
          delete tarefas[dataKey];
        }
        salvarTarefas();
        abrirModal(ano, mes, dia);
      };

      li.appendChild(btnExcluir);
      tarefasDoDia.appendChild(li);
    });
  }

  adicionarTarefaBtn.onclick = () => {
    const novaTarefa = novaTarefaInput.value.trim();
    if (novaTarefa) {
      if (!tarefas[dataKey]) tarefas[dataKey] = [];
      tarefas[dataKey].push(novaTarefa);
      salvarTarefas();
      abrirModal(ano, mes, dia);
    }
  };
}

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  atualizarMinhasTarefas();
}

function atualizarMinhasTarefas() {
  listaTarefas.innerHTML = "";
  for (let data in tarefas) {
    tarefas[data].forEach((tarefa, index) => {
      const li = document.createElement("li");
      li.textContent = `${data}: ${tarefa}`;

      const btnExcluir = document.createElement("button");
      btnExcluir.textContent = "Excluir";
      btnExcluir.onclick = () => {
        tarefas[data].splice(index, 1);
        if (tarefas[data].length === 0) {
          delete tarefas[data];
        }
        salvarTarefas();
      };

      li.appendChild(btnExcluir);
      listaTarefas.appendChild(li);
    });
  }
}

function atualizarContadorEnem() {
  const hoje = new Date();
  const enem = new Date("2025-11-02"); // Data exemplo
  const diff = Math.ceil((enem - hoje) / (1000 * 60 * 60 * 24));
  document.getElementById("contador").textContent =
    diff >= 0 ? `${diff} dias até o ENEM` : "O ENEM já passou!";
}

anoSelect.addEventListener("change", renderizarDias);
mesSelect.addEventListener("change", renderizarDias);
fecharModal.addEventListener("click", () => (modal.style.display = "none"));

preencherAnoMes();
atualizarMinhasTarefas();
atualizarContadorEnem();

function mostrarAba(aba) {
  document.getElementById("aba-principal").style.display = aba === 'principal' ? 'block' : 'none';
  document.getElementById("aba-segunda").style.display = aba === 'segunda' ? 'block' : 'none';
}
