/* ULD Check — configuração da operação.
   Este é o único arquivo que a TI precisa editar. Sem SharePoint configurado, o app funciona igual:
   ficha, TAGs e fotos são baixadas no celular ou enviadas pelo WhatsApp. */
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
  ocrBase: './ocr/'    // pasta dos arquivos de leitura de tickets (não mudar)
};
