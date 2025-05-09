<template>
    <div class="loading-overlay" v-if="show">
      <div class="spinner-container">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p v-if="message" class="loading-message">{{ message }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Loading',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      message: {
        type: String,
        default: ''
      },
      fullscreen: {
        type: Boolean,
        default: false
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    
    &.fullscreen {
      position: fixed;
    }
  }
  
  .spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .spinner-border {
      width: 3rem;
      height: 3rem;
    }
    
    .loading-message {
      margin-top: 1rem;
      font-weight: 500;
      color: #6c757d;
    }
  }
  
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  </style>