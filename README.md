# Catequese App ⛪

Aplicação web desenvolvida em **Angular 18** para a gestão e acompanhamento da Paróquia Nossa Senhora de Fátima.

---

## 🛠️ Tecnologias Utilizadas

* **Framework:** [Angular 18](https://angular.dev/)
* **Linguagem:** TypeScript 5.4
* **Gerenciador de Pacotes:** npm
* **Hospedagem / Deploy:** Cloudflare Pages

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos

* Node.js v20+ ou v22+
* Angular CLI instalado globalmente (`npm i -g @angular/cli@18`)

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone https://github.com/douglascarlos-dev/paroquianossasenhoradefatima.git
cd paroquianossasenhoradefatima

```


2. **Instale as dependências:**
```bash
npm install

```


3. **Inicie o servidor de desenvolvimento:**
```bash
ng serve

```


4. **Acesse no navegador:**
Navegue até `http://localhost:4200/`. A aplicação atualizará automaticamente a cada alteração salva.

---

## 📦 Build e Deploy

### Compilação Local

Para gerar a versão otimizada de produção:

```bash
npm run build

```

Os arquivos estáticos serão gerados no diretório `dist/catequese-app/browser`.

### Configuração no Cloudflare Pages

Ao configurar o projeto no **Cloudflare Pages**:

* **Framework preset:** Angular
* **Build command:** `npm run build`
* **Build output directory:** `dist/catequese-app/browser`