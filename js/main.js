/**
 * ===== ARQUIVO PRINCIPAL =====
 * Arquivo responsável por coordenar todos os módulos,
 * inicializar a aplicação e gerenciar o ciclo de vida
 */

// ===== VERIFICAÇÃO DE DEPENDÊNCIAS =====

/**
 * Verifica se todas as dependências necessárias estão carregadas
 * @returns {boolean} True se todas as dependências estão disponíveis
 */
function checkDependencies() {
  const required = [
    'WEAPONS_DATA',
    'calculateRowData',
    'calculateMainKPIs',
    'calculateFinalKPIs',
    'sortRows',
    'formatNumber',
    'initializeUI'
  ];
  
  const missing = required.filter(dep => typeof window[dep] === 'undefined');
  
  if (missing.length > 0) {
    console.error('Dependências faltando:', missing);
    return false;
  }
  
  return true;
}

// ===== INICIALIZAÇÃO DA APLICAÇÃO =====

/**
 * Inicializa a aplicação principal
 */
function initializeApp() {
  console.log('🚀 Iniciando Calculadora de Treino...');
  
  // Verifica dependências
  if (!checkDependencies()) {
    console.error('❌ Falha ao inicializar: dependências não encontradas');
    return;
  }
  
  try {
    // Inicializa o sistema de tema
    if (typeof initializeTheme === 'function') {
      initializeTheme();
      console.log('✅ Sistema de tema inicializado');
    } else {
      console.warn('⚠️ Sistema de tema não disponível');
    }
    
    // Inicializa a interface
    initializeUI();
    
    console.log('✅ Aplicação inicializada com sucesso!');
    console.log('📊 Total de itens:', WEAPONS_DATA.length);
    console.log('⚡ Intervalo base fixo: 2 segundos');
    
  } catch (error) {
    console.error('❌ Erro ao inicializar aplicação:', error);
  }
}

// ===== GESTÃO DO CICLO DE VIDA =====

/**
 * Função executada quando o DOM estiver completamente carregado
 */
function onDOMReady() {
  // Pequeno delay para garantir que todos os scripts foram carregados
  setTimeout(() => {
    initializeApp();
  }, 100);
}

// ===== CONFIGURAÇÃO DE EVENT LISTENERS GLOBAIS =====

/**
 * Configura os event listeners globais da aplicação
 */
function setupGlobalEventListeners() {
  // Event listener para quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDOMReady);
  } else {
    // DOM já está pronto
    onDOMReady();
  }
}

// ===== FUNÇÕES DE UTILIDADE GLOBAIS =====

/**
 * Função global para debug da aplicação
 * Útil para desenvolvimento e troubleshooting
 */
window.debugApp = function() {
  console.group('🐛 Debug da Aplicação');
  console.log('Elementos DOM:', elements);
  console.log('Preços:', Array.from(prices.entries()));
  console.log('Dados dos itens:', WEAPONS_DATA);
  console.log('⚡ Intervalo base fixo: 2 segundos');
  console.groupEnd();
};

/**
 * Função global para resetar a aplicação
 * Útil para testes e desenvolvimento
 */
window.resetApp = function() {
  console.log('🔄 Resetando aplicação...');
  
  // Limpa preços
  if (typeof prices !== 'undefined') {
    prices.clear();
  }
  
  // Re-renderiza
  if (typeof renderTable === 'function') {
    renderTable();
  }
  
  console.log('✅ Aplicação resetada!');
};

// ===== INICIALIZAÇÃO AUTOMÁTICA =====

// Configura os event listeners globais
setupGlobalEventListeners();

// ===== EXPORTAÇÃO PARA DESENVOLVIMENTO =====

// Em desenvolvimento, expõe funções úteis no console
console.log('🔧 Modo desenvolvimento ativo');
console.log('📚 Funções disponíveis: debugApp(), resetApp()');
console.log('💡 Use debugApp() para inspecionar o estado da aplicação');
console.log('⚡ Intervalo base fixo: 2 segundos');
