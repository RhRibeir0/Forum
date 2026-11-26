const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;
const db = new Database("academico.db");

// Cria a tabela automaticamente na primeira execução.
db.exec(`
  CREATE TABLE IF NOT EXISTS alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    matricula TEXT NOT NULL UNIQUE,
    curso TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// READ: lista todos os alunos.
app.get("/api/alunos", (req, res) => {
  const alunos = db.prepare(
    "SELECT * FROM alunos ORDER BY nome"
  ).all();

  res.json(alunos);
});

// CREATE: cadastra um aluno.
app.post("/api/alunos", (req, res) => {
  const { nome, matricula, curso, email, telefone } = req.body;

  if (![nome, matricula, curso, email, telefone].every(
    valor => typeof valor === "string" && valor.trim()
  )) {
    return res.status(400).json({
      erro: "Preencha todos os cinco campos."
    });
  }

  try {
    const resultado = db.prepare(`
      INSERT INTO alunos (nome, matricula, curso, email, telefone)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      nome.trim(),
      matricula.trim(),
      curso.trim(),
      email.trim(),
      telefone.trim()
    );

    const aluno = db.prepare(
      "SELECT * FROM alunos WHERE id = ?"
    ).get(resultado.lastInsertRowid);

    res.status(201).json(aluno);
  } catch (erro) {
    if (erro.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        erro: "Já existe um aluno com essa matrícula."
      });
    }
    res.status(500).json({ erro: "Não foi possível cadastrar o aluno." });
  }
});

// UPDATE: atualiza os dados de um aluno.
app.put("/api/alunos/:id", (req, res) => {
  const { nome, matricula, curso, email, telefone } = req.body;
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erro: "Identificador inválido." });
  }

  if (![nome, matricula, curso, email, telefone].every(
    valor => typeof valor === "string" && valor.trim()
  )) {
    return res.status(400).json({
      erro: "Preencha todos os cinco campos."
    });
  }

  const existente = db.prepare(
    "SELECT id FROM alunos WHERE id = ?"
  ).get(id);

  if (!existente) {
    return res.status(404).json({ erro: "Aluno não encontrado." });
  }

  try {
    db.prepare(`
      UPDATE alunos
      SET nome = ?, matricula = ?, curso = ?, email = ?, telefone = ?
      WHERE id = ?
    `).run(
      nome.trim(),
      matricula.trim(),
      curso.trim(),
      email.trim(),
      telefone.trim(),
      id
    );

    const alunoAtualizado = db.prepare(
      "SELECT * FROM alunos WHERE id = ?"
    ).get(id);

    res.json(alunoAtualizado);
  } catch (erro) {
    if (erro.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        erro: "Já existe outro aluno com essa matrícula."
      });
    }
    res.status(500).json({ erro: "Não foi possível atualizar o aluno." });
  }
});

// DELETE: exclui um aluno.
app.delete("/api/alunos/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erro: "Identificador inválido." });
  }

  const resultado = db.prepare(
    "DELETE FROM alunos WHERE id = ?"
  ).run(id);

  if (resultado.changes === 0) {
    return res.status(404).json({ erro: "Aluno não encontrado." });
  }

  res.json({ mensagem: "Aluno excluído com sucesso." });
});

app.listen(PORT, () => {
  console.log(`Sistema disponível em http://localhost:${PORT}`);
});
