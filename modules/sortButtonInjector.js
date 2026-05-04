'use strict';

/**
 * Módulo responsável por injetar e gerenciar o botão de ordenação na interface.
 */
const SortButtonInjector = {
    MENU_SELECTOR: '.menu',
    REFERENCE_SELECTOR: '[data-id="atend_aguard"]',
    NEW_ITEM_ID: 'omni-sort-button',
    COLOR_DEFAULT: '#6d6d6d',
    COLOR_ACTIVE: '#EF7D00',

    /**
     * Inicia a verificação para injetar o botão no menu.
     */
    init() {
        const initMenuInterval = setInterval(() => {
            const menu = document.querySelector(this.MENU_SELECTOR);
            const referenceItem = document.querySelector(this.REFERENCE_SELECTOR);

            if (menu && referenceItem && !document.getElementById(this.NEW_ITEM_ID)) {
                this.createAndInjectButton(referenceItem);
                clearInterval(initMenuInterval);
                console.log("✅ OmniSort: Botão de ordenação adicionado ao menu lateral.");
            }
        }, 800);
    },

    /**
     * Cria o botão de ordenação e o insere no DOM.
     * @param {HTMLElement} referenceItem O elemento de referência antes do qual o botão será inserido.
     */
    createAndInjectButton(referenceItem) {
        const sortItem = document.createElement('div');
        sortItem.className = 'item';
        sortItem.dataset.id = 'ordenar_fila';
        sortItem.id = this.NEW_ITEM_ID;
        sortItem.title = 'Ordenar por Tempo Mais Antigo';
        sortItem.style.cursor = 'pointer';

        const icon = document.createElement('i');
        icon.className = 'fas fa-hourglass-start';
        icon.style.color = this.COLOR_DEFAULT;
        icon.style.transition = 'color 0.2s, transform 0.4s ease-out';

        sortItem.appendChild(icon);

        sortItem.onclick = () => {
            // Previne múltiplos cliques rápidos
            if (icon.style.color === this.COLOR_ACTIVE) return;

            // Feedback visual de clique
            icon.style.color = this.COLOR_ACTIVE;
            icon.style.transform = "rotate(360deg)";
            sortItem.style.transform = "scale(0.90)";
            setTimeout(() => sortItem.style.transform = "scale(1)", 150);

            // Executa a ordenação (chama o outro módulo)
            OmniSorter.sort();

            // Reseta o ícone após um tempo para indicar que a ação terminou
            setTimeout(() => {
                icon.style.color = this.COLOR_DEFAULT;
                icon.style.transform = "rotate(0deg)";
            }, 1200);
        };

        referenceItem.before(sortItem);
    }
};