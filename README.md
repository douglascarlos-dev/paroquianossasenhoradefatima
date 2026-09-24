# Inscrição Catequese - Paróquia Nossa Senhora de Fátima

![Static Badge](https://img.shields.io/badge/Angular-v18-red) ![Static Badge](https://img.shields.io/badge/Bootstrap-v5.3-purple) ![Static Badge](https://img.shields.io/badge/Cloudflare%20Pages-Deploy-orange)

### Aplicação para gestão e envio de inscrições para a Catequese de Iniciação à Vida Cristã.

Sistema Web composto por um formulário reativo em Angular usando JavaScript/TypeScript para disparo de e-mails formatados com anexos via API do Mailtrap.

---

## Recursos usados no desenvolvimento:

- [Angular](https://angular.dev/);
- [TypeScript](https://www.typescriptlang.org/);
- [Bootstrap](https://getbootstrap.com/);
- [Mailtrap API](https://mailtrap.io/);
- [Git](https://git-scm.com);
- [Visual Studio Code](https://code.visualstudio.com/);
- [Cloudflare Pages](https://pages.cloudflare.com/);

---

## Pré-requisitos:

Antes de rodar o projeto localmente ou em servidor, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (v18 ou superior);
- [Angular CLI](https://angular.dev/cli);

---

## 🏗️ Arquitetura do Sistema (Full Stack Architecture)

```mermaid
graph TD
    A[<b>Users / Frontend</b><br/>Preenche o formulário web] --> B[<b>Angular App</b><br/>Validação de campos e limite de 9 MB]
    B --> C[<b>Cloudflare Pages / Worker</b><br/>Conversão Base64 e orquestração]
    C --> D[<b>Mailtrap API</b><br/>Disparo via Sending API]
    D --> E[<b>Destinatário</b><br/>Recebe ficha e anexos]

    style A fill:#f9f9f9,stroke:#333,stroke-width:1px
    style B fill:#e1f5fe,stroke:#0288d1,stroke-width:2px
    style C fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style D fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style E fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
```
---

## Obtendo uma cópia e executando localmente:

```shell
# Clone o repositório
$ git clone https://github.com/douglascarlos-dev/paroquianossasenhoradefatima.git

# Acesse a pasta do projeto
$ cd paroquianossasenhoradefatima

# Instale as dependências
$ npm install

# Execute o servidor de desenvolvimento do Angular
$ ng serve
```

## Configurar as Variáveis de Ambiente no Cloudflare

```shell
#Environment Variables
MAILTRAP_API_TOKEN
MAILTRAP_SENDER_EMAIL
MAILTRAP_RECIPIENT_EMAIL
```
