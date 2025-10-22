const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close-btn");
const modalDate = document.getElementById("modal-date");
const form = document.getElementById("entry-form");
const nomeInput = document.getElementById("nome");
const valorInput = document.getElementById("valor");
const obsInput = document.getElementById("obs");
const carousel = document.getElementById("carousel");
const listaReservas = document.getElementById("lista-reservas");

let selectedDate = null;

function getSavedData() {
  return JSON.parse(localStorage.getItem("agenda")) || {};
}

function saveData(date, data) {
  const agenda = getSavedData();
  agenda[date] = data;
  localStorage.setItem("agenda", JSON.stringify(agenda));
  renderCalendar();
  renderLista();
}

function renderCalendar() {
  const agenda = getSavedData();
  carousel.innerHTML = "";

  const now = new Date();
  const startYear = now.getFullYear();
  const endYear = startYear + 1;

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 0; month < 12; month++) {
      const diasNoMes = new Date(year, month + 1, 0).getDate();
      const primeiroDiaSemana = new Date(year, month, 1).getDay();
      const mesDiv = document.createElement("div");
      mesDiv.classList.add("mes");

      const nomeMes = new Date(year, month).toLocaleString('pt-BR', { month: 'long' });

      mesDiv.innerHTML = `<h3>${nomeMes.toUpperCase()} ${year}</h3>`;

      const diasDiv = document.createElement("div");
      diasDiv.classList.add("dias");

      for (let i = 0; i < primeiroDiaSemana; i++) {
        const vazio = document.createElement("div");
        diasDiv.appendChild(vazio);
      }

      for (let dia = 1; dia <= diasNoMes; dia++) {
        const dateStr = `${year}-${month + 1}-${dia}`;
        const diaDiv = document.createElement("div");
        diaDiv.classList.add("dia");
        diaDiv.textContent = dia;

        if (agenda[dateStr]) {
          diaDiv.classList.add("reservado");
        }

        diaDiv.addEventListener("click", () => openModal(dateStr));
        diasDiv.appendChild(diaDiv);
      }

      mesDiv.appendChild(diasDiv);
      carousel.appendChild(mesDiv);
    }
  }
}

function openModal(date) {
  selectedDate = date;
  modalDate.textContent = `Editar: ${date}`;
  const data = getSavedData()[date] || { nome: "", valor: "", obs: "" };
  nomeInput.value = data.nome;
  valorInput.value = data.valor;
  obsInput.value = data.obs;
  modal.style.display = "block";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  saveData(selectedDate, {
    nome: nomeInput.value,
    valor: valorInput.value,
    obs: obsInput.value
  });
  modal.style.display = "none";
});

closeBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

function renderLista() {
  const agenda = getSavedData();
  const entradas = Object.entries(agenda);
  entradas.sort();

  listaReservas.innerHTML = "";

  entradas.forEach(([data, info]) => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${data}</strong> - ${info.nome} - R$ ${info.valor}`;
    listaReservas.appendChild(div);
  });
}

renderCalendar();
renderLista();
