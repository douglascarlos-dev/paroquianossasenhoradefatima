# Inscrição Catequese - Paróquia Nossa Senhora de Fátima

![Static Badge](https://img.shields.io/badge/Angular-v18-red) ![Static Badge](https://img.shields.io/badge/PHP-%3E%3D8.1-blue) ![Static Badge](https://img.shields.io/badge/Bootstrap-v5.3-purple) ![Static Badge](https://img.shields.io/badge/Cloudflare%20Pages-Deploy-orange)

### Aplicação para gestão e envio de inscrições para a Catequese de Iniciação à Vida Cristã.

Sistema Web composto por um formulário reativo em Angular integrado a um backend PHP para disparo de e-mails formatados com anexos via API do Mailtrap[cite: 7].

---

## Recursos usados no desenvolvimento:

- [Angular](https://angular.dev/);
- [TypeScript](https://www.typescriptlang.org/);
- [Bootstrap](https://getbootstrap.com/);
- [PHP](https://www.php.net/);
- [cURL](https://www.php.net/manual/pt_BR/book.curl.php);
- [Mailtrap API](https://mailtrap.io/);
- [Git](https://git-scm.com);
- [Visual Studio Code](https://code.visualstudio.com/);
- [Cloudflare Pages](https://pages.cloudflare.com/);

---

## Pré-requisitos:

Antes de rodar o projeto localmente ou em servidor, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (v18 ou superior);
- [Angular CLI](https://angular.dev/cli);
- Servidor Web com **PHP 8.1+**;
- Extensão **cURL** ativada no PHP;
- Diretivas de upload configuradas no `php.ini` (`upload_max_filesize = 16M` e `post_max_size = 20M`);

---

## Obtendo uma cópia e executando localmente:

```shell
# Clone o repositório
$ git clone [https://github.com/douglascarlos-dev/paroquianossasenhoradefatima.git](https://github.com/douglascarlos-dev/paroquianossasenhoradefatima.git)[cite: 8]

# Acesse a pasta do projeto
$ cd paroquianossasenhoradefatima

# Instale as dependências
$ npm install

# Execute o servidor de desenvolvimento do Angular
$ ng serve