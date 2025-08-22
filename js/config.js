/**
 * ===== CONFIGURAÇÕES E DADOS =====
 * ARQUIVO 2.0 CONFIG.JS
 * 21/08/2025
 * 22:30
 * 
 * Arquivo responsável por armazenar todas as configurações,
 * dados dos itens e constantes da aplicação
 */

// ===== DADOS DOS ITENS DE TREINO =====

/**
 * Array com todos os dados dos itens de treino
 * Cada item contém: nome, ataque, defesa, mãos, cargas, peso, texto do bônus, tipo do bônus, percentual do bônus
 */
const WEAPONS_DATA = [
  // ===== SPARK TRAINING (TIER 1) =====
  {
    name: "Spark Training Axe",
    atk: 5,
    def: 0,
    hands: 1,
    charges: 3600,
    weight: 10.00,
    bonus_text: "Attack Interval -10%",
    bonus_type: "attack_interval",
    bonus_pct: -10
  },
  {
    name: "Spark Training Sword",
    atk: 5,
    def: 0,
    hands: 1,
    charges: 3600,
    weight: 10.00,
    bonus_text: "Attack Interval -10%",
    bonus_type: "attack_interval",
    bonus_pct: -10
  },
  {
    name: "Spark Training Club",
    atk: 5,
    def: 0,
    hands: 1,
    charges: 3600,
    weight: 10.00,
    bonus_text: "Attack Interval -10%",
    bonus_type: "attack_interval",
    bonus_pct: -10
  },
  {
    name: "Spark Training Rod",
    atk: 0,
    def: 0,
    hands: 1,
    charges: 3600,
    weight: 10.00,
    bonus_text: "Attack Interval -10%",
    bonus_type: "attack_interval",
    bonus_pct: -10
  },
  {
    name: "Spark Training Wand",
    atk: 0,
    def: 0,
    hands: 1,
    charges: 3600,
    weight: 10.00,
    bonus_text: "Attack Interval -10%",
    bonus_type: "attack_interval",
    bonus_pct: -10
  },
  {
    name: "Spark Training Spear",
    atk: 10,
    def: 0,
    hands: 1,
    charges: 3600,
    weight: 10.00,
    bonus_text: "Attack Interval -10%",
    bonus_type: "attack_interval",
    bonus_pct: -10
  },
  {
    name: "Spark Training Shield",
    atk: 0,
    def: 10,
    hands: 1,
    charges: 7200,
    weight: 10.00,
    bonus_text: "Shielding Gain +10%",
    bonus_type: "shielding_gain",
    bonus_pct: 10
  },

  // ===== LIGHTNING TRAINING (TIER 2) =====
  {
    name: "Lightning Training Axe",
    atk: 5,
    def: 0,
    hands: 1,
    charges: 7200,
    weight: 10.00,
    bonus_text: "Attack Interval -15%",
    bonus_type: "attack_interval",
    bonus_pct: -15
  },
  {
    name: "Lightning Training Sword",
    atk: 5,
    def: 0,
    hands: 1,
    charges: 7200,
    weight: 10.00,
    bonus_text: "Attack Interval -15%",
    bonus_type: "attack_interval",
    bonus_pct: -15
  },
  {
    name: "Lightning Training Club",
    atk: 5,
    def: 0,
    hands: 1,
    charges: 7200,
    weight: 10.00,
    bonus_text: "Attack Interval -15%",
    bonus_type: "attack_interval",
    bonus_pct: -15
  },
  {
    name: "Lightning Training Rod",
    atk: 0,
    def: 0,
    hands: 1,
    charges: 5400,
    weight: 10.00,
    bonus_text: "Attack Interval -15%",
    bonus_type: "attack_interval",
    bonus_pct: -15
  },
  {
    name: "Lightning Training Wand",
    atk: 0,
    def: 0,
    hands: 1,
    charges: 5400,
    weight: 10.00,
    bonus_text: "Attack Interval -15%",
    bonus_type: "attack_interval",
    bonus_pct: -15
  },
  {
    name: "Lightning Training Spear",
    atk: 10,
    def: 0,
    hands: 1,
    charges: 7200,
    weight: 10.00,
    bonus_text: "Attack Interval -15%",
    bonus_type: "attack_interval",
    bonus_pct: -15
  },
  {
    name: "Lightning Training Shield",
    atk: 0,
    def: 10,
    hands: 1,
    charges: 14400,
    weight: 10.00,
    bonus_text: "Shielding Gain +15%",
    bonus_type: "shielding_gain",
    bonus_pct: 15
  },

  // ===== INFERNO TRAINING (TIER 3) =====
  {
    name: "Inferno Training Axe",
    atk: 5,
    def: 0,
    hands: 1,
    charges: 10800,
    weight: 10.00,
    bonus_text: "Attack Interval -20%",
    bonus_type: "attack_interval",
    bonus_pct: -20
  },
  {
    name: "Inferno Training Sword",
    atk: 5,
    def: 0,
    hands: 1,
    charges: 10800,
    weight: 10.00,
    bonus_text: "Attack Interval -20%",
    bonus_type: "attack_interval",
    bonus_pct: -20
  },
  {
    name: "Inferno Training Club",
    atk: 5,
    def: 0,
    hands: 1,
    charges: 10800,
    weight: 10.00,
    bonus_text: "Attack Interval -20%",
    bonus_type: "attack_interval",
    bonus_pct: -20
  },
  {
    name: "Inferno Training Rod",
    atk: 0,
    def: 0,
    hands: 1,
    charges: 7200,
    weight: 10.00,
    bonus_text: "Attack Interval -20%",
    bonus_type: "attack_interval",
    bonus_pct: -20
  },
  {
    name: "Inferno Training Spear",
    atk: 10,
    def: 0,
    hands: 1,
    charges: 10800,
    weight: 10.00,
    bonus_text: "Attack Interval -20%",
    bonus_type: "attack_interval",
    bonus_pct: -20
  },
  {
    name: "Inferno Training Wand",
    atk: 0,
    def: 0,
    hands: 1,
    charges: 7200,
    weight: 10.00,
    bonus_text: "Attack Interval -20%",
    bonus_type: "attack_interval",
    bonus_pct: -20
  },
  {
    name: "Inferno Training Shield",
    atk: 0,
    def: 10,
    hands: 1,
    charges: 21600,
    weight: 10.00,
    bonus_text: "Shielding Gain +20%",
    bonus_type: "shielding_gain",
    bonus_pct: 20
  }
];

// ===== CONFIGURAÇÕES DA APLICAÇÃO =====

/**
 * Preços predefinidos por tier
 */
const TIER_PRICES = {
  'Spark': 10000,
  'Lightning': 17000, 
  'Inferno': 30000
};

/**
 * Configurações padrão da aplicação
 */
const DEFAULT_CONFIG = {
  baseInterval: 2,
  bonusPct: 20,
  targetHours: 68,
  applyFaster: true
};

/**
 * Configurações de ordenação disponíveis
 */
const SORT_OPTIONS = {
  costPerHour: "Custo por hora (efetiva)",
  hoursPerUnit: "Horas por unidade (tempo)",
  hoursEffPerUnit: "Horas efetivas / un.",
  name: "Nome"
};

/**
 * Configurações de direção de ordenação
 */
const SORT_DIRECTIONS = {
  asc: "Ascendente",
  desc: "Descendente"
};

// ===== CONSTANTES MATEMÁTICAS =====

/**
 * Constantes para cálculos
 */
const CONSTANTS = {
  SECONDS_PER_HOUR: 3600,
  MINUTES_PER_HOUR: 60,
  DECIMAL_PLACES: {
    interval: 3,
    hours: 2,
    cost: 2
  }
};

// ===== TIPOS DE ITENS =====

/**
 * Enum para tipos de itens
 */
const ITEM_TYPES = {
  WEAPON: "Arma",
  SHIELD: "Escudo"
};

/**
 * Enum para tipos de bônus
 */
const BONUS_TYPES = {
  ATTACK_INTERVAL: "attack_interval",
  SHIELDING_GAIN: "shielding_gain"
};
