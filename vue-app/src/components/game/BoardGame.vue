<template>
    <div class="board-game">
      <div class="board-cells">
        <div 
          v-for="(cell, i) in boardLength" 
          :key="i" 
          class="board-cell" 
          :class="{
            'cell-current': i === currentPosition,
            'cell-empty': isEmpty(i),
            'cell-item': isItem(i),
            'cell-enemy': isEnemy(i)
          }"
        >
          {{ i + 1 }}
          <div class="cell-content" v-if="getCellContent(i)">
            <span v-if="isItem(i)">{{ getCellContent(i).name }}</span>
            <span v-if="isEnemy(i)">{{ getCellContent(i).name }}</span>
          </div>
        </div>
      </div>
      
      <div class="game-controls">
        <button class="btn btn-success btn-roll" @click="rollDice" :disabled="disabled">
          <i class="bi bi-dice-6"></i> Lancer le dé
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BoardGame',
    props: {
      board: {
        type: Array,
        default: () => []
      },
      currentPosition: {
        type: Number,
        default: 0
      },
      boardLength: {
        type: Number,
        default: 20
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    emits: ['roll'],
    methods: {
      rollDice() {
        // Simuler un lancer de dé (1 à 6)
        const value = Math.floor(Math.random() * 6) + 1
        this.$emit('roll', value)
      },
      isEmpty(index) {
        return !this.getCellContent(index)
      },
      isItem(index) {
        const content = this.getCellContent(index)
        return content && content.type
      },
      isEnemy(index) {
        const content = this.getCellContent(index)
        return content && content.health
      },
      getCellContent(index) {
        // Vérifier si le tableau board contient quelque chose à cet index
        if (this.board && this.board[index]) {
          return this.board[index]
        }
        
        // Sinon, générer un contenu aléatoire pour la visualisation
        if (index === this.currentPosition) return null // Case courante toujours vide
        
        // Génération aléatoire pour la démo visuelle
        const random = Math.random()
        
        if (random < 0.7) {
          return null // 70% de chance d'être vide
        } else if (random < 0.85) {
          return { name: 'Potion', type: 'healing' } // 15% de chance d'être un objet
        } else {
          return { name: 'Gobelin', health: 30 } // 15% de chance d'être un ennemi
        }
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .board-game {
    margin: 30px auto;
    max-width: 900px;
    padding: 20px;
  }
  
  .board-cells {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 15px;
    padding: 15px;
  }
  
  .board-cell {
    aspect-ratio: 1/1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    font-weight: 600;
    position: relative;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    background-color: #f8f9fa;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      z-index: 10;
    }
  }
  
  .cell-current {
    background-color: #007bff;
    color: white;
    box-shadow: 0 0 15px rgba(0, 123, 255, 0.8);
    animation: pulse 1.5s infinite;
  }
  
  .cell-empty {
    background-color: #f8f9fa;
  }
  
  .cell-item {
    background-color: #28a745;
    color: white;
  }
  
  .cell-enemy {
    background-color: #dc3545;
    color: white;
  }
  
  .cell-content {
    font-size: 0.75rem;
    margin-top: 5px;
    word-break: break-all;
  }
  
  .game-controls {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
  
  .btn-roll {
    position: relative;
    overflow: hidden;
    
    &:active {
      animation: diceRoll 0.6s ease-in-out;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:active::after {
      opacity: 1;
    }
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 5px #007bff; }
    50% { box-shadow: 0 0 20px #007bff; }
    100% { box-shadow: 0 0 5px #007bff; }
  }
  
  @keyframes diceRoll {
    0% { transform: rotate(0deg) scale(1); }
    10% { transform: rotate(36deg) scale(1.1); }
    20% { transform: rotate(72deg) scale(1.2); }
    30% { transform: rotate(108deg) scale(1.1); }
    40% { transform: rotate(144deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.1); }
    60% { transform: rotate(216deg) scale(1.2); }
    70% { transform: rotate(252deg) scale(1.1); }
    80% { transform: rotate(288deg) scale(1); }
    90% { transform: rotate(324deg) scale(1.1); }
    100% { transform: rotate(360deg) scale(1); }
  }
  </style>