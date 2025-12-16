(function () {
    'use strict';

    // --- FUNÇÃO DE ORDENAÇÃO ---
    function ordenarPorTempoMaisAntigo() {
        const container = document.querySelector('.list_dados');

        if (!container) {
            console.error("OmniSort: Não achei a classe .list_dados.");
            return;
        }

        const items = Array.from(container.querySelectorAll('.atend_aguard'));

        function getMinutes(element) {
            const timeDiv = element.querySelector('.tempoDescricao');
            if (!timeDiv) return -1;

            let text = timeDiv.innerText.toLowerCase().trim().replace(/\s+/g, ' ');
            let totalMinutes = 0;

            // Horas
            const hourMatch = text.match(/(\d+)\s+hora(s)?/);
            if (hourMatch) {
                totalMinutes += parseInt(hourMatch[1], 10) * 60;
            } else if (text.includes('uma hora')) {
                totalMinutes += 60;
            }

            // Minutos
            const minuteMatch = text.match(/(\d+)\s+minuto(s)?/);
            if (minuteMatch) {
                totalMinutes += parseInt(minuteMatch[1], 10);
            } else if (text.includes('um minuto')) {
                totalMinutes += 1;
            }

            return totalMinutes > 0 ? totalMinutes : 0;
        }

        // Ordenar e Reaplicar no DOM
        items.sort((a, b) => getMinutes(b) - getMinutes(a));

        const fragment = document.createDocumentFragment();
        items.forEach((item) => {
            item.style.order = "";
            fragment.appendChild(item);
        });
        container.appendChild(fragment);

        console.log(`✅ OmniSort: ${items.length} atendimentos reordenados!`);
    }

    // --- LÓGICA DE INTERFACE E ATIVAÇÃO (MENU NATIVO) ---
    const MENU_SELECTOR = '.menu';
    const REFERENCE_SELECTOR = '[data-id="atend_aguard"]'; // Item de referência (Fila)
    const NEW_ITEM_ID = 'omni-sort-button';
    const COLOR_DEFAULT = '#6d6d6d';
    const COLOR_ACTIVE = '#EF7D00';
    const initMenuInterval = setInterval(() => {
        const menu = document.querySelector(MENU_SELECTOR);
        const referenceItem = document.querySelector(REFERENCE_SELECTOR);

        // Verifica se o menu carregou e se o botão já não existe
        if (menu && referenceItem && !document.getElementById(NEW_ITEM_ID)) {

            // 1. Cria o container do item
            const sortItem = document.createElement('div');
            sortItem.className = 'item'; // Classe nativa para herdar o estilo (hover, tamanho)
            sortItem.dataset.id = 'ordenar_fila'; // Data-id customizado
            sortItem.id = NEW_ITEM_ID;
            sortItem.title = 'Ordenar por Tempo Mais Antigo'; // Tooltip nativo
            sortItem.style.cursor = 'pointer'; // Garante cursor de mãozinha

            // 2. Cria o ícone (usando FontAwesome já presente no site)
            const icon = document.createElement('i');
            icon.className = 'fas fa-hourglass-start'; // Ícone de ampulheta (ou use 'fas fa-sort-amount-down')
            icon.style.color = COLOR_DEFAULT;
            icon.style.transition = 'color 0.2s';
            // 3. Monta o botão
            sortItem.appendChild(icon);

            // 4. Adiciona Ação
            sortItem.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                icon.style.color = COLOR_ACTIVE;
                icon.style.transform = "rotate(180deg)";
                // Feedback visual de clique rápido
                sortItem.style.transform = "scale(0.90)";
                setTimeout(() => sortItem.style.transform = "scale(1)", 150);

                ordenarPorTempoMaisAntigo();
            };
            document.addEventListener('click', (e) => {
                // Se o clique não foi no botão e o botão está ativo...
                if (icon.style.color !== COLOR_DEFAULT) {
                    icon.style.color = COLOR_DEFAULT; // Desativa cor
                    icon.style.transform = "rotate(0deg)"; // Remove a rotação
                }
            });
            // 5. INSERÇÃO: Coloca o botão logo APÓS o item de "Atendimentos na fila"
            referenceItem.before(sortItem);

            // Se preferir no final do menu, use: menu.appendChild(sortItem);

            clearInterval(initMenuInterval); // Para o loop pois já inseriu
            console.log("✅ OmniSort: Botão adicionado ao menu lateral.");
        }
    }, 800);

    // --- LÓGICA DE DESTAQUE (20Inativar) ---
    // --- CONFIGURAÇÕES DO TEMPORIZADOR ---
    const LIMITE_MINUTOS = 20; // Limite de tempo para destacar (20 minutos)
    const SELETOR_CONTAINER = '.list_dados';
    const SELETOR_ITENS = 'div[data-id][class*="chat"]';
    const COR_DESTAQUE = '#dc3545'; // Vermelho

    // --- FUNÇÃO DE AUXILIAR ---
    // Converte a hora 'HH:MM' para um objeto Date.
    function parseTime(timeString) {
        const match = timeString.trim().match(/^(\d{1,2}):(\d{2})$/);
        if (!match) return null;

        const now = new Date();
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);

        // Cria um objeto Date com a data de hoje e a hora lida
        const date = new Date(
            now.getFullYear(), now.getMonth(), now.getDate(),
            hours, minutes, 0
        );

        // Se a hora lida for no futuro (ex: 16:20 agora, e 17:00 lido), assume que é de ontem.
        if (date.getTime() > now.getTime()) {
            date.setDate(date.getDate() - 1);
        }

        return date;
    }

    // --- FUNÇÃO DE DESTAQUE ---
    function destacarAtrasados() {
        chrome.storage.local.get(['inativarEnabled', 'inativarTime'], (result) => {
            const isEnabled = result.inativarEnabled !== false; // Default true
            const limitMinutes = result.inativarTime || 20; // Default 20 minutos

            const container = document.querySelector(SELETOR_CONTAINER);
            if (!container) return;

            const items = container.querySelectorAll(SELETOR_ITENS);

            // Se estiver desativado, remove os destaques e sai
            if (!isEnabled) {
                items.forEach((item) => {
                    item.style.border = '';
                    item.style.backgroundColor = '';
                });
                return;
            }

            // Lógica original se estiver ativado
            const now = new Date();
            let destacados = 0;

            items.forEach((item) => {
                // Encontra a div que contém o horário da última mensagem
                const timeDiv = item.querySelector('.data_hora_ultima_msg');

                // Garante que a div de tempo e o seu texto existam
                if (timeDiv && timeDiv.innerText) {
                    const lastMsgTime = parseTime(timeDiv.innerText);

                    if (lastMsgTime) {
                        // Calcula a diferença em minutos
                        const diffMs = now.getTime() - lastMsgTime.getTime();
                        const diffMinutes = Math.floor(diffMs / (1000 * 60));

                        if (diffMinutes >= limitMinutes) {
                            // APLICA O DESTAQUE NO CARD
                            item.style.border = `2px solid ${COR_DESTAQUE}`;
                            item.style.backgroundColor = `rgba(220, 53, 69, 0.1)`;
                            destacados++;
                        } else {
                            // REMOVE O DESTAQUE
                            item.style.border = '';
                            item.style.backgroundColor = '';
                        }
                    }
                }
            });
        });
    }

    // --- INICIA O LOOP DE VERIFICAÇÃO ---
    // Executa a função imediatamente e depois a cada 10 segundos
    destacarAtrasados();
    setInterval(destacarAtrasados, 10000);

})();