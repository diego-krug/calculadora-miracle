/** 
 * ARQUIVO 2.0 UI.JS
 * 21/08/2025
 * 22:30
*/
const elements = {
  // Parâmetros de entrada (agora só targetHours)
  targetHours: null,
  
  // Controles de filtro e ordenação
  search: null,
  sortBy: null,
  sortDir: null,
  

  
  // Calculadora de quantidade
  itemSelector: null,
  quantityResult: null
};

/**
 * Inicializa as referências dos elementos DOM
 */
function initializeElements() {
  try {
    // Apenas targetHours é necessário agora
    elements.targetHours = document.getElementById('targetHours');
    
    elements.search = document.getElementById('search');
    elements.sortBy = document.getElementById('sortBy');
    elements.sortDir = document.getElementById('sortDir');
    
    // Calculadora de quantidade
    elements.itemSelector = document.getElementById('itemSelector');
    
    // Custom select com imagens
    elements.customSelect = document.getElementById('customSelect');
    elements.selectedItem = document.getElementById('selectedItem');
    elements.customDropdown = document.getElementById('customDropdown');
    
    console.log('✅ Elementos DOM inicializados com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar elementos DOM:', error);
  }
}

// ===== UTILITÁRIOS DE IMAGEM =====

/**
 * Mapeia o nome do item para o nome do arquivo de imagem
 * @param {string} itemName - Nome completo do item (ex: "Spark Training Axe")
 * @returns {string} Nome do arquivo de imagem (ex: "spark_axe.gif")
 */
function getItemImageName(itemName) {
  // Se for um grupo, usa a função específica do calculator.js
  if (typeof getGroupImageName === 'function' && itemName.includes('Melee')) {
    return getGroupImageName(itemName);
  }
  
  // Remove "Training" e converte para o formato do arquivo
  const cleanName = itemName.replace(' Training ', '_').toLowerCase();
  return `${cleanName}.gif`;
}

/**
 * Cria uma célula com imagem do item
 * @param {string} itemName - Nome do item
 * @returns {HTMLElement} Elemento TD com imagem
 */
function createImageCell(itemName) {
  const td = document.createElement('td');
  td.className = 'item-image-cell';
  
  const img = document.createElement('img');
  img.src = `assets/${getItemImageName(itemName)}`;
  img.alt = itemName;
  img.className = 'item-image';
  img.title = itemName;
  
  // Fallback para caso a imagem não carregue
  img.onerror = function() {
    this.style.display = 'none';
    const fallback = document.createElement('span');
    fallback.textContent = itemName.split(' ')[0]; // Primeira palavra como fallback
    fallback.className = 'item-fallback';
    td.appendChild(fallback);
  };
  
  td.appendChild(img);
  return td;
}

// ===== RENDERIZAÇÃO DA TABELA =====

/**
 * Cria uma célula simples da tabela
 * @param {string} content - Conteúdo da célula
 * @returns {HTMLElement} Elemento TD criado
 */
function createCell(content) {
  const td = document.createElement('td');
  td.textContent = content;
  return td;
}

/**
 * Cria uma célula da tabela com input de preço
 * @param {Object} rowData - Dados da linha
 * @returns {HTMLElement} Elemento TD com input de preço
 */
function createPriceCell(rowData) {
  const td = document.createElement('td');
  const input = document.createElement('input');
  
  input.type = 'number';
  input.step = '0.01';
  input.min = '0';
  input.value = rowData.price || '';
  input.className = 'price-input';
  input.setAttribute('data-item-name', rowData.name);
  
  // Timer para debouncing
  let updateTimer = null;
  
  input.addEventListener('input', () => {
    // Atualiza o preço imediatamente no estado global
    updateItemPrice(rowData.name, Number(input.value || 0));
    
    // Cancela o timer anterior se existir
    if (updateTimer) {
      clearTimeout(updateTimer);
    }
    
    // Agenda uma atualização com delay para evitar perda de foco
    updateTimer = setTimeout(() => {
      updateCalculatedValues();
    }, 300); // 300ms de delay
  });
  
  // Atualiza imediatamente quando perde o foco
  input.addEventListener('blur', () => {
    if (updateTimer) {
      clearTimeout(updateTimer);
    }
    updateCalculatedValues();
  });
  
  td.appendChild(input);
  return td;
}

/**
 * Cria um card para um item de arma
 * @param {Object} rowData - Dados do item
 * @returns {HTMLElement} Elemento card criado
 */
function createWeaponCard(rowData) {
  const card = document.createElement('div');
  card.className = 'weapon-card';
  
  // Header do card com imagens e título
  const header = createCardHeader(rowData);
  card.appendChild(header);
  
  // Estatísticas do item
  const stats = createCardStats(rowData);
  card.appendChild(stats);
  
  // Seção de preço e custo
  const priceSection = createCardPriceSection(rowData);
  card.appendChild(priceSection);
  
  return card;
}

/**
 * Cria o header do card com imagens e título
 */
function createCardHeader(rowData) {
  const header = document.createElement('div');
  header.className = 'card-header';
  
  // Container de imagens (primeira linha)
  const imagesContainer = document.createElement('div');
  imagesContainer.className = 'card-images';
  
  // Se for um grupo Melee, mostra as 3 armas
  if (rowData.displayName && rowData.displayName.includes('Melee')) {
    const tier = rowData.displayName.split(' ')[0]; // Spark, Lightning, Inferno
    const meleeWeapons = ['Axe', 'Club', 'Sword'];
    
    meleeWeapons.forEach(weaponType => {
      const img = document.createElement('img');
      img.src = `assets/${tier.toLowerCase()}_${weaponType.toLowerCase()}.gif`;
      img.alt = `${tier} ${weaponType}`;
      img.className = 'card-image';
      img.title = `${tier} Training ${weaponType}`;
      imagesContainer.appendChild(img);
    });
  } else {
    // Item individual
    const img = document.createElement('img');
    img.src = `assets/${getItemImageName(rowData.displayName || rowData.name)}`;
    img.alt = rowData.displayName || rowData.name;
    img.className = 'card-image';
    img.title = rowData.displayName || rowData.name;
    imagesContainer.appendChild(img);
  }
  
  // Título do card (segunda linha)
  const title = document.createElement('div');
  title.className = 'card-title';
  
  const name = document.createElement('div');
  name.className = 'card-name';
  name.textContent = rowData.displayName || rowData.name;
  
  const type = document.createElement('div');
  type.className = 'card-type';
  type.textContent = rowData.isGroup ? '⚔️ Grupo de Armas' : getItemTypeEmoji(rowData.type) + ' ' + rowData.type;
  
  title.appendChild(name);
  title.appendChild(type);
  
  // Primeira linha: imagens
  header.appendChild(imagesContainer);
  // Segunda linha: título
  header.appendChild(title);
  
  return header;
}

/**
 * Retorna emoji apropriado para o tipo de item
 */
function getItemTypeEmoji(type) {
  switch(type) {
    case 'Arma': return '⚔️';
    case 'Escudo': return '🛡️';
    default: return '⚔️';
  }
}

/**
 * Cria as estatísticas do card
 */
function createCardStats(rowData) {
  const stats = document.createElement('div');
  stats.className = 'card-stats';
  
  // Cargas
  const chargesStat = createStatItem('⚡ Cargas', rowData.charges.toLocaleString());
  stats.appendChild(chargesStat);
  
  // Minutos efetivos
  const minutesStat = createStatItem('⏱️ Min. Efetivos', formatMinutes(rowData.minutesEffPerUnit));
  stats.appendChild(minutesStat);
  
  return stats;
}

/**
 * Cria um item de estatística
 */
function createStatItem(label, value) {
  const statItem = document.createElement('div');
  statItem.className = 'stat-item';
  
  const labelEl = document.createElement('div');
  labelEl.className = 'stat-label';
  labelEl.textContent = label;
  
  const valueEl = document.createElement('div');
  valueEl.className = 'stat-value';
  valueEl.textContent = value;
  
  statItem.appendChild(labelEl);
  statItem.appendChild(valueEl);
  
  return statItem;
}

/**
 * Cria a seção de preço e custo do card
 */
function createCardPriceSection(rowData) {
  const priceSection = document.createElement('div');
  priceSection.className = 'card-price-section';
  
  // Input de preço
  const priceInput = document.createElement('input');
  priceInput.type = 'number';
  priceInput.step = '0.01';
  priceInput.min = '0';
  
  // Se tem preço, mostra. Se não tem, mas tem preço predefinido, usa ele
  const displayName = rowData.displayName || rowData.name;
  const tier = extractTierFromName(displayName);
  const predefinedPrice = TIER_PRICES[tier] || 0;
  const finalPrice = rowData.price > 0 ? rowData.price : predefinedPrice;
  
  priceInput.value = finalPrice || '';
  priceInput.className = 'price-input';
  priceInput.placeholder = predefinedPrice > 0 ? `💰 Padrão: ${predefinedPrice.toLocaleString()}` : '💰 Digite o preço';
  priceInput.setAttribute('data-item-name', displayName);
  
  // Timer para debouncing
  let updateTimer = null;
  
  priceInput.addEventListener('input', () => {
    // Atualiza o preço imediatamente no estado global
    updateItemPrice(rowData.displayName || rowData.name, Number(priceInput.value || 0));
    
    // Cancela o timer anterior se existir
    if (updateTimer) {
      clearTimeout(updateTimer);
    }
    
    // Agenda uma atualização com delay para evitar perda de foco
    updateTimer = setTimeout(() => {
      updateCalculatedValues();
    }, 300);
  });
  
  // Atualiza imediatamente quando perde o foco
  priceInput.addEventListener('blur', () => {
    if (updateTimer) {
      clearTimeout(updateTimer);
    }
    updateCalculatedValues();
  });
  
  // Display do custo por hora
  const costDisplay = document.createElement('div');
  costDisplay.className = 'card-cost';
  
  if (isFinite(rowData.costPerHour)) {
    const cost = rowData.costPerHour;
    costDisplay.textContent = `💎 ${formatNumber(cost, 2)} gold/h`;
    
    // Adiciona classes para cores baseadas no custo
    if (cost > 1000) {
      costDisplay.classList.add('expensive');
    } else if (cost < 500) {
      costDisplay.classList.add('cheap');
    }
  } else {
    costDisplay.textContent = '💎 —';
  }
  
  priceSection.appendChild(priceInput);
  priceSection.appendChild(costDisplay);
  
  return priceSection;
}

// ===== CALCULADORA DE QUANTIDADE =====

/**
 * Popula o selector de itens com as opções disponíveis
 */
function populateItemSelector() {
  try {
    // Verifica se os elementos existem antes de tentar acessá-los
    if (!elements.itemSelector) {
      console.log('ℹ️ ItemSelector não encontrado - interface integrada');
      return;
    }
    
    if (!elements.customDropdown) {
      console.log('ℹ️ CustomDropdown não encontrado - interface integrada');
      return;
    }
  
  // Limpa as opções existentes
  elements.itemSelector.innerHTML = '<option value="">Escolha um item...</option>';
  elements.customDropdown.innerHTML = '';
  
  // Adiciona opção de reset no dropdown customizado
  const resetOption = document.createElement('div');
  resetOption.className = 'dropdown-option reset-option';
  resetOption.setAttribute('data-value', '');
  resetOption.innerHTML = `
    <span class="option-text">🔄 Escolha um item...</span>
  `;
  resetOption.addEventListener('click', () => {
    resetSelection();
  });
  elements.customDropdown.appendChild(resetOption);
  
  // Cria opções por tipo de arma (sem tier específico)
  const weaponOptions = [
    { name: 'Training Rod', type: 'arma', weaponType: 'Rod' },
    { name: 'Training Wand', type: 'arma', weaponType: 'Wand' },
    { name: 'Training Melee', type: 'arma', weaponType: 'Melee' },
    { name: 'Training Spear', type: 'arma', weaponType: 'Spear' },
    { name: 'Training Shield', type: 'escudo', weaponType: 'Shield' }
  ];
  
  // Adiciona as opções no select original (hidden)
  weaponOptions.forEach(weapon => {
    const option = document.createElement('option');
    option.value = weapon.name;
    option.textContent = weapon.name;
    option.setAttribute('data-weapon-type', weapon.weaponType);
    option.setAttribute('data-type', weapon.type);
    
    elements.itemSelector.appendChild(option);
  });
  
  // Cria opções no dropdown customizado
  weaponOptions.forEach(weapon => {
    const dropdownOption = document.createElement('div');
    dropdownOption.className = 'dropdown-option tier-animated-option';
    dropdownOption.setAttribute('data-value', weapon.name);
    dropdownOption.setAttribute('data-weapon-type', weapon.weaponType);
    dropdownOption.setAttribute('data-type', weapon.type);
    
    // Para itens Melee, cria um container especial com múltiplas imagens dos tiers
    if (weapon.weaponType === 'Melee') {
      dropdownOption.innerHTML = `
        <div class="tier-animated-container">
          <div class="melee-image-container">
            <img class="option-image tier-image" src="assets/spark_axe.gif" alt="Spark Axe" 
                 style="opacity: 1;" onerror="this.style.display='none'">
            <img class="option-image tier-image" src="assets/lightning_axe.gif" alt="Lightning Axe" 
                 style="opacity: 0;" onerror="this.style.display='none'">
            <img class="option-image tier-image" src="assets/inferno_axe.gif" alt="Inferno Axe" 
                 style="opacity: 0;" onerror="this.style.display='none'">
          </div>
        </div>
        <span class="option-text">${weapon.name}</span>
      `;
      
      // Adiciona classe especial para itens com animação de tier
      dropdownOption.classList.add('melee-tier-option');
    } else {
      // Para outros tipos, cria animação entre os tiers
      const weaponType = weapon.weaponType.toLowerCase();
      dropdownOption.innerHTML = `
        <div class="tier-animated-container">
          <img class="option-image tier-image" src="assets/spark_${weaponType}.gif" alt="Spark ${weapon.weaponType}" 
               style="opacity: 1;" onerror="this.style.display='none'">
          <img class="option-image tier-image" src="assets/lightning_${weaponType}.gif" alt="Lightning ${weapon.weaponType}" 
               style="opacity: 0;" onerror="this.style.display='none'">
          <img class="option-image tier-image" src="assets/inferno_${weaponType}.gif" alt="Inferno ${weapon.weaponType}" 
               style="opacity: 0;" onerror="this.style.display='none'">
        </div>
        <span class="option-text">${weapon.name}</span>
      `;
    }
    
    // Adiciona event listener para seleção
    dropdownOption.addEventListener('click', () => {
      selectCustomOption(weapon.name, weapon.weaponType);
    });
    
    elements.customDropdown.appendChild(dropdownOption);
  });
  
  // Configura event listeners do custom select
  setupCustomSelectListeners();
  
  console.log('✅ Item selector populado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao popular item selector:', error);
  }
}

/**
 * Configura os event listeners para o select customizado
 */
function setupCustomSelectListeners() {
  if (!elements.customSelect || !elements.customDropdown) return;
  
  // Toggle dropdown ao clicar
  elements.customSelect.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita propagação do evento
    
    const isOpen = elements.customDropdown.classList.contains('open');
    if (isOpen) {
      closeCustomDropdown();
    } else {
      openCustomDropdown();
    }
  });
  
  // Fechar dropdown ao clicar fora
  document.addEventListener('click', (e) => {
    if (!elements.customSelect.contains(e.target)) {
      closeCustomDropdown();
    }
  });
  
  // Navegação por teclado
  elements.customSelect.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const isOpen = elements.customDropdown.classList.contains('open');
      if (isOpen) {
        closeCustomDropdown();
      } else {
        openCustomDropdown();
      }
    } else if (e.key === 'Escape') {
      closeCustomDropdown();
    }
  });
}

/**
 * Abre o dropdown customizado
 */
function openCustomDropdown() {
  elements.customDropdown.classList.add('open');
  elements.customSelect.classList.add('open');
  
  // Inicia animações para todas as opções com tiers no dropdown
  const tierOptions = elements.customDropdown.querySelectorAll('.tier-animated-option');
  tierOptions.forEach(option => {
    startTierAnimationForOption(option);
  });
}

/**
 * Fecha o dropdown customizado
 */
function closeCustomDropdown() {
  // Para todas as animações do dropdown
  const tierOptions = elements.customDropdown.querySelectorAll('.tier-animated-option');
  tierOptions.forEach(option => {
    if (option.tierInterval) {
      clearInterval(option.tierInterval);
      option.tierInterval = null;
    }
  });
  
  elements.customDropdown.classList.remove('open');
  elements.customSelect.classList.remove('open');
}

/**
 * Reseta a seleção do select customizado
 */
function resetSelection() {
  // Para todas as animações
  stopMeleeAnimation();
  stopTierAnimation();
  
  // Limpa o select original
  elements.itemSelector.value = '';
  
  // Restaura o texto padrão
  elements.selectedItem.innerHTML = '<span>Escolha um item...</span>';
  
  // Fecha o dropdown
  closeCustomDropdown();
  
  // Limpa a área de resultados (não mais necessário na interface integrada)
  
  // Esconde a seção de resultados
  const resultsSection = document.getElementById('resultsSection');
  if (resultsSection) {
    resultsSection.style.display = 'none';
  }
  
  // Re-renderiza os cards para mostrar todos
  renderCards();
}

/**
 * Seleciona uma opção no select customizado
 */
function selectCustomOption(value, weaponType) {
  // Para animações anteriores
  stopMeleeAnimation();
  stopTierAnimation();
  
  // Atualiza o select original (hidden)
  elements.itemSelector.value = value;
  
  // Atualiza a interface visual com animação dos tiers
  if (weaponType === 'Melee') {
    // Para itens Melee, cria um container com múltiplas imagens dos tiers (usando axe como representativo)
    elements.selectedItem.innerHTML = `
      <div class="tier-animated-container">
        <div class="melee-image-container">
          <img class="selected-image tier-image" src="assets/spark_axe.gif" alt="Spark Axe" 
               style="opacity: 1;" onerror="this.style.display='none'">
          <img class="selected-image tier-image" src="assets/lightning_axe.gif" alt="Lightning Axe" 
               style="opacity: 0;" onerror="this.style.display='none'">
          <img class="selected-image tier-image" src="assets/inferno_axe.gif" alt="Inferno Axe" 
               style="opacity: 0;" onerror="this.style.display='none'">
        </div>
      </div>
      <span>${value}</span>
    `;
  } else {
    // Para outros tipos, cria animação entre os tiers
    const weaponTypeLower = weaponType.toLowerCase();
    elements.selectedItem.innerHTML = `
      <div class="tier-animated-container">
        <img class="selected-image tier-image" src="assets/spark_${weaponTypeLower}.gif" alt="Spark ${weaponType}" 
             style="opacity: 1;" onerror="this.style.display='none'">
        <img class="selected-image tier-image" src="assets/lightning_${weaponTypeLower}.gif" alt="Lightning ${weaponType}" 
             style="opacity: 0;" onerror="this.style.display='none'">
        <img class="selected-image tier-image" src="assets/inferno_${weaponTypeLower}.gif" alt="Inferno ${weaponType}" 
             style="opacity: 0;" onerror="this.style.display='none'">
      </div>
      <span>${value}</span>
    `;
  }
  
  // Inicia a animação de alternância dos tiers
  startTierAnimation();
  
  // Fecha o dropdown
  closeCustomDropdown();
  
  // Dispara o evento de mudança
  const changeEvent = new Event('change', { bubbles: true });
  elements.itemSelector.dispatchEvent(changeEvent);
  
  // Calcula a quantidade se necessário
  calculateQuantity();
}

/**
 * Inicia a animação de alternância para itens Melee
 */
function startMeleeAnimation() {
  // Para a animação anterior se existir
  if (window.meleeAnimationInterval) {
    clearInterval(window.meleeAnimationInterval);
  }
  
  // Encontra todas as imagens Melee na interface
  const meleeImages = document.querySelectorAll('.melee-image');
  if (meleeImages.length === 0) return;
  
  let currentIndex = 0;
  const totalImages = 3; // Axe, Club, Sword
  
  // Inicia a animação de alternância
  window.meleeAnimationInterval = setInterval(() => {
    // Esconde todas as imagens
    meleeImages.forEach(img => {
      img.style.opacity = '0';
    });
    
    // Mostra apenas a imagem atual
    if (meleeImages[currentIndex]) {
      meleeImages[currentIndex].style.opacity = '1';
    }
    
    // Avança para a próxima imagem
    currentIndex = (currentIndex + 1) % totalImages;
  }, 800); // Alterna a cada 800ms
}

/**
 * Para a animação de alternância para itens Melee
 */
function stopMeleeAnimation() {
  if (window.meleeAnimationInterval) {
    clearInterval(window.meleeAnimationInterval);
    window.meleeAnimationInterval = null;
  }
}

/**
 * Inicia a animação de alternância entre tiers
 */
function startTierAnimation() {
  // Para a animação anterior se existir
  if (window.tierAnimationInterval) {
    clearInterval(window.tierAnimationInterval);
  }
  
  // Encontra todas as imagens de tier na interface
  const tierImages = document.querySelectorAll('.tier-image');
  if (tierImages.length === 0) return;
  
  let currentIndex = 0;
  const totalImages = 3; // Spark, Lightning, Inferno
  
  // Inicia a animação de alternância
  window.tierAnimationInterval = setInterval(() => {
    // Esconde todas as imagens
    tierImages.forEach(img => {
      img.style.opacity = '0';
    });
    
    // Mostra apenas as imagens do tier atual (cada grupo de 3)
    for (let i = currentIndex; i < tierImages.length; i += totalImages) {
      if (tierImages[i]) {
        tierImages[i].style.opacity = '1';
      }
    }
    
    // Avança para o próximo tier
    currentIndex = (currentIndex + 1) % totalImages;
  }, 800); // Alterna a cada 800ms
}

/**
 * Para a animação de alternância entre tiers
 */
function stopTierAnimation() {
  if (window.tierAnimationInterval) {
    clearInterval(window.tierAnimationInterval);
    window.tierAnimationInterval = null;
  }
}

/**
 * Inicia animação para imagens melee nos cards de tier
 */
function startMeleeAnimationForTierCards() {
  // Para a animação anterior se existir
  if (window.tierCardsMeleeAnimationInterval) {
    clearInterval(window.tierCardsMeleeAnimationInterval);
  }
  
  // Encontra todas as imagens melee nos cards de tier
  const meleeImages = document.querySelectorAll('.tier-card .melee-image');
  if (meleeImages.length === 0) return;
  
  let currentIndex = 0;
  const totalImages = 3; // Axe, Club, Sword
  
  // Garante que apenas a primeira imagem está visível inicialmente
  meleeImages.forEach((img, index) => {
    img.style.opacity = index % 3 === 0 ? '1' : '0';
  });
  
  // Inicia a animação de alternância
  window.tierCardsMeleeAnimationInterval = setInterval(() => {
    // Esconde todas as imagens
    meleeImages.forEach(img => {
      img.style.opacity = '0';
    });
    
    // Mostra apenas as imagens do tipo atual (cada grupo de 3)
    for (let i = currentIndex; i < meleeImages.length; i += totalImages) {
      if (meleeImages[i]) {
        meleeImages[i].style.opacity = '1';
      }
    }
    
    // Avança para o próximo tipo
    currentIndex = (currentIndex + 1) % totalImages;
  }, 800); // Alterna a cada 800ms
}

/**
 * Inicia animação para tiers em uma opção específica do dropdown
 */
function startTierAnimationForOption(optionElement) {
  // Verifica se já tem animação rodando para este elemento
  if (optionElement.tierInterval) {
    clearInterval(optionElement.tierInterval);
  }
  
  const tierImages = optionElement.querySelectorAll('.tier-image');
  if (tierImages.length === 0) return;
  
  // Garante que apenas a primeira imagem está visível inicialmente
  tierImages.forEach((img, index) => {
    img.style.opacity = index === 0 ? '1' : '0';
  });
  
  let currentIndex = 0;
  const totalImages = tierImages.length; // 3 tiers: Spark, Lightning, Inferno
  
  // Inicia a animação de alternância
  optionElement.tierInterval = setInterval(() => {
    // Esconde todas as imagens
    tierImages.forEach(img => {
      img.style.opacity = '0';
    });
    
    // Mostra apenas a imagem atual
    if (tierImages[currentIndex]) {
      tierImages[currentIndex].style.opacity = '1';
    }
    
    // Avança para a próxima imagem
    currentIndex = (currentIndex + 1) % totalImages;
  }, 800); // Alterna a cada 800ms para ser mais visível
}

/**
 * Inicia animação para itens Melee no KPI
 */
function startMeleeAnimationForKPI() {
  // Para a animação anterior se existir
  if (window.kpiMeleeAnimationInterval) {
    clearInterval(window.kpiMeleeAnimationInterval);
  }
  
  // Encontra todas as imagens Melee no KPI
  const meleeImages = document.querySelectorAll('.kpi-image.melee-image');
  if (meleeImages.length === 0) return;
  
  let currentIndex = 0;
  const totalImages = meleeImages.length;
  
  // Inicia a animação de alternância
  window.kpiMeleeAnimationInterval = setInterval(() => {
    // Esconde todas as imagens
    meleeImages.forEach(img => {
      img.style.opacity = '0';
    });
    
    // Mostra apenas a imagem atual
    if (meleeImages[currentIndex]) {
      meleeImages[currentIndex].style.opacity = '1';
    }
    
    // Avança para a próxima imagem
    currentIndex = (currentIndex + 1) % totalImages;
  }, 800); // Alterna a cada 800ms para o KPI
}

/**
 * Inicia animação para itens Melee no campo de quantidade
 */
function startMeleeAnimationForQuantity() {
  // Para a animação anterior se existir
  if (window.quantityMeleeAnimationInterval) {
    clearInterval(window.quantityMeleeAnimationInterval);
  }
  
  // Encontra todas as imagens Melee na quantidade
  const meleeImages = document.querySelectorAll('.quantity-melee-image.melee-image');
  if (meleeImages.length === 0) return;
  
  let currentIndex = 0;
  const totalImages = meleeImages.length;
  
  // Inicia a animação de alternância
  window.quantityMeleeAnimationInterval = setInterval(() => {
    // Esconde todas as imagens
    meleeImages.forEach(img => {
      img.style.opacity = '0';
    });
    
    // Mostra apenas a imagem atual
    if (meleeImages[currentIndex]) {
      meleeImages[currentIndex].style.opacity = '1';
    }
    
    // Avança para a próxima imagem
    currentIndex = (currentIndex + 1) % totalImages;
  }, 800); // Alterna a cada 800ms para a quantidade
}

/**
 * Extrai o tier do nome do item (Spark, Lightning, Inferno)
 * @param {string} itemName - Nome do item
 * @returns {string} Tier do item
 */
function extractTierFromName(itemName) {
  if (itemName.includes('Spark')) return 'Spark';
  if (itemName.includes('Lightning')) return 'Lightning';
  if (itemName.includes('Inferno')) return 'Inferno';
  return '';
}

/**
 * Extrai o tipo de arma do nome do item (Wand, Rod, Melee, Spear, Shield)
 * @param {string} itemName - Nome do item
 * @returns {string} Tipo de arma
 */
function extractWeaponType(itemName) {
  if (itemName.includes('Melee')) return 'Melee';
  if (itemName.includes('Wand')) return 'Wand';
  if (itemName.includes('Rod')) return 'Rod';
  if (itemName.includes('Spear')) return 'Spear';
  if (itemName.includes('Shield')) return 'Shield';
  if (itemName.includes('Axe')) return 'Axe';
  if (itemName.includes('Sword')) return 'Sword';
  if (itemName.includes('Club')) return 'Club';
  return '';
}

/**
 * Obtém o tipo de arma selecionado na calculadora de quantidade
 * @returns {string|null} Tipo de arma selecionado ou null se nenhum
 */
function getSelectedWeaponType() {
  if (!elements.itemSelector || !elements.itemSelector.value) {
    return null;
  }
  
  const selectedItem = elements.itemSelector.value;
  return extractWeaponType(selectedItem);
}

/**
 * Aplica preços predefinidos para todos os itens de um tipo de arma
 * @param {string} weaponType - Tipo de arma (Wand, Rod, Melee, Spear, Shield)
 */
function applyPredefinedPrices(weaponType) {
  // Aplica preços para todos os tiers do tipo de arma selecionado
  const tiers = ['Spark', 'Lightning', 'Inferno'];
  
  tiers.forEach(tier => {
    const price = TIER_PRICES[tier];
    if (price) {
      const itemName = `${tier} Training ${weaponType}`;
      updateItemPrice(itemName, price);
    }
  });
  
  // console.log(`💰 Preços aplicados para ${weaponType}: todos os tiers`);
}

/**
 * Obtém o percentual de bônus de um item específico
 * @param {string} itemName - Nome do item
 * @returns {number} Percentual de bônus (ex: -20 para -20%)
 */
function getItemBonusPct(itemName) {
  // Mapeamento dos bônus das armas
  const bonusMap = {
    // Spark Training (Tier 1) - bônus -10%
    'Spark Training Axe': -10,
    'Spark Training Sword': -10,
    'Spark Training Club': -10,
    'Spark Training Rod': -10,
    'Spark Training Wand': -10,
    'Spark Training Spear': -10,
    'Spark Training Melee': -10,
    
    // Lightning Training (Tier 2) - bônus -15%
    'Lightning Training Axe': -15,
    'Lightning Training Sword': -15,
    'Lightning Training Club': -15,
    'Lightning Training Rod': -15,
    'Lightning Training Wand': -15,
    'Lightning Training Spear': -15,
    'Lightning Training Melee': -15,
    
    // Inferno Training (Tier 3) - bônus -20%
    'Inferno Training Axe': -20,
    'Inferno Training Sword': -20,
    'Inferno Training Club': -20,
    'Inferno Training Rod': -20,
    'Inferno Training Wand': -20,
    'Inferno Training Spear': -20,
    'Inferno Training Melee': -20
  };
  
  return bonusMap[itemName] || 0; // Retorna 0 se não encontrar
}

/**
 * Calcula a quantidade necessária para o item selecionado
 */
function calculateQuantity() {
  console.log('🚀 calculateQuantity iniciada');
  
  console.log('ℹ️ Interface integrada - calculando quantidade...');
  
  const selectedItem = elements.itemSelector?.value || 'training_melee';
  const realHours = parseFloat(elements.targetHours.value || 0);
  
  console.log('📊 Parâmetros:', { selectedItem, realHours });
  
  if (realHours <= 0) {
    console.log('⚠️ Horas <= 0, saindo da função');
    return;
  }
  
  // Obtém dados do item selecionado ou usa o tipo padrão baseado no skill
  let weaponType, itemType;
  
  console.log('🔍 Determinando tipo de arma...');
  
  if (elements.itemSelector && elements.itemSelector.options.length > 0) {
    const selectedOption = elements.itemSelector.options[elements.itemSelector.selectedIndex];
    weaponType = selectedOption.getAttribute('data-weapon-type') || '';
    itemType = selectedOption.getAttribute('data-type') || 'arma';
    console.log('📋 Usando itemSelector:', { weaponType, itemType });
  } else {
    // Fallback para quando não há itemSelector (interface integrada)
    // Usa a função do skills-calculator para obter o tipo de skill
    console.log('🔄 Usando fallback para interface integrada');
    if (typeof getSelectedSkillType === 'function') {
      const skillType = getSelectedSkillType();
      console.log('🎯 Skill type selecionado:', skillType);
      const skillToWeaponMap = {
        'melee': 'Melee',
        'magic': 'Wand',
        'distance': 'Spear',
        'shielding': 'Shield'
      };
      weaponType = skillToWeaponMap[skillType] || 'Melee';
      console.log('⚔️ Weapon type mapeado:', weaponType);
    } else {
      weaponType = 'Melee'; // Padrão
      console.log('⚔️ Weapon type padrão:', weaponType);
    }
    itemType = 'arma';
  }
  
  console.log('🎯 Tipo de arma final:', weaponType);
  
  if (!weaponType) {
    console.error('❌ Tipo de arma não definido');
    return;
  }
  
  // Define cargas baseado no tipo de arma (usando valores médios para cálculo)
  let charges;
  if (weaponType === 'Rod' || weaponType === 'Wand') {
    charges = 7200; // Valor médio para Rod/Wand
  } else {
    charges = 10800; // Valor médio para outros tipos
  }
  
  // Para interface integrada, vamos calcular por tier individual
  // Não precisamos calcular uma quantidade média
  
  // Para interface integrada, não precisamos formatar resultado
  const timeInfo = `Baseado em ${formatMinutes(realHours * 60)} de treino`;
  
    // Calcula quantidade para todos os tiers
  const tiers = ['Spark', 'Lightning', 'Inferno'];
  const tierResults = [];
  
  tiers.forEach(tier => {
    // Dados fixos de cada tipo de arma
    const weaponData = {
      'Rod': {
        'Spark': { charges: 3600, bonus: -10 },
        'Lightning': { charges: 5400, bonus: -15 },
        'Inferno': { charges: 7200, bonus: -20 }
      },
      'Wand': {
        'Spark': { charges: 3600, bonus: -10 },
        'Lightning': { charges: 5400, bonus: -15 },
        'Inferno': { charges: 7200, bonus: -20 }
      },
      'Melee': {
        'Spark': { charges: 3600, bonus: -10 },
        'Lightning': { charges: 7200, bonus: -15 },
        'Inferno': { charges: 10800, bonus: -20 }
      },
      'Spear': {
        'Spark': { charges: 3600, bonus: -10 },
        'Lightning': { charges: 7200, bonus: -15 },
        'Inferno': { charges: 10800, bonus: -20 }
      },
      'Shield': {
        'Spark': { charges: 7200, bonus: 10 },
        'Lightning': { charges: 14400, bonus: 15 },
        'Inferno': { charges: 21600, bonus: 20 }
      }
    };
    
    const itemData = weaponData[weaponType]?.[tier];
    
    if (itemData) {
      const charges = itemData.charges;
      const bonusPct = itemData.bonus;
      const tierPrice = TIER_PRICES[tier];
      
      // Para armas: bônus NEGATIVO reduz intervalo (melhora velocidade)
      // Inferno -20% = intervalo 1.6s (mais rápido que 2s)
      const effectiveInterval = 2 * (1 + bonusPct / 100);
      const hoursPerUnit = (charges * effectiveInterval) / 3600;
      const unitsNeeded = Math.ceil(realHours / hoursPerUnit);
      const totalCost = unitsNeeded * tierPrice;
      
      // Tempo real para treinar as horas desejadas (considerando o bônus de velocidade)
      // Se você quer treinar 68h efetivas, com bônus vai levar menos tempo real
      // Fórmula: tempo_real = tempo_desejado × (intervalo_efetivo / intervalo_base)
      const timeToTrainDesiredHours = realHours * (effectiveInterval / 2);
      
      tierResults.push({
        tier,
        units: unitsNeeded,
        price: tierPrice,
        totalCost: totalCost,
        effectiveHours: hoursPerUnit,
        timeToTrainDesiredHours: timeToTrainDesiredHours
      });
    }
  });
  
  // Verifica se encontrou algum tier
  if (tierResults.length === 0) {
    console.error('❌ Dados dos tiers não encontrados');
    return;
  }
  
  // Mantém ordem fixa: Spark → Lightning → Inferno
  // tierResults.sort((a, b) => a.totalCost - b.totalCost); // Comentado para manter ordem fixa
  
  // Cria o HTML com todos os tiers
  let tierCardsHTML = '';
  
  // Encontra o mais barato para destacar
  const cheapestTier = tierResults.reduce((min, current) => 
    current.totalCost < min.totalCost ? current : min
  );
  
  tierResults.forEach((result) => {
    const isCheapest = result.totalCost === cheapestTier.totalCost;
    const tierClass = isCheapest ? 'tier-cheapest' : 'tier-option';
    
    tierCardsHTML += `
      <div class="tier-card ${tierClass}">
        <div class="tier-header">
          <div class="tier-image-container">
            ${weaponType === 'Melee' ? `
              <img class="tier-card-image melee-image" src="assets/${result.tier.toLowerCase()}_axe.gif" alt="Axe" 
                   onerror="this.style.display='none'">
              <img class="tier-card-image melee-image" src="assets/${result.tier.toLowerCase()}_club.gif" alt="Club" 
                   onerror="this.style.display='none'">
              <img class="tier-card-image melee-image" src="assets/${result.tier.toLowerCase()}_sword.gif" alt="Sword" 
                   onerror="this.style.display='none'">
            ` : `
              <img class="tier-card-image" src="assets/${result.tier.toLowerCase()}_${weaponType.toLowerCase()}.gif" 
                   alt="${result.tier} ${weaponType}" onerror="this.style.display='none'">
            `}
          </div>
          <div class="tier-name">${result.tier}</div>
        </div>
        <div class="tier-details">
          <div class="tier-units">${result.units} armas</div>
          <div class="tier-total ${isCheapest ? 'cheapest' : ''}">${result.totalCost.toLocaleString()} gold</div>
          <div class="tier-training-time">${realHours}h em ${result.timeToTrainDesiredHours.toFixed(1)}h</div>
        </div>
      </div>
    `;
  });
  
  // Interface integrada - não precisa atualizar quantityResult
  
  console.log('📊 Resultado final:', { realHours, weaponType });
  
  // Atualiza a interface integrada com as informações de treino
  console.log('🔄 Chamando updateIntegratedTrainingInfo...');
  updateIntegratedTrainingInfo(0, 0, realHours, weaponType);
  
  // Aplica preços predefinidos para o tipo de arma selecionado
  const selectedWeaponType = extractWeaponType(selectedItem);
  if (selectedWeaponType) {
    applyPredefinedPrices(selectedWeaponType);
    
    // Re-renderiza os cards para aplicar os novos preços
    setTimeout(() => {
      renderCards();
    }, 100);
  }
  
  console.log('✅ calculateQuantity finalizada');
}

/**
 * Atualiza a interface integrada com as informações de treino
 */
function updateIntegratedTrainingInfo(units, hoursPerUnit, totalHours, weaponType) {
  console.log('🔧 updateIntegratedTrainingInfo chamada com:', { units, hoursPerUnit, totalHours, weaponType });
  
  const weaponsQuantityDisplay = document.getElementById('weaponsQuantityDisplay');
  const totalCostDisplay = document.getElementById('totalCostDisplay');
  
  console.log('🔍 Elementos encontrados:', { 
    weaponsQuantityDisplay: !!weaponsQuantityDisplay, 
    totalCostDisplay: !!totalCostDisplay 
  });
  
  // Atualiza o breakdown de tempo por tier
  const tierTimeBreakdownDisplay = document.getElementById('tierTimeBreakdownDisplay');
  console.log('🔍 Procurando tierTimeBreakdownDisplay:', !!tierTimeBreakdownDisplay);
  
  if (tierTimeBreakdownDisplay) {
    // Calcula quantidade por tier usando a lógica da calculadora original
    console.log('🔍 Chamando calculateTierQuantities com:', { totalHours, weaponType });
    const tierQuantities = calculateTierQuantities(totalHours, weaponType);
    console.log('📊 Resultado de calculateTierQuantities:', tierQuantities);
    
    let timeBreakdownHTML = '';
    tierQuantities.forEach(tier => {
      // Calcula o tempo necessário para este tier
      // O tempo por tier deve ser proporcional ao tempo total, considerando a eficiência
      const efficiencyMultiplier = 1 + (tier.bonus / 100); // -10% = 0.9, -15% = 0.85, -20% = 0.8
      const timeForTier = totalHours * efficiencyMultiplier;
      const intervalText = tier.bonus > 0 ? `+${tier.bonus}% interval` : `${tier.bonus}% interval`;
      
      // Usa a mesma formatação de tempo da calculadora de skills
      const formattedTime = formatTrainingTime(timeForTier);
      
      timeBreakdownHTML += `
        <div class="tier-time-breakdown-item">
          <span class="tier-name">${tier.tier}:</span>
          <span class="tier-time">${formattedTime} (${intervalText})</span>
        </div>
      `;
    });
    tierTimeBreakdownDisplay.innerHTML = timeBreakdownHTML;
    console.log('✅ Time Breakdown HTML criado:', timeBreakdownHTML);
  } else {
    console.error('❌ tierTimeBreakdownDisplay não encontrado');
  }
  
  // Atualiza o breakdown de quantidade por tier
  const tierBreakdownDisplay = document.getElementById('tierBreakdownDisplay');
  if (tierBreakdownDisplay) {
    const tierQuantities = calculateTierQuantities(totalHours, weaponType);
    
    let breakdownHTML = '';
    tierQuantities.forEach(tier => {
      breakdownHTML += `
        <div class="tier-breakdown-item">
          <span class="tier-name">${tier.tier}:</span>
          <span class="tier-quantity">${tier.units}</span>
        </div>
      `;
    });
    tierBreakdownDisplay.innerHTML = breakdownHTML;
    console.log('✅ Quantity Breakdown HTML criado:', breakdownHTML);
  }
  
  // Atualiza o breakdown de custo por tier
  const tierCostBreakdownDisplay = document.getElementById('tierCostBreakdownDisplay');
  if (tierCostBreakdownDisplay) {
    const tierQuantities = calculateTierQuantities(totalHours, weaponType);
    const defaultPrices = {
      'Spark': 10000,
      'Lightning': 17000,
      'Inferno': 30000
    };
    
    let costBreakdownHTML = '';
    tierQuantities.forEach(tier => {
      const userPrice = getItemPrice(`${tier.tier} Training ${weaponType}`) || defaultPrices[tier.tier];
      const tierCost = tier.units * userPrice;
      costBreakdownHTML += `
        <div class="tier-cost-breakdown-item">
          <span class="tier-name">${tier.tier}</span>
          <span class="tier-cost">${tierCost.toLocaleString()}</span>
        </div>
      `;
    });
    tierCostBreakdownDisplay.innerHTML = costBreakdownHTML;
  }
}

/**
 * Calcula quantidade por tier usando a lógica da calculadora original
 */
function calculateTierQuantities(realHours, weaponType) {
  console.log('🔧 calculateTierQuantities chamada com:', { realHours, weaponType });
  
  if (!realHours || !weaponType) {
    console.error('❌ Parâmetros inválidos:', { realHours, weaponType });
    return [];
  }
  
  // Dados fixos de cada tipo de arma (igual à calculadora original)
  const weaponData = {
    'Rod': {
      'Spark': { charges: 3600, bonus: -10 },
      'Lightning': { charges: 5400, bonus: -15 },
      'Inferno': { charges: 7200, bonus: -20 }
    },
    'Wand': {
      'Spark': { charges: 3600, bonus: -10 },
      'Lightning': { charges: 5400, bonus: -15 },
      'Inferno': { charges: 7200, bonus: -20 }
    },
    'Melee': {
      'Spark': { charges: 3600, bonus: -10 },
      'Lightning': { charges: 7200, bonus: -15 },
      'Inferno': { charges: 10800, bonus: -20 }
    },
    'Spear': {
      'Spark': { charges: 3600, bonus: -10 },
      'Lightning': { charges: 7200, bonus: -15 },
      'Inferno': { charges: 10800, bonus: -20 }
    },
    'Shield': {
      'Spark': { charges: 7200, bonus: 10 },
      'Lightning': { charges: 14400, bonus: 15 },
      'Inferno': { charges: 21600, bonus: 20 }
    }
  };
  
  const tiers = ['Spark', 'Lightning', 'Inferno'];
  const tierResults = [];
  
  console.log('🔍 Procurando dados para weaponType:', weaponType);
  console.log('🔍 WeaponData disponível:', Object.keys(weaponData));
  
  tiers.forEach(tier => {
    const itemData = weaponData[weaponType]?.[tier];
    console.log(`🔍 Tier ${tier}:`, itemData);
    
    if (itemData) {
      const charges = itemData.charges;
      const bonusPct = itemData.bonus;
      
      // Para armas: bônus NEGATIVO reduz intervalo (melhora velocidade)
      // Para escudos: bônus POSITIVO aumenta intervalo (piora velocidade)
      let effectiveInterval;
      if (weaponType === 'Shield') {
        effectiveInterval = 2 * (1 + bonusPct / 100); // Escudos: mais lento
      } else {
        // Para armas: bônus negativo REDUZ o intervalo (treina mais rápido)
        // Ex: -10% = intervalo 90% do normal = 10% mais rápido
        effectiveInterval = 2 * (1 + bonusPct / 100);
      }
      
      const hoursPerUnit = (charges * effectiveInterval) / 3600;
      const unitsNeeded = Math.ceil(realHours / hoursPerUnit);
      
      console.log(`📊 ${tier}: charges=${charges}, bonus=${bonusPct}%, interval=${effectiveInterval}s, hoursPerUnit=${hoursPerUnit.toFixed(2)}h, units=${unitsNeeded}`);
      
      tierResults.push({
        tier,
        units: unitsNeeded,
        charges,
        bonus: bonusPct,
        hoursPerUnit: hoursPerUnit.toFixed(2)
      });
    }
  });
  
  console.log('📊 Resultado final:', tierResults);
  return tierResults;
}

/**
 * Calcula custo total usando preços da calculadora de custo x benefício
 */
function calculateTotalCostWithTierPrices(realHours, weaponType) {
  // Preços padrão (caso o usuário não tenha definido)
  const defaultPrices = {
    'Spark': 10000,
    'Lightning': 17000,
    'Inferno': 30000
  };
  
  // Tenta obter preços definidos pelo usuário
  const userPrices = {};
  const tiers = ['Spark', 'Lightning', 'Inferno'];
  
  tiers.forEach(tier => {
    const itemName = `${tier} Training ${weaponType}`;
    const userPrice = getItemPrice(itemName);
    userPrices[tier] = userPrice > 0 ? userPrice : defaultPrices[tier];
  });
  
  console.log('💰 Preços utilizados:', userPrices);
  
  // Calcula quantidade por tier
  const tierQuantities = calculateTierQuantities(realHours, weaponType);
  
  // Calcula custo total
  let totalCost = 0;
  tierQuantities.forEach(tier => {
    const tierCost = tier.units * userPrices[tier.tier];
    totalCost += tierCost;
    console.log(`💎 ${tier.tier}: ${tier.units} × ${userPrices[tier.tier].toLocaleString()} = ${tierCost.toLocaleString()}`);
  });
  
  return totalCost;
}

/**
 * Obtém o custo estimado por unidade baseado no tipo de arma (mantido para compatibilidade)
 */
function getEstimatedCostPerUnit(weaponType) {
  const costMap = {
    'Melee': 5000,    // Axe/Club/Sword
    'Wand': 8000,     // Magic weapons
    'Spear': 6000,    // Distance weapons
    'Shield': 3000    // Shield weapons
  };
  
  return costMap[weaponType] || 5000;
}

// ===== ATUALIZAÇÃO DE KPIs =====

/**
 * Atualiza os KPIs principais na interface (não usado mais, KPIs são fixos)
 * @param {Object} kpis - Objeto com os KPIs calculados
 */
function updateMainKPIs(kpis) {
  // KPIs agora são fixos no HTML, não precisam ser atualizados
}



// ===== GESTÃO DE PREÇOS =====

/**
 * Mapa de preços em memória (nome do item -> preço em gold)
 */
const prices = new Map();

/**
 * Obtém o preço de um item
 * @param {string} itemName - Nome do item
 * @returns {number} Preço do item ou 0 se não definido
 */
function getItemPrice(itemName) {
  return Number(prices.get(itemName) || 0);
}

/**
 * Atualiza o preço de um item
 * @param {string} itemName - Nome do item
 * @param {number} price - Novo preço
 */
function updateItemPrice(itemName, price) {
  prices.set(itemName, price);
}

// ===== CONFIGURAÇÃO DE EVENT LISTENERS =====

/**
 * Configura os event listeners para todos os controles
 */
function setupEventListeners() {
  try {
    const controlIds = [
      'targetHours', 'search', 'sortBy', 'sortDir'
    ];
    
    controlIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('input', renderCards);
        element.addEventListener('change', renderCards);
      }
    });
    
    // Event listener para targetHours também recalcula quantidade
    if (elements.targetHours) {
      elements.targetHours.addEventListener('input', () => {
        renderCards();
        if (elements.itemSelector && elements.itemSelector.value) {
          calculateQuantity();
        }
      });
    }
    
    // Event listener para o selector de itens
    if (elements.itemSelector) {
      elements.itemSelector.addEventListener('change', calculateQuantity);
    }
    
    console.log('✅ Event listeners configurados com sucesso');
  } catch (error) {
    console.error('❌ Erro ao configurar event listeners:', error);
  }
}

// ===== INICIALIZAÇÃO DA INTERFACE =====

/**
 * Aplica os valores padrão aos campos da interface
 */
function applyDefaultValues() {
  try {
    // Apenas targetHours precisa de valor padrão
    if (elements.targetHours) elements.targetHours.value = 68;
    console.log('✅ Valores padrão aplicados com sucesso');
  } catch (error) {
    console.error('❌ Erro ao aplicar valores padrão:', error);
  }
}

/**
 * Inicializa a interface do usuário
 */
function initializeUI() {
  try {
    // Inicializa elementos DOM
    initializeElements();
    
    // Configura event listeners
    setupEventListeners();
    
    // Aplica valores padrão
    applyDefaultValues();
    
    // Renderiza os cards iniciais
    renderCards();
    
    // Popula o selector de itens
    populateItemSelector();
    
    console.log('✅ UI inicializada com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar UI:', error);
    // Continua a execução mesmo com erro
  }
}

// ===== FUNÇÕES DE RENDERIZAÇÃO (DEFINIDAS APÓS INICIALIZAÇÃO) =====

/**
 * Atualiza apenas os valores calculados sem re-renderizar todos os cards
 * Preserva o foco dos inputs de preço
 */
function updateCalculatedValues() {
  // Salva o elemento com foco atual
  const activeElement = document.activeElement;
  const isInputFocused = activeElement && activeElement.classList.contains('price-input');
  let focusedItemName = null;
  
  if (isInputFocused) {
    focusedItemName = activeElement.getAttribute('data-item-name');
  }
  
  // Calcula os novos dados
  const rows = calculateAllRows();
  
  // Atualiza apenas os valores calculados em cada card existente
  rows.forEach((rowData) => {
    // Encontra o card pelo nome do item
    const card = document.querySelector(`input[data-item-name="${rowData.displayName || rowData.name}"]`)?.closest('.weapon-card');
    
    if (card) {
      // Atualiza estatísticas
      const chargesStat = card.querySelector('.stat-item:first-child .stat-value');
      if (chargesStat) {
        chargesStat.textContent = rowData.charges.toLocaleString();
      }
      
      const minutesStat = card.querySelector('.stat-item:last-child .stat-value');
      if (minutesStat) {
        minutesStat.textContent = formatMinutes(rowData.minutesEffPerUnit);
      }
      
      // Atualiza custo por hora
      const costDisplay = card.querySelector('.card-cost');
      if (costDisplay && isFinite(rowData.costPerHour)) {
        const cost = rowData.costPerHour;
        costDisplay.textContent = `💎 ${formatNumber(cost, 0)} gold/h`;
        
        // Atualiza classes de cor
        costDisplay.classList.remove('expensive', 'cheap');
        if (cost > 1000) {
          costDisplay.classList.add('expensive');
        } else if (cost < 500) {
          costDisplay.classList.add('cheap');
        }
      }
    }
  });
  
  // Restaura o foco se necessário
  if (isInputFocused && focusedItemName) {
    const inputToFocus = document.querySelector(`input[data-item-name="${focusedItemName}"]`);
    if (inputToFocus) {
      inputToFocus.focus();
      // Posiciona o cursor no final
      inputToFocus.setSelectionRange(inputToFocus.value.length, inputToFocus.value.length);
    }
  }
}

/**
 * Renderiza todos os cards com os dados calculados
 */
function renderCards() {
  try {
    // Verifica se as funções necessárias estão disponíveis
    if (typeof calculateAllRows !== 'function') {
      console.error('Função calculateAllRows não está disponível');
      return;
    }
    
    // Calcula todos os dados das linhas
    const rows = calculateAllRows();
    
    // Limpa os cards
    const cardsContainer = document.getElementById('weaponsCards');
    if (cardsContainer) {
      cardsContainer.innerHTML = "";
    
    // Adiciona os cards
    rows.forEach(rowData => {
      const card = createWeaponCard(rowData);
      cardsContainer.appendChild(card);
    });
    }
  } catch (error) {
    console.error('❌ Erro ao renderizar cards:', error);
  }
}

/**
 * Calcula todos os dados das linhas baseado nos parâmetros atuais
 * @returns {Array} Array com os dados calculados de todas as linhas
 */
function calculateAllRows() {
  // Verifica se as funções necessárias estão disponíveis
  if (typeof calculateMainKPIs !== 'function' || typeof calculateRowData !== 'function') {
    console.error('Funções de cálculo não estão disponíveis');
    return [];
  }
  
  // Parâmetros de entrada (agora só targetHours)
  const targetHours = parseFloat(elements.targetHours.value || "0");

  // KPIs gerais (simplificados)
  const mainKPIs = calculateMainKPIs(targetHours);
  updateMainKPIs(mainKPIs);

  // Obtém o tipo de arma selecionado na calculadora de quantidade
  const selectedWeaponType = getSelectedWeaponType();
  
  // Agrupa itens similares e filtra
  const groupedWeapons = groupSimilarItems ? groupSimilarItems(WEAPONS_DATA) : WEAPONS_DATA;
  const searchQuery = (elements.search.value || "").toLowerCase();
  
  let rows = groupedWeapons
    .filter(weapon => {
      const displayName = weapon.displayName || weapon.name;
      const matchesSearch = displayName.toLowerCase().includes(searchQuery);
      
      // Se há um tipo de arma selecionado, filtra apenas esse tipo
      if (selectedWeaponType) {
        const weaponType = extractWeaponType(displayName);
        return matchesSearch && weaponType === selectedWeaponType;
      }
      
      return matchesSearch;
    })
    .map(weapon => {
      const displayName = weapon.displayName || weapon.name;
      
      // Aplica preço predefinido baseado no tier ou usa preço customizado
      const tier = extractTierFromName(displayName);
      const predefinedPrice = TIER_PRICES[tier] || 0;
      const customPrice = getItemPrice(displayName);
      const finalPrice = customPrice > 0 ? customPrice : predefinedPrice;
      
      const rowData = calculateRowData(weapon, targetHours, finalPrice);
      // Adiciona o displayName para exibição
      rowData.displayName = weapon.displayName;
      return rowData;
    });

  // Aplica ordenação
  const sortBy = elements.sortBy.value;
  const sortDir = elements.sortDir.value;
  rows = sortRows(rows, sortBy, sortDir);

  // Atualiza KPIs finais
  const finalKPIs = calculateFinalKPIs(rows);

  return rows;
}


