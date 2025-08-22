/**
 * ARQUIVO 2.0 SKILLS-CALCULATOR.JS
 * 21/08/2025
 * 22:30
 */

// ===== CONSTANTES DO TIBIA (TibiaWiki) =====

/**
 * Constante A para cada tipo de skill
 */
const A_CONST = {
  ml: 1600,        // Magic Level
  melee: 50,       // Axe, Sword, Club
  distance: 30,    // Distance
  shielding: 100,  // Shielding
  fishing: 20      // Fishing
};

/**
 * Constante B para cada vocação e tipo de skill
 */
const B_CONST = {
  knight: {
    ml: 3.0,      // Magic Level
    melee: 1.1,   // Axe, Sword, Club
    distance: 1.4, // Distance
    shielding: 1.1,
    fist: 1.1,
    fishing: 1.1
  },
  paladin: {
    ml: 1.4,
    melee: 1.2,
    distance: 1.1,
    shielding: 1.1,
    fist: 1.2,
    fishing: 1.1
  },
  sorcerer: {
    ml: 1.1,
    melee: 2.0,
    distance: 2.0,
    shielding: 1.5,
    fist: 1.5,
    fishing: 1.1
  },
  druid: {
    ml: 1.1,
    melee: 1.8,
    distance: 1.8,
    shielding: 1.5,
    fist: 1.5,
    fishing: 1.1
  }
};

/**
 * Mapeia o tipo de skill para a constante correspondente
 */
function mapSkillToKind(skillType) {
  if (skillType === 'magic') return 'ml';
  if (skillType === 'distance') return 'distance';
  if (skillType === 'shielding') return 'shielding';
  // Melee (Axe, Sword, Club) usa a mesma curva
  return 'melee';
}

/**
 * Configurações de skills por vocação e tipo
 */
const SKILLS_CONFIG = {
  knight: {
    melee: {
      baseTime: 2, // segundos por hit
      trainingCost: 0, // custo por hit (gratuito)
      description: "Treino com dummy ou criaturas"
    },
    magic: {
      baseTime: 0.1, // segundos por ponto de mana (mais rápido que melee)
      trainingCost: 50, // custo por cast (mana potion)
      description: "Treino com magic spells"
    },
    distance: {
      baseTime: 2, // segundos por hit
      trainingCost: 0, // custo por hit (gratuito)
      description: "Treino com arco e flecha"
    },
    shielding: {
      baseTime: 2, // segundos por hit
      trainingCost: 0, // custo por hit (gratuito)
      description: "Treino com shield"
    }
  },
  sorcerer: {
    melee: {
      baseTime: 2,
      trainingCost: 0,
      description: "Treino com dummy ou criaturas"
    },
    magic: {
      baseTime: 0.1, // segundos por ponto de mana (mais rápido que melee)
      trainingCost: 50,
      description: "Treino com magic spells"
    },
    distance: {
      baseTime: 2,
      trainingCost: 0,
      description: "Treino com arco e flecha"
    },
    shielding: {
      baseTime: 2,
      trainingCost: 0,
      description: "Treino com shield"
    }
  },
  druid: {
    melee: {
      baseTime: 2,
      trainingCost: 0,
      description: "Treino com dummy ou criaturas"
    },
    magic: {
      baseTime: 0.1, // segundos por ponto de mana (mais rápido que melee)
      trainingCost: 50,
      description: "Treino com magic spells"
    },
    distance: {
      baseTime: 2,
      trainingCost: 0,
      description: "Treino com arco e flecha"
    },
    shielding: {
      baseTime: 2,
      trainingCost: 0,
      description: "Treino com shield"
    }
  },
  paladin: {
    melee: {
      baseTime: 2,
      trainingCost: 0,
      description: "Treino com dummy ou criaturas"
    },
    magic: {
      baseTime: 0.1, // segundos por ponto de mana (mais rápido que melee)
      trainingCost: 50,
      description: "Treino com magic spells"
    },
    distance: {
      baseTime: 2,
      trainingCost: 0,
      description: "Treino com arco e flecha"
    },
    shielding: {
      baseTime: 2,
      trainingCost: 0,
      description: "Treino com shield"
    }
  }
};

// ===== FUNÇÕES DE CÁLCULO =====

/**
 * Calcula o total de pontos acumulados até um certo nível de skill
 * @param {string} vocation - Vocação do personagem
 * @param {string} skillType - Tipo de skill
 * @param {number} level - Nível da skill
 * @returns {number} Total de pontos acumulados
 */
function totalPoints(vocation, skillType, level) {
  const kind = mapSkillToKind(skillType);
  const A = A_CONST[kind];
  const b = B_CONST[vocation][kind];
  const c = kind === 'ml' ? 0 : 10;
  
  return A * ((Math.pow(b, level - c) - 1) / (b - 1));
}

/**
 * Calcula a quantidade de pontos necessários para ir de um nível para outro
 * @param {string} vocation - Vocação do personagem
 * @param {string} skillType - Tipo de skill
 * @param {number} fromLevel - Nível atual
 * @param {number} toLevel - Nível desejado
 * @returns {number} Pontos necessários
 */
function pointsNeeded(vocation, skillType, fromLevel, toLevel) {
  if (toLevel <= fromLevel) return 0;
  return totalPoints(vocation, skillType, toLevel) - totalPoints(vocation, skillType, fromLevel);
}

/**
 * Calcula a experiência necessária para ir de um nível de skill para outro
 * @param {number} currentSkill - Skill atual
 * @param {number} targetSkill - Skill desejada
 * @param {string} vocation - Vocação do personagem
 * @param {string} skillType - Tipo de skill
 * @returns {number} Experiência total necessária
 */
function calculateSkillExperience(currentSkill, targetSkill, vocation, skillType) {
  if (currentSkill >= targetSkill) return 0;
  
  // Usa a fórmula correta do Tibia
  return pointsNeeded(vocation, skillType, currentSkill, targetSkill);
}

// Função para debug - vamos verificar os cálculos
function debugSkillCalculation(currentSkill, targetSkill, vocation, skillType) {
  console.log(`=== DEBUG: Skill ${currentSkill} → ${targetSkill} (${vocation} ${skillType}) ===`);
  
  const totalExp = calculateSkillExperience(currentSkill, targetSkill, vocation, skillType);
  const hitsNeeded = Math.ceil(totalExp);
  const timeSeconds = hitsNeeded * 2; // 2 segundos por hit
  const timeHours = timeSeconds / 3600;
  
  console.log(`Total exp needed: ${totalExp.toFixed(2)}`);
  console.log(`Hits needed: ${hitsNeeded}`);
  console.log(`Time needed (2s/hit): ${timeSeconds} seconds = ${timeHours.toFixed(2)} hours`);
  
  // Compara com a fórmula antiga para verificar
  const oldFormula = (targetSkill * targetSkill - targetSkill) / 2 - (currentSkill * currentSkill - currentSkill) / 2;
  console.log(`Old formula result: ${oldFormula} (incorreto)`);
  console.log(`New formula result: ${totalExp} (correto)`);
  
  return totalExp;
}

/**
 * Calcula o tempo necessário para treinar uma skill
 * @param {number} currentSkill - Skill atual
 * @param {number} targetSkill - Skill desejada
 * @param {string} vocation - Vocação do personagem
 * @param {string} skillType - Tipo de skill
 * @returns {Object} Objeto com tempo e hits necessários
 */
function calculateTrainingTime(currentSkill, targetSkill, vocation, skillType) {
  if (!SKILLS_CONFIG[vocation] || !SKILLS_CONFIG[vocation][skillType]) {
    throw new Error('Configuração de skill não encontrada');
  }
  
  const config = SKILLS_CONFIG[vocation][skillType];
  const totalExp = calculateSkillExperience(currentSkill, targetSkill, vocation, skillType);
  
  // Calcula hits necessários (1 exp por hit)
  const hitsNeeded = Math.ceil(totalExp);
  
  // Calcula tempo total em segundos
  const totalTimeSeconds = hitsNeeded * config.baseTime;
  
  // Converte para horas
  const totalTimeHours = totalTimeSeconds / 3600;
  
  return {
    hitsNeeded: hitsNeeded,
    totalTimeSeconds: totalTimeSeconds,
    totalTimeHours: totalTimeHours,
    config: config,
    effectiveExp: totalExp,
    baseExp: totalExp,
    effectiveTimePerHit: config.baseTime
  };
}

/**
 * Calcula o custo estimado do treino
 * @param {number} hitsNeeded - Quantidade de hits necessários
 * @param {Object} config - Configuração da skill
 * @returns {number} Custo total estimado
 */
function calculateTrainingCost(hitsNeeded, config) {
  return hitsNeeded * config.trainingCost;
}

/**
 * Formata o tempo em formato legível completo (anos, meses, dias, horas, minutos)
 * @param {number} hours - Tempo em horas
 * @returns {string} Tempo formatado
 */
function formatTrainingTime(hours) {
  if (hours < 1) {
    const minutes = Math.ceil(hours * 60);
    return `${minutes} minuto${minutes > 1 ? 's' : ''} (${hours.toFixed(1)} horas)`;
  }
  
  let result = '';
  let remainingHours = hours;
  
  // Anos (considerando 365 dias = 8760 horas)
  const years = Math.floor(remainingHours / 8760);
  if (years > 0) {
    result += `${years} ano${years > 1 ? 's' : ''} `;
    remainingHours %= 8760;
  }
  
  // Meses (considerando 30 dias = 720 horas)
  const months = Math.floor(remainingHours / 720);
  if (months > 0) {
    result += `${months} mês${months > 1 ? 'es' : ''} `;
    remainingHours %= 720;
  }
  
  // Dias
  const days = Math.floor(remainingHours / 24);
  if (days > 0) {
    result += `${days} dia${days > 1 ? 's' : ''} `;
    remainingHours %= 24;
  }
  
  // Horas
  const wholeHours = Math.floor(remainingHours);
  if (wholeHours > 0) {
    result += `${wholeHours}h `;
    remainingHours -= wholeHours;
  }
  
  // Minutos
  if (remainingHours > 0) {
    const minutes = Math.ceil(remainingHours * 60);
    if (minutes > 0) {
      result += `${minutes}min `;
    }
  }
  
  // Remove espaços extras e adiciona apenas as horas totais
  result = result.trim();
  if (result) {
    return `${result} (${hours.toFixed(1)} horas)`;
  }
  
  // Se não há resultado formatado, mostra apenas as horas
  return `${hours.toFixed(1)} horas`;
}

/**
 * Formata números grandes com separadores
 * @param {number} num - Número para formatar
 * @returns {string} Número formatado
 */
function formatNumber(num) {
  return num.toLocaleString('pt-BR');
}

// ===== INTERFACE DA CALCULADORA =====

/**
 * Elementos da interface
 */
const skillsElements = {

  skillTypeSelect: null,
  currentSkill: null,
  targetSkill: null,
  calculateBtn: null,
  resultsSection: null,

  displayCurrentSkill: null,
  displayTargetSkill: null,
  displaySkillDifference: null,
  displayTrainingTime: null,
  displayTrainingCost: null,
  displayHitsNeeded: null,
  // Elementos de informação

};

/**
 * Inicializa os elementos da calculadora de skills
 */
function initializeSkillsElements() {
  // Radio buttons de vocação
  skillsElements.vocationKnight = document.getElementById('vocationKnight');
  skillsElements.vocationPaladin = document.getElementById('vocationPaladin');
  skillsElements.vocationSorcerer = document.getElementById('vocationSorcerer');
  skillsElements.vocationDruid = document.getElementById('vocationDruid');
  
  // Radio buttons de tipo de skill
  skillsElements.skillTypeMelee = document.getElementById('skillTypeMelee');
  skillsElements.skillTypeMagic = document.getElementById('skillTypeMagic');
  skillsElements.skillTypeDistance = document.getElementById('skillTypeDistance');
  skillsElements.skillTypeShielding = document.getElementById('skillTypeShielding');
  skillsElements.currentSkill = document.getElementById('currentSkill');
  skillsElements.targetSkill = document.getElementById('targetSkill');
  skillsElements.calculateBtn = document.getElementById('calculateSkillsBtn');
  skillsElements.resultsSection = document.getElementById('skillsResultsSection');

  skillsElements.displayCurrentSkill = document.getElementById('displayCurrentSkill');
  skillsElements.displayTargetSkill = document.getElementById('displayTargetSkill');
  skillsElements.displaySkillDifference = document.getElementById('displaySkillDifference');
  skillsElements.displayTrainingTime = document.getElementById('displayTrainingTime');
  skillsElements.displayTrainingCost = document.getElementById('displayTrainingCost');
  skillsElements.displayHitsNeeded = document.getElementById('displayHitsNeeded');
  

}

/**
 * Configura os event listeners da calculadora de skills
 */
function setupSkillsEventListeners() {
  if (skillsElements.calculateBtn) {
    skillsElements.calculateBtn.addEventListener('click', calculateSkills);
  }
  
  // Validação em tempo real
  if (skillsElements.currentSkill) {
    skillsElements.currentSkill.addEventListener('input', validateSkillInputs);
  }
  
  if (skillsElements.targetSkill) {
    skillsElements.targetSkill.addEventListener('input', validateSkillInputs);
  }
  
  // Atualiza opções de skill baseado na vocação selecionada
  if (skillsElements.vocationKnight) {
    skillsElements.vocationKnight.addEventListener('change', updateSkillTypeOptions);
  }
  if (skillsElements.vocationPaladin) {
    skillsElements.vocationPaladin.addEventListener('change', updateSkillTypeOptions);
  }
  if (skillsElements.vocationSorcerer) {
    skillsElements.vocationSorcerer.addEventListener('change', updateSkillTypeOptions);
  }
  if (skillsElements.vocationDruid) {
    skillsElements.vocationDruid.addEventListener('change', updateSkillTypeOptions);
  }
  
  // Atualiza opções quando o tipo de skill for selecionado
  if (skillsElements.skillTypeMelee) {
    skillsElements.skillTypeMelee.addEventListener('change', validateSkillInputs);
  }
  if (skillsElements.skillTypeMagic) {
    skillsElements.skillTypeMagic.addEventListener('change', validateSkillInputs);
  }
  if (skillsElements.skillTypeDistance) {
    skillsElements.skillTypeDistance.addEventListener('change', validateSkillInputs);
  }
  if (skillsElements.skillTypeShielding) {
    skillsElements.skillTypeShielding.addEventListener('change', validateSkillInputs);
  }
}

/**
 * Valida os inputs de skill e atualiza o estado do botão
 */
function validateSkillInputs() {
  const current = parseFloat(skillsElements.currentSkill.value) || 0;
  const target = parseFloat(skillsElements.targetSkill.value) || 0;
  
  if (target > 0 && current >= target) {
    skillsElements.targetSkill.setCustomValidity('A skill desejada deve ser maior que a atual');
  } else {
    skillsElements.targetSkill.setCustomValidity('');
  }
  
  // Valida se todos os campos obrigatórios estão preenchidos
  validateCalculateButton();
}

/**
 * Valida se o botão de calcular deve estar ativo
 */
function validateCalculateButton() {
  const vocation = getSelectedVocation();
  const skillType = getSelectedSkillType();
  const current = parseFloat(skillsElements.currentSkill.value) || 0;
  const target = parseFloat(skillsElements.targetSkill.value) || 0;
  
  const isVocationSelected = vocation !== '';
  const isSkillTypeSelected = skillType !== '';
  const isCurrentSkillValid = current > 0;
  const isTargetSkillValid = target > 0 && target > current;
  
  const allFieldsValid = isVocationSelected && isSkillTypeSelected && isCurrentSkillValid && isTargetSkillValid;
  
  if (skillsElements.calculateBtn) {
    skillsElements.calculateBtn.disabled = !allFieldsValid;
    
    // Adiciona/remove classes CSS para feedback visual
    if (allFieldsValid) {
      skillsElements.calculateBtn.classList.remove('disabled');
      skillsElements.calculateBtn.classList.add('enabled');
    } else {
      skillsElements.calculateBtn.classList.remove('enabled');
      skillsElements.calculateBtn.classList.add('disabled');
    }
  }
}

/**
 * Obtém a vocação selecionada dos radio buttons
 */
function getSelectedVocation() {
  if (skillsElements.vocationKnight && skillsElements.vocationKnight.checked) return 'knight';
  if (skillsElements.vocationPaladin && skillsElements.vocationPaladin.checked) return 'paladin';
  if (skillsElements.vocationSorcerer && skillsElements.vocationSorcerer.checked) return 'sorcerer';
  if (skillsElements.vocationDruid && skillsElements.vocationDruid.checked) return 'druid';
  return '';
}

/**
 * Obtém o tipo de skill selecionado dos radio buttons
 */
function getSelectedSkillType() {
  if (skillsElements.skillTypeMelee && skillsElements.skillTypeMelee.checked) return 'melee';
  if (skillsElements.skillTypeMagic && skillsElements.skillTypeMagic.checked) return 'magic';
  if (skillsElements.skillTypeDistance && skillsElements.skillTypeDistance.checked) return 'distance';
  if (skillsElements.skillTypeShielding && skillsElements.skillTypeShielding.checked) return 'shielding';
  return '';
}

/**
 * Atualiza as opções de tipo de skill baseado na vocação selecionada
 */
function updateSkillTypeOptions() {
  const vocation = getSelectedVocation();
  
  if (vocation) {
    // Desmarca todos os tipos de skill primeiro
    if (skillsElements.skillTypeMelee) skillsElements.skillTypeMelee.checked = false;
    if (skillsElements.skillTypeMagic) skillsElements.skillTypeMagic.checked = false;
    if (skillsElements.skillTypeDistance) skillsElements.skillTypeDistance.checked = false;
    if (skillsElements.skillTypeShielding) skillsElements.skillTypeShielding.checked = false;
    
    // Aplica restrições baseadas na vocação
    if (vocation === 'knight') {
      // Knight: apenas Melee (Shielding em breve)
      if (skillsElements.skillTypeMelee) {
        skillsElements.skillTypeMelee.disabled = false;
        skillsElements.skillTypeMelee.checked = true; // Seleciona Melee por padrão
      }
      if (skillsElements.skillTypeMagic) skillsElements.skillTypeMagic.disabled = true;
      if (skillsElements.skillTypeDistance) skillsElements.skillTypeDistance.disabled = true;
      if (skillsElements.skillTypeShielding) skillsElements.skillTypeShielding.disabled = true; // Em breve
      
    } else if (vocation === 'sorcerer' || vocation === 'druid') {
      // Sorcerer/Druid: apenas Magic Level (Shielding em breve)
      if (skillsElements.skillTypeMelee) skillsElements.skillTypeMelee.disabled = true;
      if (skillsElements.skillTypeMagic) {
        skillsElements.skillTypeMagic.disabled = false;
        skillsElements.skillTypeMagic.checked = true; // Seleciona Magic por padrão
      }
      if (skillsElements.skillTypeDistance) skillsElements.skillTypeDistance.disabled = true;
      if (skillsElements.skillTypeShielding) skillsElements.skillTypeShielding.disabled = true; // Em breve
      
    } else if (vocation === 'paladin') {
      // Paladin: apenas Distance (Shielding em breve)
      if (skillsElements.skillTypeMelee) skillsElements.skillTypeMelee.disabled = true;
      if (skillsElements.skillTypeMagic) skillsElements.skillTypeMagic.disabled = true;
      if (skillsElements.skillTypeDistance) {
        skillsElements.skillTypeDistance.disabled = false;
        skillsElements.skillTypeDistance.checked = true; // Seleciona Distance por padrão
      }
      if (skillsElements.skillTypeShielding) skillsElements.skillTypeShielding.disabled = true; // Em breve
    }
  } else {
    // Desabilita todos os tipos de skill
    if (skillsElements.skillTypeMelee) skillsElements.skillTypeMelee.disabled = true;
    if (skillsElements.skillTypeMagic) skillsElements.skillTypeMagic.disabled = true;
    if (skillsElements.skillTypeDistance) skillsElements.skillTypeDistance.disabled = true;
    if (skillsElements.skillTypeShielding) skillsElements.skillTypeShielding.disabled = true;
  }
  
  // Valida o botão após atualizar as opções
  validateCalculateButton();
}





/**
 * Calcula as skills e exibe os resultados
 */
function calculateSkills() {
  // Valida inputs
  const vocation = getSelectedVocation();
  const skillType = getSelectedSkillType();
  const currentSkill = parseFloat(skillsElements.currentSkill.value);
  const targetSkill = parseFloat(skillsElements.targetSkill.value);
  
  if (!vocation || !skillType || isNaN(currentSkill) || isNaN(targetSkill)) {
    alert('Por favor, preencha todos os campos corretamente.');
    return;
  }
  
  if (currentSkill >= targetSkill) {
    alert('A skill desejada deve ser maior que a atual.');
    return;
  }
  
  try {
    // Debug: verifica os cálculos
    debugSkillCalculation(currentSkill, targetSkill, vocation, skillType);
    
    // Calcula tempo de treino
    const trainingData = calculateTrainingTime(currentSkill, targetSkill, vocation, skillType);
    
    // Calcula custo
    const totalCost = calculateTrainingCost(trainingData.hitsNeeded, trainingData.config);
    
    // Exibe resultados
    displaySkillsResults(currentSkill, targetSkill, trainingData, totalCost);
    
    // Mostra a seção de resultados
    skillsElements.resultsSection.style.display = 'block';
    
  } catch (error) {
    console.error('Erro ao calcular skills:', error);
    alert('Erro ao calcular skills. Verifique os dados inseridos.');
  }
}

/**
 * Mapeia o tipo de skill para o tipo de arma correspondente
 */
function mapSkillTypeToWeaponType(skillType) {
  const skillToWeaponMap = {
    'melee': 'Melee',
    'magic': 'Wand',
    'distance': 'Spear',
    'shielding': 'Shield'
  };
  
  return skillToWeaponMap[skillType] || 'Melee';
}

/**
 * Atualiza a calculadora de treino com o tempo calculado das skills
 */
function updateTrainingCalculator(trainingTimeHours) {
  const trainingInfoIntegrated = document.getElementById('trainingInfoIntegrated');
  const skillTypeBadgeIntegrated = document.getElementById('skillTypeBadgeIntegrated');
  
  if (trainingInfoIntegrated) {
    // Atualiza o valor do input hidden para a calculadora de treino
    const targetHoursInput = document.getElementById('targetHours');
    if (targetHoursInput) {
      targetHoursInput.value = trainingTimeHours.toFixed(1);
    }
    
    // Obtém o tipo de skill selecionado
    const selectedSkillType = getSelectedSkillType();
    const weaponType = mapSkillTypeToWeaponType(selectedSkillType);
    
    // Atualiza as informações de tipo
    if (skillTypeBadgeIntegrated) {
      skillTypeBadgeIntegrated.textContent = selectedSkillType.toUpperCase();
    }
    
    // Mostra a seção de informações integradas
    trainingInfoIntegrated.style.display = 'block';
    
    // Calcula automaticamente a quantidade de armas
    calculateTrainingQuantity(weaponType);
  }
}

/**
 * Calcula automaticamente a quantidade de armas necessárias
 */
function calculateTrainingQuantity(weaponType) {
  console.log('🔧 Calculando quantidade para:', weaponType);
  
  // Chama diretamente a função de cálculo da UI
  if (typeof calculateQuantity === 'function') {
    console.log('✅ Chamando calculateQuantity diretamente');
    calculateQuantity();
  } else {
    console.error('❌ Função calculateQuantity não encontrada');
    
    // Fallback: simula a seleção do item
    const itemSelector = document.getElementById('itemSelector');
    if (itemSelector) {
      // Cria uma opção temporária para o tipo de arma
      const tempOption = document.createElement('option');
      tempOption.value = `training_${weaponType.toLowerCase()}`;
      tempOption.textContent = `Training ${weaponType}`;
      tempOption.setAttribute('data-weapon-type', weaponType);
      tempOption.setAttribute('data-type', 'arma');
      
      // Adiciona a nova opção
      itemSelector.appendChild(tempOption);
      itemSelector.value = tempOption.value;
      
      console.log('📝 ItemSelector configurado:', tempOption.value);
      
      // Dispara o evento de mudança para calcular
      const changeEvent = new Event('change');
      itemSelector.dispatchEvent(changeEvent);
    } else {
      console.error('❌ ItemSelector não encontrado');
    }
  }
}

/**
 * Exibe os resultados do cálculo
 */
function displaySkillsResults(currentSkill, targetSkill, trainingData, totalCost) {
  const difference = targetSkill - currentSkill;
  
  // Atualiza estatísticas
  skillsElements.displayCurrentSkill.textContent = currentSkill;
  skillsElements.displayTargetSkill.textContent = targetSkill;
  skillsElements.displaySkillDifference.textContent = difference;
  
  // Atualiza informações de treino
  skillsElements.displayTrainingTime.textContent = formatTrainingTime(trainingData.totalTimeHours);
  
  // Atualiza o tempo base da calculadora de treino
  updateTrainingCalculator(trainingData.totalTimeHours);
}

/**
 * Inicializa a calculadora de skills
 */
function initializeSkillsCalculator() {
  initializeSkillsElements();
  setupSkillsEventListeners();
  
  // Aplica valores padrão
  if (skillsElements.currentSkill) skillsElements.currentSkill.value = '40';
  if (skillsElements.targetSkill) skillsElements.targetSkill.value = '70';
  
  // Inicializa tipos de skill como desabilitados
  if (skillsElements.skillTypeMelee) skillsElements.skillTypeMelee.disabled = true;
  if (skillsElements.skillTypeMagic) skillsElements.skillTypeMagic.disabled = true;
  if (skillsElements.skillTypeDistance) skillsElements.skillTypeDistance.disabled = true;
  if (skillsElements.skillTypeShielding) skillsElements.skillTypeShielding.disabled = true;
  
  // Desabilita o botão de calcular inicialmente
  if (skillsElements.calculateBtn) {
    skillsElements.calculateBtn.disabled = true;
    skillsElements.calculateBtn.classList.add('disabled');
  }
  
  // Chama updateSkillTypeOptions para configurar corretamente
  updateSkillTypeOptions();
}

// ===== INICIALIZAÇÃO =====

// Inicializa quando o DOM estiver carregado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSkillsCalculator);
} else {
  initializeSkillsCalculator();
}
