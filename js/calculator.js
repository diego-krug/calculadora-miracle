/**
 * ARQUIVO 2.0 CALCULATOR.JS
 * 21/08/2025
 * 22:30
 */

// ===== CONSTANTES FIXAS =====

/**
 * Intervalo base fixo em segundos por carga
 */
var BASE_INTERVAL = 2;

// ===== FUNÇÕES UTILITÁRIAS MATEMÁTICAS =====

/**
 * Arredonda para cima números positivos, retorna 0 para valores inválidos
 * @param {number} n - Número a ser arredondado
 * @returns {number} Número arredondado para cima ou 0
 */
function ceilPositive(n) {
  return (!isFinite(n) || n <= 0) ? 0 : Math.ceil(n);
}

/**
 * Formata número com casas decimais específicas
 * @param {number} n - Número a ser formatado
 * @param {number} decimals - Número de casas decimais
 * @returns {string} Número formatado ou "–" se inválido
 */
function formatNumber(n, decimals = 2) {
  return isFinite(n) ? Number(n).toFixed(decimals) : "–";
}

/**
 * Formata minutos no formato "Xh Ym" para valores grandes, ou apenas "Ym" para valores pequenos
 * @param {number} minutes - Minutos em formato decimal
 * @returns {string} Minutos formatados ou "–" se inválido
 */
function formatMinutes(minutes) {
  if (!isFinite(minutes) || minutes <= 0) return "–";
  
  if (minutes < 60) {
    // Menos de 1 hora: mostra apenas minutos
    return `${Math.round(minutes)}m`;
  } else {
    // 1 hora ou mais: mostra "Xh Ym"
    const hours = (minutes / 60) | 0;
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  }
}

// ===== CÁLCULOS DE INTERVALO =====

/**
 * Calcula o intervalo efetivo para um item específico
 * @param {Object} weapon - Dados do item
 * @returns {number} Intervalo efetivo em segundos
 */
function calculateEffectiveInterval(weapon) {
  const isShield = weapon.bonus_type === 'shielding_gain';
  
  if (isShield) {
    // Escudos usam o intervalo base (sem redução)
    return BASE_INTERVAL;
  } else {
    // Armas: base × (1 + bônus_item) - sem bônus global
    const itemBonus = Number(weapon.bonus_pct || 0) / 100;
    return BASE_INTERVAL * (1 + itemBonus);
  }
}

/**
 * Calcula os minutos por unidade baseado no tempo real
 * @param {number} charges - Número de cargas do item
 * @param {number} effectiveInterval - Intervalo efetivo em segundos
 * @returns {number} Minutos por unidade
 */
function calculateMinutesPerUnit(charges, effectiveInterval) {
  return (charges * effectiveInterval) / 60; // Converte segundos para minutos
}

/**
 * Calcula os minutos efetivos por unidade (ganho real)
 * @param {number} minutesPerUnit - Minutos por unidade (tempo)
 * @param {Object} weapon - Dados do item
 * @returns {number} Minutos efetivos por unidade
 */
function calculateEffectiveMinutesPerUnit(minutesPerUnit, weapon) {
  const isShield = weapon.bonus_type === 'shielding_gain';
  
  if (isShield) {
    // Escudos: multiplicado por (1 + bônus_item)
    const itemBonus = Number(weapon.bonus_pct || 0) / 100;
    return minutesPerUnit * (1 + itemBonus);
  } else {
    // Armas: igual ao tempo
    return minutesPerUnit;
  }
}

// ===== CÁLCULOS DE ALVO E UNIDADES =====

/**
 * Calcula o alvo real (sempre as horas nominais, sem reduções globais)
 * @param {number} targetHours - Horas desejadas (nominais)
 * @returns {number} Horas alvo (sempre igual ao nominal)
 */
function calculateWeaponTarget(targetHours) {
  return targetHours; // Sem reduções globais, sempre usa o valor nominal
}

/**
 * Calcula as unidades necessárias baseado no tempo real de treino (nova versão)
 * @param {number} realHours - Horas reais que ficará treinando (sem bônus)
 * @param {Object} weapon - Dados do item
 * @returns {number} Unidades necessárias
 */
function calculateUnitsForRealTime(realHours, weapon) {
  // Tempo base por unidade (sem bônus): cargas × 2 segundos ÷ 3600 = horas
  const charges = Number(weapon.charges || 0);
  const baseHoursPerUnit = (charges * 2) / 3600;
  
  // Unidades necessárias = tempo real ÷ tempo base por unidade
  return baseHoursPerUnit > 0 ? (realHours / baseHoursPerUnit) : 0;
}

/**
 * Calcula as unidades necessárias para atingir o alvo (versão para cards de comparação)
 * @param {number} targetHours - Horas alvo
 * @param {number} minutesPerUnit - Minutos por unidade
 * @param {Object} weapon - Dados do item
 * @returns {number} Unidades necessárias
 */
function calculateUnitsNeeded(targetHours, minutesPerUnit, weapon) {
  const isShield = weapon.bonus_type === 'shielding_gain';
  
  // Para escudos: usa minutos efetivos (ganho)
  // Para armas: usa minutos de tempo
  const effectiveMinutes = isShield ? 
    calculateEffectiveMinutesPerUnit(minutesPerUnit, weapon) : 
    minutesPerUnit;
  
  // Converte horas alvo para minutos para fazer a divisão
  const targetMinutes = targetHours * 60;
  
  return effectiveMinutes > 0 ? (targetMinutes / effectiveMinutes) : 0;
}

// ===== CÁLCULOS DE CUSTO =====

/**
 * Calcula o custo por hora efetiva
 * @param {number} price - Preço do item em gold
 * @param {number} effectiveMinutesPerUnit - Minutos efetivos por unidade
 * @returns {number} Custo por hora efetiva
 */
function calculateCostPerHour(price, effectiveMinutesPerUnit) {
  // Converte minutos para horas para calcular custo/hora
  const effectiveHoursPerUnit = effectiveMinutesPerUnit / 60;
  return effectiveHoursPerUnit > 0 ? price / effectiveHoursPerUnit : Infinity;
}

// ===== CÁLCULO COMPLETO DE UMA LINHA =====

/**
 * Calcula todos os valores para uma linha específica da tabela
 * @param {Object} weapon - Dados do item
 * @param {number} targetHours - Horas desejadas (nominais)
 * @param {number} price - Preço do item em gold
 * @returns {Object} Objeto com todos os dados calculados
 */
function calculateRowData(weapon, targetHours, price) {
  // Cálculo do intervalo efetivo (cada arma tem seu próprio bônus)
  const effectiveInterval = calculateEffectiveInterval(weapon);
  
  // Minutos por unidade (tempo passado)
  const charges = Number(weapon.charges || 0);
  const minutesPerUnit = calculateMinutesPerUnit(charges, effectiveInterval);
  
  // Minutos efetivos por unidade (ganho)
  const effectiveMinutesPerUnit = calculateEffectiveMinutesPerUnit(minutesPerUnit, weapon);
  
  // Unidades necessárias (sempre usa targetHours)
  const unitsNeeded = calculateUnitsNeeded(targetHours, minutesPerUnit, weapon);
  
  // Cálculo de custo
  const costPerHour = calculateCostPerHour(price, effectiveMinutesPerUnit);
  
  return {
    name: weapon.name,
    type: weapon.bonus_type === 'shielding_gain' ? "Escudo" : "Arma",
    charges,
    finalInterval: effectiveInterval,
    minutesPerUnit,
    minutesEffPerUnit: effectiveMinutesPerUnit,
    unitsNeeded: ceilPositive(unitsNeeded),
    price,
    costPerHour
  };
}

// ===== AGRUPAMENTO DE ITENS =====

/**
 * Agrupa itens similares (Axe, Club, Sword) para reduzir registros
 * @param {Array} weaponsData - Array de dados das armas
 * @returns {Array} Array com itens agrupados
 */
function groupSimilarItems(weaponsData) {
  const groups = new Map();
  
  weaponsData.forEach(weapon => {
    // Determina o tipo base do item (sem Training)
    const baseName = weapon.name.replace(' Training', '');
    const parts = baseName.split(' ');
    const tier = parts[0]; // Spark, Lightning, Inferno
    const type = parts[1]; // Axe, Club, Sword, Rod, Wand, Spear, Shield
    
    // Agrupa Axe, Club e Sword no mesmo grupo
    let groupType = type;
    if (['Axe', 'Club', 'Sword'].includes(type)) {
      groupType = 'Melee'; // Agrupa como "Melee"
    }
    
    const groupKey = `${tier}_${groupType}`;
    
    if (!groups.has(groupKey)) {
      // Cria um novo grupo baseado no primeiro item
      const groupItem = {
        ...weapon,
        name: `${tier} Training ${groupType}`,
        displayName: getGroupDisplayName(tier, groupType),
        originalType: type,
        isGroup: groupType === 'Melee'
      };
      groups.set(groupKey, groupItem);
    }
  });
  
  return Array.from(groups.values());
}

/**
 * Gera o nome de exibição para grupos
 * @param {string} tier - Tier do item (Spark, Lightning, Inferno)
 * @param {string} groupType - Tipo do grupo (Melee, Rod, Wand, etc.)
 * @returns {string} Nome de exibição formatado
 */
function getGroupDisplayName(tier, groupType) {
  if (groupType === 'Melee') {
    return `${tier} Training Melee`;
  }
  return `${tier} Training ${groupType}`;
}

/**
 * Mapeia o nome do grupo para uma imagem representativa
 * @param {string} groupName - Nome do grupo
 * @returns {string} Nome do arquivo de imagem
 */
function getGroupImageName(groupName) {
  // Para grupos Melee, usa a imagem do Axe como representativo
  if (groupName.includes('Melee')) {
    return groupName.replace('Melee', 'Axe').replace(' Training ', '_').toLowerCase() + '.gif';
  }
  
  // Para outros itens, usa o nome normal
  return groupName.replace(' Training ', '_').toLowerCase() + '.gif';
}

// ===== CÁLCULOS DE KPIs =====

/**
 * Calcula os KPIs principais baseado nos parâmetros atuais
 * @param {number} targetHours - Horas desejadas (nominais)
 * @returns {Object} Objeto com os KPIs calculados
 */
function calculateMainKPIs(targetHours) {
  // Alvo sempre igual ao nominal (sem reduções globais)
  const weaponTarget = calculateWeaponTarget(targetHours);
  
  return {
    weaponTarget
  };
}

/**
 * Calcula os KPIs finais baseado nos dados das linhas
 * @param {Array} rows - Array com os dados calculados das linhas
 * @returns {Object} Objeto com os KPIs finais
 */
function calculateFinalKPIs(rows) {
  // Item mais barato
  const cheapest = rows
    .filter(row => isFinite(row.costPerHour) && row.costPerHour > 0)
    .sort((a, b) => a.costPerHour - b.costPerHour)[0];
  
  // Item com maior duração
  const longest = [...rows].sort((a, b) => b.minutesPerUnit - a.minutesPerUnit)[0];
  
  return {
    cheapest: cheapest ? {
      name: cheapest.name,
      costPerHour: cheapest.costPerHour
    } : null,
    longest: longest ? {
      name: longest.name,
      minutesPerUnit: longest.minutesPerUnit
    } : null
  };
}

// ===== ORDENAÇÃO =====

/**
 * Ordena as linhas baseado nos critérios selecionados
 * @param {Array} rows - Array com os dados das linhas
 * @param {string} sortBy - Campo para ordenação
 * @param {string} sortDir - Direção da ordenação ('asc' ou 'desc')
 * @returns {Array} Array ordenado
 */
function sortRows(rows, sortBy, sortDir) {
  const direction = sortDir === 'desc' ? -1 : 1;

  return rows.sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'name':
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;
      case 'minutesPerUnit':
        valueA = a.minutesPerUnit;
        valueB = b.minutesPerUnit;
        break;
      case 'minutesEffPerUnit':
        valueA = a.minutesEffPerUnit;
        valueB = b.minutesEffPerUnit;
        break;
      default: // costPerHour
        valueA = a.costPerHour;
        valueB = b.costPerHour;
    }

    if (valueA === valueB) return 0;
    return (valueA > valueB ? 1 : -1) * direction;
  });
}
