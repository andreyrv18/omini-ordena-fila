// Usar um objeto para centralizar as chaves do storage previne erros de digitação
// e facilita a manutenção.
const STORAGE_KEYS = {
    // Chaves para o Destaque de Inativos
    INATIVAR_ENABLED: 'inativarEnabled',
    INATIVAR_TIME: 'inativarTime',

    // Chaves para o Destaque de Foco (Dashboard)
    DASHBOARD_FOCUS_ENABLED: 'dashboardFocusEnabled',
    DASHBOARD_FOCUSED_CARD_ID: 'dashboardFocusedCardId',

    // Chaves para a personalização do Destaque de Foco
    DF_OUTLINE_STYLE: 'df_outlineStyle',
    DF_OUTLINE_WIDTH: 'df_outlineWidth',
    DF_OUTLINE_COLOR: 'df_outlineColor',
};