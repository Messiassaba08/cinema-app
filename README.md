# CineFlix - CinemaApp

Projeto desenvolvido para o trabalho prático da disciplina Teste de Software

## Grupo

Messias da Silva Sabadini - 2021032188

Wallace Eduardo Pereira - 2021032013

## Projeto
O projeto tem como objetivo simular um site de venda de ingressos de cinema. O usuário pode:
- Criar conta
- Fazer login
- Ver os filmes disponíveis
- Ele ganha dois ingressos por filme, podendo escolher os assentos. 

Além disso, o projeto exercita os princípios vistos na disciplina Teste de Software, tendo 31 testes de unidade, e usando o CI/CD com o GitHub actions, fazendo com que os testes e a cobertura sejam executados automaticamente a cada commit.

## Como Executar

Para executar o projeto, é necessário ter instalado o Node.js. Caso não tenha, em qualquer sistema operacional instale por:
- Vá até o website [Node.js download](https://nodejs.org/en/download), faça download do Node.js e instale. 

Após instalar, no diretório do projeto, execute-o com o comando:
#### `npm start`
Abra [http://localhost:3000](http://localhost:3000) para visualizar no navegador.

Para verificar se os testes unitários estão passando, execute o comando

#### `npm run test`

E poderá visualizar a suíte de testes, quantos testes passaram, quantos falharam e destes, quais falharam.

Para ter uma visualização mais detalhada dos testes, incluindo a cobertura, execute o comando

#### `npm test:cov`

Isso dará uma visualização melhor dos testes unitários, além de criar uma pasta chamada `coverage` com os resultados. Nessa pasta cria-se um arquivo html `index.html`, que, aberto no navegador, mostra uma interface gráfica com os resultados.

## Tecnologias
Na criação do projeto foram foram utilizadas as tecnologias **Typescript**, para o front-end, **React**, para o back-end, **npm**, para gerenciamento dos pacotes, **Jest**, para verificação da cobertura e **GitHub** para versionamento de código e CI/CD.

**Typescript** é uma linguagem fortemente tipada, sendo uma "sublinguagem" do JavaScript, com a diferença que o JavaScript não é tipado. 

**React** é uma biblioteca JavaScript utilizada para construção de UI's, sendo utilizada principalmente em aplicações web interativas e reativas. Sua principal vantagem é criar componentes reutilizáveis que atualizam automaticamente quando dados mudam.

**npm** é o gerenciador de pacotes do Node.js. Ele serve para instalar bibliotecas JavaScript, gerenciar dependências do projeto, executar scripts, entre outros.

**Jest** é o framework de testes, que serve para garantir que o código esteja funcionando corretamente, testando funções, APIs, etc. Além disso ele oferece uma visualização detalhada dos resultados das execuções dos testes.

**GitHub** é o repositório onde o código está sendo armazenado, servindo, além de armazenar, para criação de um projeto compartilhado, onde várias pessoas conseguem colaborar, servindo para executar CI/CD por meio do `actions` e diversas outras funcionalidades.
