document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggleInativar');
    const inputTempo = document.getElementById('inputTempo');

    // Carregar estado salvo (padrão: true e 20 minutos)
    chrome.storage.local.get(['inativarEnabled', 'inativarTime'], (result) => {
        if (result.inativarEnabled !== undefined) {
            toggle.checked = result.inativarEnabled;
        } else {
            toggle.checked = true; // Ativado por padrão
        }

        if (result.inativarTime !== undefined) {
            inputTempo.value = result.inativarTime;
        } else {
            inputTempo.value = 20; // 20 minutos por padrão
        }
    });

    // Salvar estado ao alterar o switch
    toggle.addEventListener('change', () => {
        const isEnabled = toggle.checked;
        chrome.storage.local.set({ inativarEnabled: isEnabled }, () => {
            console.log('Estado 20Inativar salvo:', isEnabled);
        });
    });

    // Salvar tempo ao alterar o input
    inputTempo.addEventListener('change', () => {
        const time = parseInt(inputTempo.value, 10);
        if (time > 0) {
            chrome.storage.local.set({ inativarTime: time }, () => {
                console.log('Tempo 20Inativar salvo:', time);
            });
        }
    });
});
