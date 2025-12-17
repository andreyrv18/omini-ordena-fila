# 🚀 Omni - Ordenador de Fila & Monitor de Produtividade

![Version](https://img.shields.io/badge/version-2.2.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

Uma extensão para Google Chrome desenvolvida para otimizar o fluxo de trabalho de atendentes na plataforma Omni. A ferramenta permite ordenar filas de espera por tempo (antiguidade) e monitorar visualmente a inatividade em chats abertos.

> **Nota:** Esta é uma extensão independente e não possui vínculo oficial com a plataforma Omni.

---

## ✨ Funcionalidades Principais

### 1. ⏳ Ordenação de Fila (Integração Nativa)
Chega de procurar visualmente quem está esperando há mais tempo.
- **Como funciona:** Um novo botão (ícone de ampulheta) é adicionado automaticamente ao **menu lateral esquerdo** do Omni, logo acima da opção "Aguardando".
- **O que faz:** Ao clicar, a extensão lê os horários dos cards (ex: "há 2 horas", "há 5 minutos") e reordena a lista instantaneamente, trazendo os casos mais antigos para o topo.

### 2. 🚨 Monitor de Inatividade (20Inativar)
Nunca mais esqueça um atendimento parado.
- **Monitoramento:** A extensão verifica a cada 10 segundos a lista de chats em andamento.
- **Alerta Visual:** Se a última mensagem (do cliente ou do agente) ultrapassar o tempo limite configurado, o card recebe uma **borda vermelha** e um fundo avermelhado para destaque imediato.
- **Inteligência:** O algoritmo detecta viradas de dia (ex: mensagem às 23:50 e agora são 08:00) para calcular o tempo corretamente.

### 3. ⚙️ Configurações Personalizáveis
Adapte a ferramenta ao setor que trabalha. Clicando no ícone da extensão na barra do navegador, você pode:
- **Ativar/Desativar:** Ligue ou desligue o monitor de inatividade com um clique.
- **Definir Tempo:** Escolha quantos minutos de inatividade são necessários para disparar o alerta (Padrão: 20 minutos).

---

## 📸 Screenshots
![Imagem de capa](Chrome-Store-Imagens/1280x800-v2.2.0.png "Capa") 
![Imagem de capa](Chrome-Store-Imagens/440x280-v2.2.0.png "Capa") 


---
## 🧭 Instalação (Chrome Store)

1. Acesse : [Omni - Ordenador de Fila](https://chromewebstore.google.com/detail/omni-ordenador-de-fila/gkgjbjjmemafdobnaddiihkijddojpij?authuser=0&hl=pt-BR)
2. clique em usar no Chrome
3. Vá até o Omni, no menu lateral terá um novo ícone (Ampulheta) em cima do botão da fila,
4. Clique na fila depois clique na ampulheta. Pronto sua fila está ordenada

## 🛠️ Instalação (Modo Desenvolvedor)

Como esta extensão é Open Source, você pode instalá-la manualmente:

1. Faça o **Download** deste repositório (Code -> Download ZIP) e extraia a pasta.
2. No Google Chrome, acesse `chrome://extensions/`.
3. Ative o **Modo do desenvolvedor** no canto superior direito.
4. Clique em **Carregar sem compactação** (Load Unpacked).
5. Selecione a pasta onde você extraiu os arquivos.
6. Pronto! A extensão já está rodando no seu painel Omni.

---

## 🔧 Tecnologias e Permissões

A extensão foi construída utilizando **Manifest V3** e **Vanilla JavaScript**.

- **Permissões:**
    - `storage`: Necessário para salvar suas preferências de tempo e ativação (Popup) localmente no navegador.
    - `host_permissions`: Necessário para injetar o script `content.js` especificamente nos domínios da Omni para ler a estrutura da fila.
- **Privacidade:** A extensão roda 100% localmente (Client-side). Nenhum dado de cliente é coletado, armazenado ou enviado para servidores externos.

---

## 📝 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

### ☕ Apoie o projeto
Se esta extensão ajuda no seu dia a dia, considere deixar uma ⭐ estrela neste repositório!