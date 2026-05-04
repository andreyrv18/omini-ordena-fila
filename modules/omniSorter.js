'use strict';

/**
 * Módulo responsável pela lógica de ordenação dos atendimentos.
 */
const OmniSorter = {
    CONTAINER_SELECTOR: '.list_dados',
    ITEM_SELECTOR: '.atend_aguard',
    TIME_SELECTOR: '.tempoDescricao',

    /**
     * Extrai o tempo total em minutos de um elemento de atendimento.
     * @param {HTMLElement} element O item do DOM do atendimento.
     * @returns {number} O total de minutos, ou -1 se o tempo não for encontrado.
     */
    getMinutes(element) {
        const timeDiv = element.querySelector(this.TIME_SELECTOR);
        if (!timeDiv) return -1;

        let text = timeDiv.innerText.toLowerCase().trim().replace(/\s+/g, ' ');
        let totalMinutes = 0;

        // Procura por "X hora(s)" ou "uma hora"
        const hourMatch = text.match(/(\d+)\s+hora(s)?/);
        if (hourMatch) {
            totalMinutes += parseInt(hourMatch[1], 10) * 60;
        } else if (text.includes('uma hora')) {
            totalMinutes += 60;
        }

        // Procura por "X minuto(s)" ou "um minuto"
        const minuteMatch = text.match(/(\d+)\s+minuto(s)?/);
        if (minuteMatch) {
            totalMinutes += parseInt(minuteMatch[1], 10);
        } else if (text.includes('um minuto')) {
            totalMinutes += 1;
        }

        return totalMinutes;
    },

    /**
     * Ordena os itens de atendimento no DOM pelo tempo, do mais antigo para o mais novo.
     */
    sort() {
        const container = document.querySelector(this.CONTAINER_SELECTOR);
        if (!container) {
            console.error("OmniSort: Não foi possível encontrar o container '.list_dados' para ordenar.");
            return;
        }

        const items = Array.from(container.querySelectorAll(this.ITEM_SELECTOR));

        // Ordena os itens com base nos minutos (maior tempo primeiro)
        items.sort((a, b) => this.getMinutes(b) - this.getMinutes(a));

        // Reinsere os itens ordenados no DOM de forma eficiente
        const fragment = document.createDocumentFragment();
        items.forEach(item => fragment.appendChild(item));
        container.appendChild(fragment);

        console.log(`✅ OmniSort: ${items.length} atendimentos reordenados!`);
    }
};