/**
 * ARQUIVO 2.0 THEME.JS
 * 21/08/2025
 * 22:30
 * 
 */

// ===== CONSTANTES =====

const THEME_STORAGE_KEY = 'calc-treino-theme';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

// ===== DETECÇÃO DE TEMA =====

/**
 * Detecta se o usuário prefere tema escuro baseado nas configurações do sistema
 * @returns {boolean} true se preferir tema escuro
 */
function prefersDarkTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Obtém o tema atual (do localStorage ou preferência do sistema)
 * @returns {string} 'light' ou 'dark'
 */
function getCurrentTheme() {
  // Primeiro tenta pegar do localStorage
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  
  if (savedTheme === THEME_LIGHT || savedTheme === THEME_DARK) {
    return savedTheme;
  }
  
  // Se não há tema salvo, usa a preferência do sistema
  return prefersDarkTheme() ? THEME_DARK : THEME_LIGHT;
}

// ===== APLICAÇÃO DE TEMA =====

/**
 * Aplica o tema especificado ao documento
 * @param {string} theme - 'light' ou 'dark'
 */
function applyTheme(theme) {
  const root = document.documentElement;
  
  if (theme === THEME_DARK) {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
  
  // Salva no localStorage
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  
  // Atualiza o ícone do botão
  updateThemeButton(theme);
}

/**
 * Atualiza o ícone e texto do botão de toggle
 * @param {string} theme - Tema atual
 */
function updateThemeButton(theme) {
  const button = document.getElementById('themeToggle');
  if (!button) return;
  
  if (theme === THEME_DARK) {
    button.innerHTML = '☀️';
    button.title = 'Mudar para tema claro';
  } else {
    button.innerHTML = '🌙';
    button.title = 'Mudar para tema escuro';
  }
}

// ===== TOGGLE DE TEMA =====

/**
 * Alterna entre os temas claro e escuro
 */
function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
  
  applyTheme(newTheme);
  
  // Log para debug
  console.log(`🎨 Tema alterado: ${currentTheme} → ${newTheme}`);
}

// ===== INICIALIZAÇÃO =====

/**
 * Inicializa o sistema de tema
 */
function initializeTheme() {
  // Aplica o tema atual
  const currentTheme = getCurrentTheme();
  applyTheme(currentTheme);
  
  // Configura o event listener do botão
  const button = document.getElementById('themeToggle');
  if (button) {
    button.addEventListener('click', toggleTheme);
  }
  
  // Configura listener para mudanças de preferência do sistema
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // Só aplica mudança automática se não houver tema salvo
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        const newTheme = e.matches ? THEME_DARK : THEME_LIGHT;
        applyTheme(newTheme);
        console.log(`🎨 Tema alterado automaticamente para: ${newTheme}`);
      }
    });
  }
  
  console.log(`🎨 Sistema de tema inicializado com: ${currentTheme}`);
}

// ===== EXPORTAÇÃO =====

// Torna as funções disponíveis globalmente
window.initializeTheme = initializeTheme;
window.toggleTheme = toggleTheme;
window.getCurrentTheme = getCurrentTheme;
