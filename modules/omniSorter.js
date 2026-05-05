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
     */
    getMinutes(element) {
        const timeDiv = element.querySelector(this.TIME_SELECTOR);
        if (!timeDiv) return -1;

        let text = timeDiv.innerText.toLowerCase().trim().replace(/\s+/g, ' ');
        let totalMinutes = 0;

        const hourMatch = text.match(/(\d+)\s+hora(s)?/);
        if (hourMatch) {
            totalMinutes += parseInt(hourMatch[1], 10) * 60;
        } else if (text.includes('uma hora')) {
            totalMinutes += 60;
        }

        const minuteMatch = text.match(/(\d+)\s+minuto(s)?/);
        if (minuteMatch) {
            totalMinutes += parseInt(minuteMatch[1], 10);
        } else if (text.includes('um minuto')) {
            totalMinutes += 1;
        }

        return totalMinutes;
    },

    /**
     * Ordena os itens de atendimento no DOM pelo tempo e remove interferências de CSS.
     */
    sort() {
        const container = document.querySelector(this.CONTAINER_SELECTOR);

        if (!container) {
            console.error("OmniSort: Não achei a classe .list_dados.");
            return;
        }

        const items = Array.from(container.querySelectorAll(this.ITEM_SELECTOR));

        items.sort((a, b) => this.getMinutes(b) - this.getMinutes(a));

        const fragment = document.createDocumentFragment();
        items.forEach((item) => {
            item.style.order = "";
            fragment.appendChild(item);
        });
        container.appendChild(fragment);

        console.log(`✅ OmniSort: ${items.length} atendimentos reordenados!`);
    }

};