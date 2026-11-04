/* ULD Check — configuração da operação.
   Este é o único arquivo que a TI precisa editar. Sem SharePoint e sem e-mail configurados, o app funciona igual:
   ficha, TAGs e fotos são baixadas no celular ou enviadas pelo WhatsApp e pelo app de e-mail do celular. */
window.ULDCHECK_CONFIG = {
  sharepoint: {
    tenantId: '',      // ID do diretório (locatário) no Microsoft Entra ID
    clientId: '',      // ID do aplicativo registrado no Entra ID (plataforma "Aplicativo de página única")
    hostname: '',      // ex.: 'suaempresa.sharepoint.com'
    sitePath: '',      // ex.: '/sites/OperacoesCargo'
    library: '',       // nome da biblioteca de documentos; vazio = biblioteca padrão do site
    baseFolder: 'Fichas de Carregamento',   // o app cria BASE/ORIGEM/ANO/MÊS/VOO, ex.: .../EZE/2026/10/AV0088_30OCT26
    siteLabel: 'Operações Cargo',           // nome do site como aparece no app e no WhatsApp
    scopes: ['Sites.ReadWrite.All']         // permissão delegada do Microsoft Graph
  },
  email: {
    enabled: false,   // true = o app manda o e-mail sozinho pela conta Microsoft 365 de quem está logado
                      // (usa o mesmo registro do Entra ID acima, com a permissão delegada Mail.Send).
                      // false = o botão "Enviar e-mail" abre o app de e-mail do celular com os arquivos anexados.
    cc: []            // ex.: ['controle.carga@suaempresa.com'], cópia de todos os e-mails
  },
  ocrBase: './ocr/'    // pasta dos arquivos de leitura de tickets (não mudar)
};
