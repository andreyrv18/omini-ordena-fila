'use strict';

chrome.runtime.onInstalled.addListener((details) => {
    // Verifica se o motivo da instalação foi uma atualização.
    if (details.reason === 'update') {
        // Abre uma nova aba com a página de novidades.
        chrome.tabs.create({ url: 'changelog.html' });
    }
});