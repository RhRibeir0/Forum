const formulario = document.getElementById("form-aluno");
const lista = document.getElementById("lista-alunos");
const mensagem = document.getElementById("mensagem");
const campoId = document.getElementById("aluno-id");
const botaoSalvar = document.getElementById("botao-salvar");
const botaoCancelar = document.getElementById("botao-cancelar");
const tituloFormulario = document.getElementById("titulo-formulario");

const campos = {
  nome: document.getElementById("nome"),
  matricula: document.getElementById("matricula"),
  curso: document.getElementById("curso"),
  email: document.getElementById("email"),
  telefone: document.getElementById("telefone")
};

function mostrarMensagem(texto, tipo = "sucesso") {
  mensagem.textContent = texto;
  mensagem.className = tipo;
}

function limparFormulario() {
  formulario.reset();
  campoId.value = "";
  tituloFormulario.textContent = "Adicionar aluno";
  botaoSalvar.textContent = "Cadastrar aluno";
  botaoCancelar.classList.add("escondido");
}

async function carregarAlunos() {
  try {
    const resposta = await fetch("/api/alunos");
    if (!resposta.ok) throw new Error("Falha ao carregar alunos.");
    const alunos = await resposta.json();

    document.getElementById("contador").textContent =
      `${alunos.length} ${alunos.length === 1 ? "aluno" : "alunos"}`;

    lista.replaceChildren();

    if (alunos.length === 0) {
      const linha = document.createElement("tr");
      const celula = document.createElement("td");
      celula.colSpan = 6;
      celula.className = "vazio";
      celula.textContent = "Nenhum aluno cadastrado.";
      linha.appendChild(celula);
      lista.appendChild(linha);
      return;
    }

    alunos.forEach(aluno => {
      const linha = document.createElement("tr");
      [aluno.nome, aluno.matricula, aluno.curso, aluno.email, aluno.telefone]
        .forEach(valor => {
          const celula = document.createElement("td");
          celula.textContent = valor;
          linha.appendChild(celula);
        });

      const celulaAcoes = document.createElement("td");
      const grupo = document.createElement("div");
      grupo.className = "acoes";

      const editar = document.createElement("button");
      editar.className = "acao editar";
      editar.textContent = "Editar";
      editar.addEventListener("click", () => prepararEdicao(aluno));

      const excluir = document.createElement("button");
      excluir.className = "acao excluir";
      excluir.textContent = "Excluir";
      excluir.addEventListener("click", () => excluirAluno(aluno.id));

      grupo.append(editar, excluir);
      celulaAcoes.appendChild(grupo);
      linha.appendChild(celulaAcoes);
      lista.appendChild(linha);
    });
  } catch (erro) {
    mostrarMensagem(erro.message, "erro");
  }
}

formulario.addEventListener("submit", async evento => {
  evento.preventDefault();

  const dados = Object.fromEntries(
    Object.entries(campos).map(([chave, campo]) => [chave, campo.value.trim()])
  );

  const id = campoId.value;
  const metodo = id ? "PUT" : "POST";
  const url = id ? `/api/alunos/${id}` : "/api/alunos";

  try {
    const resposta = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
    const resultado = await resposta.json();

    if (!resposta.ok) throw new Error(resultado.erro || "Não foi possível salvar.");

    mostrarMensagem(id ? "Cadastro atualizado com sucesso!" : "Aluno cadastrado com sucesso!");
    limparFormulario();
    await carregarAlunos();
  } catch (erro) {
    mostrarMensagem(erro.message, "erro");
  }
});

function prepararEdicao(aluno) {
  campoId.value = aluno.id;
  Object.entries(campos).forEach(([chave, campo]) => {
    campo.value = aluno[chave];
  });
  tituloFormulario.textContent = "Editar aluno";
  botaoSalvar.textContent = "Salvar alterações";
  botaoCancelar.classList.remove("escondido");
  mostrarMensagem("Altere os dados desejados e salve.");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function excluirAluno(id) {
  if (!confirm("Tem certeza de que deseja excluir este aluno?")) return;

  try {
    const resposta = await fetch(`/api/alunos/${id}`, { method: "DELETE" });
    const resultado = await resposta.json();
    if (!resposta.ok) throw new Error(resultado.erro || "Não foi possível excluir.");

    mostrarMensagem(resultado.mensagem);
    await carregarAlunos();
  } catch (erro) {
    mostrarMensagem(erro.message, "erro");
  }
}

botaoCancelar.addEventListener("click", () => {
  limparFormulario();
  mostrarMensagem("Edição cancelada.");
});

carregarAlunos();
