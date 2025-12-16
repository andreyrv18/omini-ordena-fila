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

        items.forEach((item) => {
            item.style.order = "";
            container.appendChild(item);
        });

        console.log(`✅ OmniSort: ${items.length} atendimentos reordenados!`);
    }

    // --- LÓGICA DE INTERFACE E ATIVAÇÃO ---
    const SORT_BUTTON_ID = 'botao-ordenar-atendimentos';

    // 1. Cria o botão (Invisível por padrão)
    if (!document.getElementById(SORT_BUTTON_ID)) {
        const sortButton = document.createElement('button');
        sortButton.innerText = 'Ordenar ⏳';
        sortButton.id = SORT_BUTTON_ID;

        // Estilos do botão
        sortButton.style.cssText = `
            position: fixed; top: 10px; right: 10px; z-index: 99999;
            background-color: #dc3545; color: white; border: none;
            padding: 8px 15px; border-radius: 5px; cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2); font-weight: bold;
            font-family: sans-serif; display: none;
        `;

        // Efeitos visuais
        sortButton.onmouseover = () => {
            sortButton.style.backgroundColor = '#c82333';
        };
        sortButton.onmouseout = () => {
            sortButton.style.backgroundColor = '#dc3545';
        };

        // Ação
        sortButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            ordenarPorTempoMaisAntigo();
        };

        document.body.appendChild(sortButton);
    }

    // 2. Monitora cliques na fila para mostrar o botão
    const targetSelector = '[data-id="atend_aguard"]';
    const button = document.getElementById(SORT_BUTTON_ID);

    // Intervalo para achar o menu lateral (já que o site pode demorar a carregar)
    const initInterval = setInterval(() => {
        const targetElement = document.querySelector(targetSelector);

        if (targetElement) {
            clearInterval(initInterval);

            // Ao clicar na fila -> Mostra botão
            targetElement.addEventListener('click', () => {
                if (button) button.style.display = 'block';
            });

            // Ao clicar fora da fila (no menu pai) -> Esconde botão
            const listParent = targetElement.closest('.list');
            if (listParent) {
                listParent.addEventListener('click', (e) => {
                    const clickedOnQueue = e.target.closest(targetSelector);
                    if (!clickedOnQueue && button) {
                        button.style.display = 'none';
                    }
                });
            }
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