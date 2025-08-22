<<<<<<< HEAD
# calculadora-miracle
=======
# 🎯 Calculadora de Treino - Planejador & Custo/Benefício

Uma calculadora web para planejamento de treino em jogos, com análise de custo-benefício de diferentes itens de treino.

## 🚀 Funcionalidades

- **Cálculo de Intervalos**: Considera bônus globais e específicos de cada item
- **Análise de Custo-Benefício**: Calcula custo por hora efetiva de treino
- **Filtros e Ordenação**: Busca por nome e ordenação por diferentes critérios
- **KPIs em Tempo Real**: Métricas atualizadas conforme parâmetros
- **Responsivo**: Interface adaptável para diferentes dispositivos

## 🏗️ Arquitetura

A aplicação foi estruturada de forma modular para facilitar manutenção e desenvolvimento:

```
Calc-Treino-Miracle/
├── index.html              # Estrutura HTML principal
├── styles/
│   └── main.css           # Estilos CSS organizados
├── js/
│   ├── config.js          # Dados e configurações
│   ├── calculator.js      # Lógica de cálculos
│   ├── ui.js             # Interface e renderização
│   └── main.js           # Coordenação e inicialização
└── README.md              # Esta documentação
```

## 📁 Estrutura dos Arquivos

### `index.html`
- Estrutura HTML limpa e semântica
- Referências para arquivos CSS e JavaScript externos
- Comentários organizados por seção

### `styles/main.css`
- **Variáveis CSS**: Sistema de cores e espaçamentos consistente
- **Reset e Base**: Estilos fundamentais
- **Layout**: Grid, flexbox e responsividade
- **Componentes**: Formulários, tabelas, KPIs
- **Animações**: Transições e efeitos visuais
- **Media Queries**: Adaptação para dispositivos móveis

### `js/config.js`
- **Dados dos Itens**: Array com informações de todas as armas e escudos
- **Configurações**: Valores padrão e opções disponíveis
- **Constantes**: Valores matemáticos e tipos de itens
- **Enums**: Definições de tipos e categorias

### `js/calculator.js`
- **Funções Utilitárias**: Formatação e cálculos básicos
- **Cálculos de Intervalo**: Lógica para armas e escudos
- **Cálculos de Tempo**: Horas por unidade e efetivas
- **Cálculos de Custo**: Análise de custo-benefício
- **Ordenação**: Algoritmos de classificação

### `js/ui.js`
- **Referências DOM**: Mapeamento de elementos da interface
- **Renderização**: Criação e atualização da tabela
- **Event Listeners**: Interações do usuário
- **Gestão de Estado**: Preços e configurações
- **KPIs**: Atualização de métricas em tempo real

### `js/main.js`
- **Coordenação**: Inicialização de todos os módulos
- **Verificação de Dependências**: Validação de carregamento
- **Ciclo de Vida**: Gestão de eventos globais
- **Debug**: Funções de desenvolvimento
- **Tratamento de Erros**: Captura de exceções

## 🎨 Sistema de Design

### Variáveis CSS
```css
:root {
  --bg: #f7f7fb;           /* Cor de fundo */
  --card: #fff;            /* Cor dos cards */
  --ink: #111;             /* Cor do texto */
  --accent: #4f46e5;       /* Cor de destaque */
  --border-radius: 16px;   /* Bordas arredondadas */
  --transition: all 0.2s ease; /* Transições */
}
```

### Responsividade
- **Desktop**: Layout em 4 colunas
- **Tablet**: Layout adaptativo
- **Mobile**: Layout em coluna única

## 🚀 Deploy na Vercel

### Pré-requisitos
- Conta no [GitHub](https://github.com)
- Conta na [Vercel](https://vercel.com)

### Passos para Deploy

1. **Faça push do projeto para o GitHub:**
```bash
git add .
git commit -m "Initial commit: Calculadora de Treino"
git push origin main
```

2. **Conecte o repositório na Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório do GitHub
   - A Vercel detectará automaticamente que é um projeto estático

3. **Configuração automática:**
   - **Framework Preset**: Vercel detectará automaticamente
   - **Build Command**: Não é necessário (projeto estático)
   - **Output Directory**: `/` (raiz)
   - **Install Command**: Não é necessário

4. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o build (deve ser muito rápido)
   - Seu projeto estará online!

### Configurações do Projeto

O arquivo `vercel.json` já está configurado com:
- ✅ Build estático otimizado
- ✅ Cache de assets (JS, CSS, imagens)
- ✅ Headers de performance
- ✅ Roteamento correto

## 🔧 Desenvolvimento

### Funções de Debug
```javascript
// No console do navegador:
debugApp()    // Inspeciona estado da aplicação
resetApp()    // Reseta para valores padrão
```

### Adicionando Novos Itens
1. Edite `js/config.js`
2. Adicione no array `WEAPONS_DATA`
3. Siga o formato existente

### Modificando Cálculos
1. Edite `js/calculator.js`
2. Funções bem documentadas com JSDoc
3. Teste com diferentes parâmetros

### Alterando Estilos
1. Edite `styles/main.css`
2. Use variáveis CSS para consistência
3. Teste responsividade

## 📱 Como Usar

1. **Abra `index.html`** no navegador
2. **Configure os parâmetros**:
   - Intervalo base (segundos por carga)
   - Bônus global de intervalo (%)
   - Horas desejadas
   - Opção de redução global
3. **Defina preços** dos itens na tabela
4. **Filtre e ordene** conforme necessário
5. **Analise os KPIs** para tomar decisões

## 🧮 Fórmulas

### Armas
- **Intervalo**: `base × (1 − bônus_global) × (1 + bônus_item/100)`
- **Unidades**: `alvo_real ÷ horas_tempo`

### Escudos
- **Intervalo**: `base` (sem redução)
- **Horas Efetivas**: `horas_tempo × (1 + bônus_item/100)`
- **Unidades**: `alvo_nominal ÷ horas_efetivas`

### Custo
- **Custo/Hora**: `preço ÷ horas_efetivas`

## 🚀 Vantagens da Nova Estrutura

- ✅ **Modular**: Cada arquivo tem responsabilidade específica
- ✅ **Manutenível**: Fácil localizar e modificar funcionalidades
- ✅ **Escalável**: Simples adicionar novos recursos
- ✅ **Testável**: Funções isoladas e bem definidas
- ✅ **Legível**: Código organizado e documentado
- ✅ **Reutilizável**: Componentes independentes

## 🔮 Próximos Passos

- [ ] Sistema de persistência local (localStorage)
- [ ] Exportação de dados para CSV/Excel
- [ ] Gráficos comparativos
- [ ] Sistema de presets de configuração
- [ ] Temas visuais alternativos
- [ ] Testes automatizados

## 📄 Licença

Este projeto é de uso livre para fins educacionais e pessoais.
>>>>>>> d092b1d (Initial commit: Calculadora de Treino Miracle74)
