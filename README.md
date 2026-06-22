# Quiz EDA2 — Arvores Binarias

Quiz de multipla escolha para estudo de arvores binarias da disciplina EDA2 (Estruturas de Dados 2) do IFSP Guarulhos.

## Topicos abordados

- BST (Binary Search Tree)
- AVL
- Arvore Rubro-Negra
- Arvore Binaria Geral

## Como funciona

Sao sorteadas 15 questoes por rodada, distribuidas proporcionalmente entre os topicos.
Ao errar uma questao, a explicacao da resposta correta e exibida.
Ao final, e exibido o aproveitamento com acertos, erros e percentual.

## Estrutura do projeto

```
quizz-prova/
├── index.html
├── README.md
└── src/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── script.js
    └── data/
        └── banco_questoes.json
```

## Como rodar localmente

O projeto usa `fetch` para carregar o banco de questoes, entao precisa rodar em um servidor HTTP.

Com VS Code, use a extensao Live Server e abra o `index.html`.

Com Python:
```
python -m http.server 8080
```
Acesse `http://localhost:8080` no navegador.

## Acesso online

Disponivel via GitHub Pages:
https://roobertoalves.github.io/quizz-prova
