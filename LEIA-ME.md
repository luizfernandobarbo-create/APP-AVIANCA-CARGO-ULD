# ULD Check 1.0.0 — versão de produção

App da operação para montar ULDs (WB) e carretas (NB), conferir o peso por foto (ticket ou visor da balança), gerar a ficha de controle de carregamento (Excel, no modelo oficial), as TAGs (PDF) e enviar tudo pelo WhatsApp e para o SharePoint.

É um aplicativo web instalável (PWA): abre no navegador do celular, é instalado na tela inicial como um app, funciona sem internet depois da primeira abertura e volta exatamente de onde o operador parou se ele sair para outra coisa no celular.

## O que tem nesta pasta

| Arquivo / pasta | Para que serve |
|---|---|
| `index.html` | O app inteiro |
| `config.js` | **Único arquivo que a TI edita** (SharePoint) |
| `sw.js` | Service worker: guarda o app no celular para abrir sem internet |
| `manifest.webmanifest`, `icons/` | Nome e ícone do app instalado |
| `ocr/` | Leitura do texto dos tickets (Tesseract, roda no próprio celular) |
| `lib/msal-browser.min.js` | Login Microsoft para salvar no SharePoint |
| `fonts/` | Fontes do app (sem depender da internet) |
| `web.config` | Ajustes para publicar em IIS |
| `staticwebapp.config.json` | Ajustes para publicar no Azure Static Web Apps |
| `lib/LICENCAS.txt` | Licenças das bibliotecas usadas |

## 1. Publicar (TI)

O app é só um conjunto de arquivos estáticos. Ele precisa de um endereço **HTTPS** (câmera, instalação no celular, compartilhamento e login Microsoft exigem HTTPS).

Opções, da mais simples para a TI de uma empresa Microsoft:

- **Azure Static Web Apps** (recomendado, há plano gratuito). Crie o recurso no portal do Azure com origem de implantação "Outro", copie o token de implantação e publique a pasta:
  `npx @azure/static-web-apps-cli deploy ./uld-check --env production --deployment-token <TOKEN>`
  O arquivo `staticwebapp.config.json` já vai junto.
- **Servidor IIS da intranet** com certificado HTTPS: copie a pasta para o site. O `web.config` já registra os tipos de arquivo `.webmanifest`, `.woff2` e `.gz`.
- Qualquer outro servidor de arquivos estáticos com HTTPS. Os arquivos `.gz` devem ser servidos como arquivo comum (sem `Content-Encoding: gzip`).

Não é preciso banco de dados nem servidor de aplicação.

## 2. Ligar o SharePoint (TI, opcional)

Sem esta etapa o app funciona igual: os arquivos vão pelo WhatsApp e podem ser baixados no celular. Com ela, o botão "Salvar no SharePoint" grava a ficha, as TAGs e as fotos numa pasta por base, ano, mês e voo, por exemplo `Fichas de Carregamento/EZE/2026/10/AV0088_30OCT26`.

1. **Registrar o app no Microsoft Entra ID**: Entra ID › Registros de aplicativo › Novo registro.
   - Nome: `ULD Check`; contas somente deste diretório.
   - URI de redirecionamento: plataforma **Aplicativo de página única (SPA)**, com o endereço publicado do app, por exemplo `https://uldcheck.suaempresa.com/` (com a barra final, igual ao endereço que os celulares abrem).
2. **Permissões de API**: Microsoft Graph › Permissões delegadas › `Sites.ReadWrite.All` › **Conceder consentimento do administrador**.
   Se a política da empresa pedir acesso só a um site, use `Sites.Selected` e conceda ao app acesso de escrita no site da operação; depois troque `scopes` no `config.js` para `['Sites.Selected']`.
3. **Preencher o `config.js`**:

   ```js
   sharepoint: {
     tenantId: 'ID do diretório (locatário)',
     clientId: 'ID do aplicativo (cliente)',
     hostname: 'suaempresa.sharepoint.com',
     sitePath: '/sites/OperacoesCargo',
     library: '',                       // vazio = biblioteca padrão do site
     baseFolder: 'Fichas de Carregamento',
     siteLabel: 'Operações Cargo',
     scopes: ['Sites.ReadWrite.All']
   }
   ```
4. Os operadores precisam ter permissão de edição na biblioteca escolhida. Na primeira vez que salvarem, o app abre o login da conta Microsoft da empresa e depois volta para a mesma tela.

Chamadas usadas (Microsoft Graph v1.0): `GET /sites/{host}:/{caminho}`, `GET /sites/{id}/drive(s)`, `GET /drives/{id}/root:/{pasta}`, `POST /drives/{id}/items/{pai}/children` (cria a pasta que faltar) e `PUT /drives/{id}/items/{pasta}:/{arquivo}:/content` (envio de cada arquivo, todos bem abaixo do limite de 250 MB do envio simples).

## 3. Instalar nos celulares (operação)

Abra o endereço do app **com internet** na primeira vez (o app baixa cerca de 12 MB, incluindo a leitura de tickets, e depois funciona sem internet).

- **Android (Chrome)**: menu ⋮ › **Instalar app** (ou "Adicionar à tela inicial").
- **iPhone (Safari)**: botão Compartilhar › **Adicionar à Tela de Início**.

Antes de distribuir para todos, teste em um Android e em um iPhone da operação: foto do ticket, foto do visor, envio pelo WhatsApp e, se configurado, o login e o salvamento no SharePoint.

## 4. Como o app confere o peso

Na foto do peso de cada ULD ou carreta, o operador escolhe **Ticket** ou **Visor da balança**. O botão **Salvar + foto**, na tela do peso, abre a câmera com o ULD ainda na balança.

- **Ticket**: o app lê o número do ULD, o PESO BRUTO, o número do ticket, a data e a hora. Trava ticket de outro ULD, ticket repetido e peso diferente; ticket com mais de 24 h pede confirmação. Testado nos 7 tickets reais do AV0088, a partir do scan (7 de 7 lidos); com fotos de celular, ticket amassado ou com sombra pode cair no fluxo de digitar.
- **Visor da balança**: o app encontra o visor vermelho de 7 segmentos, endireita a imagem e lê os dígitos. Testado nas 4 fotos da balança Líder LD1050 (4 de 4) e em 124 variações delas (girada, escura, desfocada, de longe): 126 leituras certas, 2 sem leitura, nenhuma leitura errada.
- Se a foto não der para ler, o operador digita o valor que aparece nela. Ele precisa ser igual ao peso informado, e o registro mostra que foi conferido pelo operador.

As fotos vão anexadas no WhatsApp e salvas no SharePoint junto com a ficha e as TAGs.

## 5. Dados e privacidade

- Tudo fica no próprio celular (armazenamento do navegador) até o operador enviar. Não há servidor intermediário: a leitura das fotos roda no celular.
- O voo em andamento é salvo a cada toque. Se o operador sair para outro app, receber uma ligação ou o sistema fechar o navegador, o app reabre na mesma tela, com os campos preenchidos; se a câmera estava aberta, ela volta aberta.
- "Novo voo" apaga do celular os dados e as fotos do voo anterior.
- O login Microsoft é guardado pelo próprio MSAL no navegador; "Sair", nas configurações (ícone do globo), encerra a sessão.

## 6. Atualizar para uma nova versão

Substitua os arquivos da pasta publicada **mantendo o seu `config.js`**. Os celulares recebem a nova versão na próxima vez que abrirem o app com internet.

## 7. Limites conhecidos

- A leitura de visor foi feita para visores de LED vermelho de 7 segmentos (como o da LD1050). Visores LCD ou de outras cores caem no fluxo de digitar o valor.
- A leitura de tickets foi ajustada para o ticket da Aeropuertos Argentina 2000 (TICKET NRO, Elemento Numero, PESO BRUTO). Outros modelos caem no fluxo de digitar o peso.
- A leitura automática de tickets precisa de internet só na primeira vez (para baixar os arquivos de leitura); depois funciona sem rede.
