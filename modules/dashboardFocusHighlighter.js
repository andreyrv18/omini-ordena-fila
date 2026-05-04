'use strict';

/**
 * Módulo que destaca o card de atendimento na lista principal e mantém o destaque
 * salvo no storage para persistir entre navegações.
 */
const DashboardFocusHighlighter = {
    HIGHLIGHT_CLASS: 'card-focado-manualmente',
    STYLE_ID: 'omni-dashboard-highlight-styles',
    STORAGE_KEY: 'dashboardFocusedCardId',

    /**
     * Injeta ou atualiza os estilos CSS com base nas configurações salvas no storage.
     */
    injectStyles() {
        // Define default values
        const DEFAULTS = {
            df_outlineStyle: 'dotted',
            df_outlineWidth: 3,
            df_outlineColor: '#007bff',
            df_shadowStyle: 'shadow1'
        };

        chrome.storage.local.get(Object.keys(DEFAULTS), (settings) => {
            if (chrome.runtime.lastError) return;

            const outlineStyle = settings.df_outlineStyle || DEFAULTS.df_outlineStyle;
            const outlineWidth = settings.df_outlineWidth || DEFAULTS.df_outlineWidth;
            const outlineColor = settings.df_outlineColor || DEFAULTS.df_outlineColor;
            const shadowStyle = settings.df_shadowStyle || DEFAULTS.df_shadowStyle;

            // Helper to convert hex to rgba
            const hexToRgba = (hex, alpha) => {
                try {
                    const r = parseInt(hex.slice(1, 3), 16);
                    const g = parseInt(hex.slice(3, 5), 16);
                    const b = parseInt(hex.slice(5, 7), 16);
                    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                } catch (e) {
                    return `rgba(0, 123, 255, ${alpha})`; // Fallback color
                }
            };

            const boxShadowRgba = hexToRgba(outlineColor, 0.5);
            const boxShadowRgbaStrong = hexToRgba(outlineColor, 0.8);

            let boxShadowValue = 'none';
            if (shadowStyle === 'shadow1') boxShadowValue = `0 0 8px ${boxShadowRgba}`;
            else if (shadowStyle === 'shadow2') boxShadowValue = `0 4px 12px ${boxShadowRgbaStrong}`;
            else if (shadowStyle === 'shadow3') boxShadowValue = `4px 4px 0px ${outlineColor}`;
            else if (shadowStyle === 'shadow4') boxShadowValue = `0 10px 20px ${boxShadowRgba}`;

            const styleContent = `
                .${this.HIGHLIGHT_CLASS} {
                    outline: ${outlineWidth}px ${outlineStyle} ${outlineColor} !important;
                    outline-offset: -${outlineWidth}px !important;
                    box-shadow: ${boxShadowValue} !important;
                    transition: outline 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                }
            `;

            let styleEl = document.getElementById(this.STYLE_ID);
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = this.STYLE_ID;
                document.head.appendChild(styleEl);
            }

            styleEl.textContent = styleContent;
        });
    },

    /**
     * Aplica a classe de destaque a um card específico e remove de outros.
     * @param {string | null} cardId O ID do card a ser destacado, ou null para remover todos.
     */
    applyHighlight(cardId) {
        // Remove o destaque de qualquer card que o tenha
        document.querySelectorAll(`.${this.HIGHLIGHT_CLASS}`).forEach(card => {
            card.classList.remove(this.HIGHLIGHT_CLASS);
        });

        if (cardId) {
            const cardAlvo = document.querySelector(`.list_dados div[data-id="${cardId}"]`);
            if (cardAlvo) {
                cardAlvo.classList.add(this.HIGHLIGHT_CLASS);
            }
        }
    },

    /**
     * Busca o ID salvo no storage e aplica o destaque, SE a funcionalidade estiver ativa.
     */
    applySavedHighlight() {
        chrome.storage.local.get([this.STORAGE_KEY, 'dashboardFocusEnabled'], (result) => {
            if (chrome.runtime.lastError) return; // Previne erro de contexto invalidado

            const isEnabled = result.dashboardFocusEnabled !== false;
            if (!isEnabled) {
                this.applyHighlight(null); // Garante que o destaque seja removido se desativado
                return;
            }
            if (result[this.STORAGE_KEY]) {
                this.applyHighlight(result[this.STORAGE_KEY]);
            }
        });
    },

    /**
     * Lida com cliques no documento para as ações de destacar e limpar destaque.
     * @param {MouseEvent} event O evento de clique.
     */
    handleDocumentClick(event) {
        chrome.storage.local.get('dashboardFocusEnabled', (result) => {
            if (chrome.runtime.lastError || result.dashboardFocusEnabled === false) return;

            const target = event.target;

            // Ação 1: Clicou em "Visualizar dashboard"
            const dashboardButton = target.closest('button');
            if (dashboardButton && dashboardButton.textContent.trim().includes('Visualizar dashboard')) {
                const panel = dashboardButton.closest('.dialog_panel');
                const cardId = panel?.getAttribute('data-id');
                if (cardId) {
                    // Salva no storage e aplica o highlight
                    chrome.storage.local.set({ [this.STORAGE_KEY]: cardId }, () => {
                        if (chrome.runtime.lastError) return;
                        this.applyHighlight(cardId);
                    });
                }
                return;
            }

            // Ação 2: Clicou no ícone de fechar do painel
            const closeIcon = target.closest('i[title="Fechar"]');
            if (closeIcon) {
                const panel = closeIcon.closest('.dialog_panel');
                if (panel) {
                    const cardId = panel.getAttribute('data-id');
                    chrome.storage.local.get(this.STORAGE_KEY, (storageResult) => {
                        if (chrome.runtime.lastError) return;
                        // Se o painel que está sendo fechado é o que estava destacado...
                        if (cardId && cardId === storageResult[this.STORAGE_KEY]) {
                            // Limpa o storage e remove o highlight
                            chrome.storage.local.remove(this.STORAGE_KEY, () => {
                                if (chrome.runtime.lastError) return;
                                this.applyHighlight(null);
                            });
                        }
                    });
                }
            }
        });
    },

    /**
     * Observa mudanças no DOM para reaplicar o highlight quando a lista de cards é carregada (típico em SPAs).
     */
    observeCardList() {
        const observer = new MutationObserver((mutations) => {
            // Otimização para verificar se um nó relevante foi adicionado
            const listUpdated = mutations.some(m => m.addedNodes.length > 0 && Array.from(m.addedNodes).some(n => n.nodeType === 1 && n.matches('.list_dados *, .atend_aguard')));
            if (listUpdated) {
                this.applySavedHighlight();
            }
        });

        const listContainer = document.querySelector('body'); // Observar o body é mais garantido em SPAs
        if (listContainer) {
            observer.observe(listContainer, { childList: true, subtree: true });
        }
    },

    init() {
        this.injectStyles(); // Injeção inicial
        document.addEventListener('click', this.handleDocumentClick.bind(this));

        // Aplica o highlight de imediato e começa a observar por mudanças
        this.applySavedHighlight();
        this.observeCardList();

        // Ouve por mudanças nas configurações para atualizar os estilos ou visibilidade em tempo real
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === 'local') {
                const styleKeys = ['df_outlineStyle', 'df_outlineWidth', 'df_outlineColor', 'df_shadowStyle'];
                if (styleKeys.some(key => key in changes)) {
                    this.injectStyles();
                }

                if ('dashboardFocusEnabled' in changes) {
                    this.applySavedHighlight();
                }
            }
        });

        console.log("✅ OmniSort: Módulo de destaque de dashboard (com persistência) ativado.");
    }
};
