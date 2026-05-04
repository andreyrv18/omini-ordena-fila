'use strict';

// --- INICIALIZAÇÃO DOS MÓDULOS ---
// Os módulos (OmniSorter, SortButtonInjector, OverdueHighlighter)
// são carregados individualmente e em ordem antes deste script,
// conforme definido no `manifest.json`.

SortButtonInjector.init();
OverdueHighlighter.init();
DashboardFocusHighlighter.init();