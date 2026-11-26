# Sistema Acadêmico — CRUD de Alunos

Projeto acadêmico de Programação Back-End desenvolvido com JavaScript, Node.js, Express e SQLite.

## Funcionalidades

- **Create:** cadastrar aluno.
- **Read:** listar alunos cadastrados.
- **Update:** editar os dados de um aluno.
- **Delete:** excluir um aluno.

## Campos do cadastro

1. Nome completo
2. Matrícula
3. Curso
4. E-mail
5. Telefone

## Requisitos

- Node.js instalado (versão LTS recomendada)
- npm (instalado junto com o Node.js)

## Como executar

1. Extraia os arquivos do projeto.
2. Abra a pasta do projeto no Visual Studio Code ou em outro editor.
3. Abra o terminal dentro da pasta.
4. Instale as dependências:

   ```bash
   npm install
   ```

5. Inicie o servidor:

   ```bash
   npm start
   ```

6. Acesse no navegador:

   http://localhost:3000

O banco de dados `academico.db` e a tabela `alunos` são criados automaticamente na primeira execução.

## Rotas da API

| Método | Rota | Função |
|---|---|---|
| GET | `/api/alunos` | Lista os alunos |
| POST | `/api/alunos` | Cadastra um aluno |
| PUT | `/api/alunos/:id` | Atualiza um aluno |
| DELETE | `/api/alunos/:id` | Exclui um aluno |

> Este projeto é demonstrativo e utiliza dados fictícios. Não cadastre informações pessoais reais.
