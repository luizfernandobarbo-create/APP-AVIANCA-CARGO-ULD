# ULD Check 1.2.0 — versão de produção

App da operação para montar ULDs (WB) e carretas (NB) em voos PAX e CAO. Ele confere o peso por foto do ticket ou do visor da balança, ou por double-check nas carretas, e gera os documentos:

- **PAX:** a ficha de controle de carregamento (Excel, no modelo oficial).
- **CAO:** a HOJA DE PALETIZADO CAO, com as abas HOJA DE PALETIZADO e LCS preenchidas.
- **Todos os voos:** as TAGs (PDF).

No final, envia tudo pelo WhatsApp, por e-mail e para o SharePoint.

É um aplicativo web instalável (PWA). Abre no navegador do celular e é instalado na tela inicial como um app. Funciona sem internet depois da primeira abertura e volta exatamente de onde o operador parou se ele sair para outra coisa no celular.

## Novidades da 1.2.0

- **Aeroportos:** a origem e o destino do voo e o destino dos AWBs aceitam qualquer código IATA de aeroporto do mundo (cerca de 8 mil códigos, mais os códigos de cidade como SAO, BUE e NYC).
  - O app mostra a cidade do código digitado (ex.: GYN → Goiania, BR) para o operador conferir.
  - Um código que não existe na lista IATA ainda pede confirmação ("Usar XXX").
- **Voo CAO:**
  - Pede a matrícula do avião, num campo único de letras e números (ex.: N336QT). As últimas matrículas usadas no celular aparecem para tocar, e a matrícula pode ser corrigida na conferência, antes de gerar os documentos.
  - Cada ULD pede o seu destino (3 letras IATA), logo depois do número. O destino do voo e os destinos já usados aparecem para tocar.
  - O destino do ULD sai na TAG (DESTINATION), na aba HOJA DE PALETIZADO (DEST ULD) e no LCS (Destino final).
- **Comentários por ULD:** depois de montar os ULDs e antes dos pesos, uma tela opcional permite escrever um comentário em cada ULD ou carreta.
  - As sugestões vêm da lista de observações da HOJA (Macho doble, Hembra doble, Stack de pallets...) e dos comentários já usados no celular.
  - O comentário sai no REMARKS da TAG e, no CAO, em Comentarios/Remarks das abas HOJA DE PALETIZADO e LCS. Também vai no WhatsApp e no e-mail.
- **TAG com carga perigosa:** cada AWB com DGR (inclui ELI, ELM e ICE) ganha uma linha no REMARKS com o número do AWB, o código, as peças DGR e o peso DGR (peças × peso por volume). Ex.: "DGR AWB 729-94452024 · ELI · 2 PCS · 21 KG".
- **HOJA DE PALETIZADO CAO no modelo novo,** com as duas abas preenchidas:
  - **HOJA DE PALETIZADO:** uma linha por AWB (AWB, destino do AWB, peças e COD. IMP). As colunas do ULD (contorno, número, prioridade, peso, destino do ULD e comentário) ficam na primeira linha e mescladas nas linhas dos AWBs do mesmo ULD. O cabeçalho traz data, estação, voo, rota, matrícula e versão. O TOTAL fica como no modelo; a linha fixa KOB (linha 108) saiu, porque não é usada na operação.
  - **LCS:** uma linha por ULD, como a macro MoverAHojaLCS fazia: contorno, ULD, destino do ULD, peso, peças, códigos IMP e comentários. O cabeçalho traz voo, data, versão, matrícula e rota. Continuam os blocos Conferido por, início e fim do armado e comentários para despacho.
  - É um .xlsx comum, sem macro. Saíram a aba NOTOC, o vínculo com outra planilha (CodigosIMP) e as validações quebradas (#REF!). A proteção da aba LCS foi mantida.
  - Com mais AWBs ou ULDs do que as linhas do modelo, a planilha cresce, e o TOTAL, as fórmulas e a área de impressão acompanham.

## Novidades da 1.1.0

- **Início:** botão para voltar ao início em qualquer tela, com confirmação antes de apagar o voo em andamento.
- **Tipo de voo PAX ou CAO.**
  - No CAO, a sigla do voo é livre (2 ou 3 caracteres, ex.: QT4099) e o avião é sempre Wide Body.
  - No PAX, continua AV + número, com Wide Body ou Narrow Body.
- **ULDs aceitos:** só os tipos da lista mestre (44 códigos IATA). O peso máximo é conferido nos tipos com limite definido: família LD3 1.588 kg, PLA/PLB 3.175 kg, PMC/PAG/PAJ 6.804 kg, PGA 11.340 kg.
- **Contorno no CAO:** cada ULD pede o contorno, com a mesma lista da HOJA DE PALETIZADO: 16ft, 20ft, AKE, BULK, CL, CT, FAK, LD, P9, PP, PRL, PRR, RR, SBS, SS, TT, UU e VV.
- **Montagem primeiro, pesos depois:**
  - O operador monta todos os ULDs (ou carretas) com os AWBs.
  - Pode voltar a qualquer um para incluir, excluir ou corrigir AWBs, corrigir número, prioridade e contorno, ou excluir o ULD.
  - Só então informa o peso de cada um.
  - Depois vêm as fotos (Wide Body) ou o double-check (Narrow Body), a conferência e os documentos.
- **Peso:** nos ULDs vale o peso da balança, sem tara. Nas carretas a tara continua opcional, porque a carreta não voa.
- **Narrow Body:** sem foto do peso. O operador faz o double-check, digitando de novo o peso de cada carreta. Wide Body continua com a foto do ticket ou do visor, que pode ser tirada na hora da pesagem ou no final.
- **Conferência:**
  - Pede o e-mail de quem paletizou.
  - Tem "Conferido por", que sai na TAG; se ficar em branco, a TAG sai com a linha para assinar.
  - Tem comentários para despacho.
  - O app registra a data e a hora do início (primeiro ULD) e do fim (quando os documentos são gerados) e as manda no WhatsApp, no e-mail e na HOJA.
- **TAGs:** a TAG de ULD ou carreta com carga perigosa (DGR, ELI, ELM, ICE) sai com a borda vermelha listrada, no padrão da TAG DGR. O REMARKS traz "PALETIZADO POR" e "CONFERIDO POR".
- **HOJA DE PALETIZADO (CAO):** sai preenchida, sem macro. Melhorias em relação à planilha original:
  - Totais com fórmula e lista de contornos na coluna Contorno.
  - Logo como imagem comum, que aparece em qualquer Excel.
  - Novos campos: Conferido por, início e fim do armado e comentários para despacho.
  - Impressão em uma folha A4.
  - Saiu a aba NOTOC, que era preenchida só pela macro.
- **Aeroportos fora da lista:** um código fora da lista do app pode ser confirmado uma vez em cada celular (botão "Usar XXX").

## O que tem nesta pasta

| Arquivo / pasta | Para que serve |
|---|---|
| `index.html` | O app inteiro (inclui os modelos da ficha e da HOJA e a lista de aeroportos IATA) |
| `config.js` | **Único arquivo que a TI edita** (SharePoint e e-mail) |
| `sw.js` | Service worker: guarda o app no celular para abrir sem internet |
| `manifest.webmanifest`, `icons/` | Nome e ícone do app instalado |
| `ocr/` | Leitura do texto dos tickets (Tesseract, roda no próprio celular) |
| `lib/msal-browser.min.js` | Login Microsoft para salvar no SharePoint e enviar o e-mail |
| `fonts/` | Fontes do app (sem depender da internet) |
| `web.config` | Ajustes para publicar em IIS |
| `staticwebapp.config.json` | Ajustes para publicar no Azure Static Web Apps |
| `lib/LICENCAS.txt` | Licenças das bibliotecas e da lista de aeroportos IATA (airportsdata, MIT) |

## 1. Publicar (TI)

O app é só um conjunto de arquivos estáticos. Ele precisa de um endereço **HTTPS**: câmera, instalação no celular, compartilhamento e login Microsoft exigem HTTPS.

Opções, da mais simples para a TI de uma empresa Microsoft:

- **Azure Static Web Apps** (recomendado, há plano gratuito). Crie o recurso no portal do Azure ligado ao repositório do GitHub, ou com origem de implantação "Outro" e o comando:
  `npx @azure/static-web-apps-cli deploy ./uld-check --env production --deployment-token <TOKEN>`
  O arquivo `staticwebapp.config.json` já vai junto.
- **GitHub Pages**, a partir do repositório.
- **Servidor IIS da intranet** com certificado HTTPS: copie a pasta para o site. O `web.config` já registra os tipos de arquivo `.webmanifest`, `.woff2` e `.gz`.
- Qualquer outro servidor de arquivos estáticos com HTTPS. Os arquivos `.gz` devem ser servidos como arquivo comum, sem `Content-Encoding: gzip`.

Não é preciso banco de dados nem servidor de aplicação.

## 2. Ligar o SharePoint e o e-mail (TI, opcional)

Sem esta etapa o app funciona igual:

- Os arquivos vão pelo WhatsApp e podem ser baixados no celular.
- O botão "Enviar e-mail" abre o app de e-mail do celular com a ficha, as TAGs e as fotos anexadas. O endereço de quem paletizou fica copiado para colar no campo Para.

Com esta etapa:

- O botão "Salvar no SharePoint" grava a ficha, as TAGs e as fotos numa pasta por base, ano, mês e voo, por exemplo `Fichas de Carregamento/EZE/2026/10/AV0088_30OCT26`.
- O e-mail sai sozinho pela conta Microsoft 365 do operador, com os anexos, para o e-mail de quem paletizou e para as cópias definidas pela TI.

1. **Registrar o app no Microsoft Entra ID**: Entra ID › Registros de aplicativo › Novo registro.
   - Nome: `ULD Check`; contas somente deste diretório.
   - URI de redirecionamento: plataforma **Aplicativo de página única (SPA)**, com o endereço publicado do app, por exemplo `https://uldcheck.suaempresa.com/`. Use a barra final, igual ao endereço que os celulares abrem.
2. **Permissões de API** (Microsoft Graph › Permissões delegadas), depois **Conceder consentimento do administrador**:
   - `Sites.ReadWrite.All`, para o SharePoint. Se a política da empresa pedir acesso só a um site, use `Sites.Selected` e conceda ao app acesso de escrita no site da operação; depois troque `scopes` no `config.js` para `['Sites.Selected']`.
   - `Mail.Send`, para o e-mail. O e-mail sai da caixa de quem está logado e fica nos Itens Enviados.
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
   },
   email: {
     enabled: true,                     // e-mail pelo Microsoft 365 (precisa de tenantId e clientId acima)
     cc: ['controle.carga@suaempresa.com']
   }
   ```
4. **Permissões dos operadores:** eles precisam ter edição na biblioteca escolhida e caixa de e-mail no Microsoft 365. Na primeira vez que salvarem ou enviarem, o app abre o login da conta Microsoft da empresa e depois volta para a mesma tela.

Chamadas usadas (Microsoft Graph v1.0):

- `GET /sites/{host}:/{caminho}` e `GET /sites/{id}/drive(s)`.
- `GET /drives/{id}/root:/{pasta}`.
- `POST /drives/{id}/items/{pai}/children`, que cria a pasta que faltar.
- `PUT /drives/{id}/items/{pasta}:/{arquivo}:/content`, que envia cada arquivo.
- `POST /me/sendMail`, que envia o e-mail. Cada pedido fica abaixo de 4 MB; se as fotos passarem disso, o app divide em mais de um e-mail.

## 3. Instalar nos celulares (operação)

Abra o endereço do app **com internet** na primeira vez. O app baixa cerca de 12 MB, incluindo a leitura de tickets, e depois funciona sem internet.

- **Android (Chrome)**: menu ⋮ › **Instalar app** (ou "Adicionar à tela inicial").
- **iPhone (Safari)**: botão Compartilhar › **Adicionar à Tela de Início**.

Antes de distribuir para todos, teste em um Android e em um iPhone da operação:

- Foto do ticket e foto do visor.
- Double-check de carreta.
- Envio pelo WhatsApp e pelo e-mail.
- Se configurados, o login e o salvamento no SharePoint.

## 4. Como o app confere o peso

- **Etapa Pesos:** depois de montar todos os ULDs, o operador pesa um por um. Nos ULDs, o peso é o da balança (sem tara), conferido contra o peso máximo do tipo. Nas carretas, a tara é opcional e o app mostra o peso líquido.
- **Wide Body (PAX e CAO):** na foto do peso de cada ULD, o operador escolhe **Ticket** ou **Visor da balança**. A foto pode ser tirada na hora da pesagem, pelo botão **Salvar + foto** com o ULD ainda na balança, ou deixada para a etapa Fotos.
  - **Ticket**: o app lê o número do ULD, o PESO BRUTO, o número do ticket, a data e a hora. Trava ticket de outro ULD, ticket repetido e peso diferente; ticket com mais de 24 h pede confirmação. Testado nos 7 tickets reais do AV0088, a partir do scan (7 de 7 lidos). Com fotos de celular, ticket amassado ou com sombra pode cair no fluxo de digitar.
  - **Visor da balança**: o app encontra o visor vermelho de 7 segmentos, endireita a imagem e lê os dígitos. Testado nas 4 fotos da balança Líder LD1050 (4 de 4) e em 124 variações delas (girada, escura, desfocada, de longe): 126 leituras certas, 2 sem leitura, nenhuma leitura errada.
  - Se a foto não der para ler, o operador digita o valor que aparece nela. Ele precisa ser igual ao peso informado, e o registro mostra que foi conferido pelo operador.
- **Narrow Body:** não tem foto. Na etapa Double-check, o operador lê de novo o peso de cada carreta na balança e digita. O valor precisa ser igual ao peso informado na montagem; se não bater, o app avisa e a carreta pode ser corrigida.

As fotos vão anexadas no WhatsApp e no e-mail e são salvas no SharePoint junto com a ficha (ou HOJA) e as TAGs.

## 5. Dados e privacidade

- Tudo fica no próprio celular (armazenamento do navegador) até o operador enviar. Não há servidor intermediário: a leitura das fotos roda no celular.
- O voo em andamento é salvo a cada toque. Se o operador sair para outro app, receber uma ligação ou o sistema fechar o navegador, o app reabre na mesma tela, com os campos preenchidos; se a câmera estava aberta, ela volta aberta.
- "Novo voo" e "Voltar ao início" apagam do celular os dados e as fotos do voo anterior, depois de confirmar.
- O nome e o e-mail de quem paletiza ficam guardados no celular para os próximos voos, assim como as últimas matrículas e os comentários usados (só como sugestão).
- O login Microsoft é guardado pelo próprio MSAL no navegador; "Sair", nas configurações (ícone do globo), encerra a sessão.

## 6. Atualizar para uma nova versão

Substitua os arquivos da pasta publicada **mantendo o seu `config.js`**. A 1.2.0 não muda o `config.js`. Na 1.1.0, o `config.js` ganhou o bloco `email`; um `config.js` antigo continua funcionando, e o e-mail sai pelo app de e-mail do celular. Os celulares recebem a nova versão na próxima vez que abrirem o app com internet; a versão aparece nas configurações (ícone do globo).

## 7. Limites conhecidos

- A leitura de visor foi feita para visores de LED vermelho de 7 segmentos, como o da LD1050. Visores LCD ou de outras cores caem no fluxo de digitar o valor.
- A leitura de tickets foi ajustada para o ticket da Aeropuertos Argentina 2000 (TICKET NRO, Elemento Numero, PESO BRUTO). Outros modelos caem no fluxo de digitar o peso.
- A leitura automática de tickets precisa de internet só na primeira vez, para baixar os arquivos de leitura; depois funciona sem rede.
- Na HOJA DE PALETIZADO CAO, ETD, Cut off e Origen (estación previa) ficam em branco para o load control preencher; o app não pede esses dados.
- No PAX, o comentário do ULD sai na TAG, no WhatsApp e no e-mail; a ficha de controle de carregamento não tem coluna de comentários.
- Na ficha de controle (PAX), as colunas Peso Tara e Peso Neto ficam em branco nos ULDs, porque o app usa só o peso da balança. Nas carretas com tara, elas são preenchidas.
- Se as peças de um ULD já pesado mudarem, o app apaga o peso e a foto desse ULD e pede para pesar de novo.
- Sem a etapa 2, o e-mail depende do app de e-mail do celular, e o destinatário é colado pelo operador.
