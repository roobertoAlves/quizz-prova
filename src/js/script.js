const TOTAL_MISTO = 15;

let questoesGlobal = [];
let categoriasGlobal = [];
let perguntasSelecionadas = [];
let totalRodada = 0;
let temaSelecionado = "";
let atual = 0;
let pontos = 0;
let respondida = false;

// ─── Utilitario ──────────────────────────────────────────────────────────────

function embaralhar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Selecao de questoes ──────────────────────────────────────────────────────

function questoesDaCategoria(nome) {
  return questoesGlobal.filter(q => q.categoria === nome);
}

function sortearMisto() {
  const selecionadas = [];
  for (const { nome, quantidade_sorteio } of categoriasGlobal) {
    const fatia = embaralhar(questoesDaCategoria(nome));
    selecionadas.push(...fatia.slice(0, quantidade_sorteio));
  }
  return embaralhar(selecionadas);
}

function sortearPorTema(nomeCategoria) {
  return embaralhar(questoesDaCategoria(nomeCategoria));
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

function renderizarMenu() {
  const container = document.getElementById("menu-botoes");
  container.innerHTML = "";

  // Botao "Todas"
  const btnTodas = document.createElement("button");
  btnTodas.textContent = "Todas — Misturadas (15 questoes)";
  btnTodas.className = "btn-menu btn-todas";
  btnTodas.onclick = () => iniciarQuiz("Todas");
  container.appendChild(btnTodas);

  // Botao por categoria
  for (const cat of categoriasGlobal) {
    const btn = document.createElement("button");
    const total = questoesDaCategoria(cat.nome).length;
    btn.textContent = `${cat.nome} (${total} questoes)`;
    btn.className = "btn-menu";
    btn.onclick = () => iniciarQuiz(cat.nome);
    container.appendChild(btn);
  }

  document.getElementById("progresso").textContent = "";
  document.getElementById("barra").style.width = "0%";
}

// ─── Inicio do quiz ───────────────────────────────────────────────────────────

function iniciarQuiz(tema) {
  temaSelecionado = tema;
  atual = 0;
  pontos = 0;

  if (tema === "Todas") {
    perguntasSelecionadas = sortearMisto();
  } else {
    perguntasSelecionadas = sortearPorTema(tema);
  }

  totalRodada = perguntasSelecionadas.length;

  document.getElementById("tela-menu").classList.add("hidden");
  document.getElementById("tela-quiz").classList.remove("hidden");
  carregarPergunta();
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

function carregarPergunta() {
  respondida = false;

  const q = perguntasSelecionadas[atual];
  const divExp = document.getElementById("explicacao");
  divExp.classList.add("hidden");
  divExp.innerHTML = "";

  document.getElementById("progresso").textContent =
    `Questao ${atual + 1} de ${totalRodada} — ${temaSelecionado}`;
  document.getElementById("barra").style.width =
    `${(atual / totalRodada) * 100}%`;

  const elPergunta = document.getElementById("pergunta");
  if (q.html) elPergunta.innerHTML = q.pergunta;
  else elPergunta.textContent = q.pergunta;

  const ul = document.getElementById("alternativas");
  ul.innerHTML = "";
  q.alternativas.forEach((alt, i) => {
    const li = document.createElement("li");
    li.textContent = `${String.fromCharCode(65 + i)}. ${alt}`;
    li.onclick = () => validarResposta(i, li);
    ul.appendChild(li);
  });

  const btn = document.getElementById("btn-proximo");
  btn.disabled = true;
  btn.textContent = atual === totalRodada - 1 ? "Ver Resultado" : "Proxima Pergunta";
}

function validarResposta(indice, el) {
  if (respondida) return;
  respondida = true;

  const itens = document.querySelectorAll("#alternativas li");
  itens.forEach(li => li.classList.add("bloqueada"));

  const q = perguntasSelecionadas[atual];

  if (indice === q.correta) {
    el.classList.add("correta");
    pontos++;
  } else {
    el.classList.add("errada");
    itens[q.correta].classList.add("correta");
    if (q.explicacao) {
      const divExp = document.getElementById("explicacao");
      divExp.innerHTML = `<strong>Por que essa e a resposta correta?</strong>${q.explicacao}`;
      divExp.classList.remove("hidden");
    }
  }

  document.getElementById("btn-proximo").disabled = false;
}

function proximaPergunta() {
  atual++;
  if (atual < totalRodada) carregarPergunta();
  else mostrarResultado();
}

// ─── Resultado ────────────────────────────────────────────────────────────────

function mostrarResultado() {
  document.getElementById("tela-quiz").classList.add("hidden");
  document.getElementById("tela-resultado").classList.remove("hidden");
  document.getElementById("barra").style.width = "100%";
  document.getElementById("progresso").textContent = "Quiz concluido!";
  document.getElementById("tema-escolhido").textContent = `Tema: ${temaSelecionado}`;

  const erros = totalRodada - pontos;
  const pct = Math.round((pontos / totalRodada) * 100);

  document.getElementById("num-acertos").textContent = pontos;
  document.getElementById("num-erros").textContent = erros;
  document.getElementById("num-pct").textContent = pct + "%";

  const msgs = [
    [90, "Excelente! Dominio completo do conteudo!"],
    [70, "Bom! Voce esta bem preparado."],
    [50, "Regular. Revise alguns topicos."],
    [0,  "Precisa estudar mais. Nao desista!"],
  ];
  document.getElementById("mensagem-desempenho").textContent =
    msgs.find(([min]) => pct >= min)[1];
}

function repetirTema() {
  document.getElementById("tela-resultado").classList.add("hidden");
  document.getElementById("tela-quiz").classList.remove("hidden");
  iniciarQuiz(temaSelecionado);
}

// Confirma volta ao menu durante o quiz
function confirmarVolta() {
  if (!confirm("Deseja voltar ao menu? O progresso desta rodada sera perdido.")) return;
  voltarMenu();
}

function voltarMenu() {
  document.getElementById("tela-resultado").classList.add("hidden");
  document.getElementById("tela-menu").classList.remove("hidden");
  renderizarMenu();
}

// ─── Init ─────────────────────────────────────────────────────────────────────

fetch("src/data/banco_questoes.json")
  .then(r => r.json())
  .then(({ questoes, metadata: { categorias } }) => {
    questoesGlobal = questoes;
    categoriasGlobal = categorias;
    renderizarMenu();
  });
