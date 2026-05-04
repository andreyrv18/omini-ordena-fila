document.addEventListener('DOMContentLoaded', () => {
    const toggleInativar = document.getElementById('toggleInativar');
    const inputTempo = document.getElementById('inputTempo');
    const toggleDashboardFocus = document.getElementById('toggleDashboardFocus');
    const dashboardOptionsContainer = document.getElementById('dashboardFocusOptions');
    const selectOutlineStyle = document.getElementById('selectOutlineStyle');
    const selectOutlineColor = document.getElementById('selectOutlineColor');
    const rangeOutlineWidth = document.getElementById('rangeOutlineWidth');
    const outlineWidthValue = document.getElementById('outlineWidthValue');

    // Carregar estados salvos
    chrome.storage.local.get(
        [
            STORAGE_KEYS.INATIVAR_ENABLED, STORAGE_KEYS.INATIVAR_TIME, STORAGE_KEYS.DASHBOARD_FOCUS_ENABLED,
            STORAGE_KEYS.DF_OUTLINE_STYLE, STORAGE_KEYS.DF_OUTLINE_WIDTH, STORAGE_KEYS.DF_OUTLINE_COLOR
        ],
        (result) => {
            // Destaque de Inativos (padrão: ativado, 20 min)
            toggleInativar.checked = result[STORAGE_KEYS.INATIVAR_ENABLED] !== false;
            inputTempo.value = result[STORAGE_KEYS.INATIVAR_TIME] || 20;

            // Destaque ao Visualizar (padrão: ativado)
            const isDashboardFocusEnabled = result[STORAGE_KEYS.DASHBOARD_FOCUS_ENABLED] !== false;
            toggleDashboardFocus.checked = isDashboardFocusEnabled;
            dashboardOptionsContainer.style.display = isDashboardFocusEnabled ? 'flex' : 'none';

            // Carrega configurações de personalização
            selectOutlineStyle.value = result[STORAGE_KEYS.DF_OUTLINE_STYLE] || 'dotted';
            const outlineWidth = result[STORAGE_KEYS.DF_OUTLINE_WIDTH] || 3;
            rangeOutlineWidth.value = outlineWidth;
            outlineWidthValue.textContent = `${outlineWidth}px`;
            selectOutlineColor.value = result[STORAGE_KEYS.DF_OUTLINE_COLOR] || '#007bff';
        });

    // Salvar estado ao alterar o switch
    toggleInativar.addEventListener('change', () => {
        chrome.storage.local.set({[STORAGE_KEYS.INATIVAR_ENABLED]: toggleInativar.checked});
    });

    // Salvar tempo ao alterar o input
    inputTempo.addEventListener('change', () => {
        const time = parseInt(inputTempo.value, 10);
        if (time > 0) {
            chrome.storage.local.set({[STORAGE_KEYS.INATIVAR_TIME]: time});
        }
    });

    // Salvar estado do Destaque ao Visualizar
    toggleDashboardFocus.addEventListener('change', () => {
        const isEnabled = toggleDashboardFocus.checked;
        chrome.storage.local.set({[STORAGE_KEYS.DASHBOARD_FOCUS_ENABLED]: isEnabled});
        dashboardOptionsContainer.style.display = isEnabled ? 'flex' : 'none';
    });

    // Salvar configurações de personalização
    rangeOutlineWidth.addEventListener('input', () => {
        const width = rangeOutlineWidth.value;
        outlineWidthValue.textContent = `${width}px`;
        chrome.storage.local.set({[STORAGE_KEYS.DF_OUTLINE_WIDTH]: parseInt(width, 10)});
    });
    selectOutlineStyle.addEventListener('change', () => chrome.storage.local.set({[STORAGE_KEYS.DF_OUTLINE_STYLE]: selectOutlineStyle.value}));
    selectOutlineColor.addEventListener('change', () => chrome.storage.local.set({[STORAGE_KEYS.DF_OUTLINE_COLOR]: selectOutlineColor.value}));
});
