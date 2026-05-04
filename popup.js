document.addEventListener('DOMContentLoaded', () => {
    const toggleInativar = document.getElementById('toggleInativar');
    const inputTempo = document.getElementById('inputTempo');
    const toggleDashboardFocus = document.getElementById('toggleDashboardFocus');
    const dashboardOptionsContainer = document.getElementById('dashboardFocusOptions');
    const selectOutlineStyle = document.getElementById('selectOutlineStyle');
    const selectOutlineColor = document.getElementById('selectOutlineColor');
    const rangeOutlineWidth = document.getElementById('rangeOutlineWidth');
    const outlineWidthValue = document.getElementById('outlineWidthValue');

    // Chaves do Storage
    const INATIVAR_ENABLED_KEY = 'inativarEnabled';
    const INATIVAR_TIME_KEY = 'inativarTime';
    const DASHBOARD_FOCUS_ENABLED_KEY = 'dashboardFocusEnabled';
    const DF_OUTLINE_STYLE_KEY = 'df_outlineStyle';
    const DF_OUTLINE_WIDTH_KEY = 'df_outlineWidth';
    const DF_OUTLINE_COLOR_KEY = 'df_outlineColor';

    // Carregar estados salvos
    chrome.storage.local.get(
        [
            INATIVAR_ENABLED_KEY, INATIVAR_TIME_KEY, DASHBOARD_FOCUS_ENABLED_KEY,
            DF_OUTLINE_STYLE_KEY, DF_OUTLINE_WIDTH_KEY, DF_OUTLINE_COLOR_KEY
        ],
        (result) => {
            // Destaque de Inativos (padrão: ativado, 20 min)
            toggleInativar.checked = result[INATIVAR_ENABLED_KEY] !== false;
            inputTempo.value = result[INATIVAR_TIME_KEY] || 20;

            // Destaque ao Visualizar (padrão: ativado)
            const isDashboardFocusEnabled = result[DASHBOARD_FOCUS_ENABLED_KEY] !== false;
            toggleDashboardFocus.checked = isDashboardFocusEnabled;
            dashboardOptionsContainer.style.display = isDashboardFocusEnabled ? 'flex' : 'none';

            // Carrega configurações de personalização
            selectOutlineStyle.value = result[DF_OUTLINE_STYLE_KEY] || 'dotted';
            const outlineWidth = result[DF_OUTLINE_WIDTH_KEY] || 3;
            rangeOutlineWidth.value = outlineWidth;
            outlineWidthValue.textContent = `${outlineWidth}px`;
            selectOutlineColor.value = result[DF_OUTLINE_COLOR_KEY] || '#007bff';
        });

    // Salvar estado ao alterar o switch
    toggleInativar.addEventListener('change', () => {
        chrome.storage.local.set({[INATIVAR_ENABLED_KEY]: toggleInativar.checked});
    });

    // Salvar tempo ao alterar o input
    inputTempo.addEventListener('change', () => {
        const time = parseInt(inputTempo.value, 10);
        if (time > 0) {
            chrome.storage.local.set({[INATIVAR_TIME_KEY]: time});
        }
    });

    // Salvar estado do Destaque ao Visualizar
    toggleDashboardFocus.addEventListener('change', () => {
        const isEnabled = toggleDashboardFocus.checked;
        chrome.storage.local.set({[DASHBOARD_FOCUS_ENABLED_KEY]: isEnabled});
        dashboardOptionsContainer.style.display = isEnabled ? 'flex' : 'none';
    });

    // Salvar configurações de personalização
    rangeOutlineWidth.addEventListener('input', () => {
        const width = rangeOutlineWidth.value;
        outlineWidthValue.textContent = `${width}px`;
        chrome.storage.local.set({[DF_OUTLINE_WIDTH_KEY]: parseInt(width, 10)});
    });
    selectOutlineStyle.addEventListener('change', () => chrome.storage.local.set({[DF_OUTLINE_STYLE_KEY]: selectOutlineStyle.value}));
    selectOutlineColor.addEventListener('change', () => chrome.storage.local.set({[DF_OUTLINE_COLOR_KEY]: selectOutlineColor.value}));
});
