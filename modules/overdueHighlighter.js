'use strict';

/**
 * Módulo responsável por destacar atendimentos que excederam o tempo limite.
 */
const OverdueHighlighter = {
    CONTAINER_SELECTOR: '.list_dados',
    ITEM_SELECTOR: 'div[data-id][class*="chat"]',
    TIME_SELECTOR: '.data_hora_ultima_msg',
    HIGHLIGHT_COLOR: '#dc3545',
    DEFAULT_LIMIT_MINUTES: 20,

    /**
     * Converte uma string de tempo 'HH:MM' para um objeto Date.
     * @param {string} timeString A string de tempo.
     * @returns {Date|null} O objeto Date ou null se o formato for inválido.
     */
    parseTime(timeString) {
        const match = timeString.trim().match(/^(\d{1,2}):(\d{2})$/);
        if (!match) return null;

        const now = new Date();
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);

        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

        // Se a hora parseada for no futuro, assume que é do dia anterior.
        if (date.getTime() > now.getTime()) {
            date.setDate(date.getDate() - 1);
        }
        return date;
    },

    /**
     * Aplica o estilo de destaque a um item.
     * @param {HTMLElement} item O elemento do DOM a ser destacado.
     */
    applyHighlight(item) {
        item.style.border = `2px solid ${this.HIGHLIGHT_COLOR}`;
        item.style.backgroundColor = `rgba(220, 53, 69, 0.1)`;
    },

    /**
     * Remove o estilo de destaque de um item.
     * @param {HTMLElement} item O elemento do DOM a ter o destaque removido.
     */
    removeHighlight(item) {
        item.style.border = '';
        item.style.backgroundColor = '';
    },

    /**
     * Verifica e destaca os itens atrasados.
     */
    checkAndHighlight() {
        chrome.storage.local.get(['inativarEnabled', 'inativarTime'], (result) => {
            // Verifica se o contexto da extensão ainda é válido.
            // Isso previne o erro "Extension context invalidated" se a página for fechada
            // ou o usuário navegar para outra página enquanto o setInterval está rodando.
            if (chrome.runtime.lastError) {
                return; // Aborta a execução se o contexto foi invalidado.
            }

            const isEnabled = result.inativarEnabled !== false; // Ativado por padrão
            const limitMinutes = result.inativarTime || this.DEFAULT_LIMIT_MINUTES;

            const container = document.querySelector(this.CONTAINER_SELECTOR);
            if (!container) return;

            const items = container.querySelectorAll(this.ITEM_SELECTOR);

            if (!isEnabled) {
                items.forEach(item => this.removeHighlight(item));
                return;
            }

            const now = new Date();
            items.forEach(item => {
                const timeDiv = item.querySelector(this.TIME_SELECTOR);
                if (!timeDiv || !timeDiv.innerText) {
                    this.removeHighlight(item); // Garante que itens sem tempo não fiquem destacados
                    return;
                }

                const lastMsgTime = this.parseTime(timeDiv.innerText);
                if (!lastMsgTime) {
                    this.removeHighlight(item);
                    return;
                }

                const diffMs = now.getTime() - lastMsgTime.getTime();
                const diffMinutes = Math.floor(diffMs / (1000 * 60));

                if (diffMinutes >= limitMinutes) {
                    this.applyHighlight(item);
                } else {
                    this.removeHighlight(item);
                }
            });
        });
    },

    /**
     * Inicia o loop de verificação para destacar itens.
     */
    init() {
        this.checkAndHighlight();
        setInterval(() => this.checkAndHighlight(), 10000);
    }
};