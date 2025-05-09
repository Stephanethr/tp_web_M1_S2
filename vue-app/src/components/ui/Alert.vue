<template>
    <div v-if="show" :class="['alert', `alert-${type}`]" role="alert">
      <slot></slot>
      <button v-if="dismissible" type="button" class="btn-close" @click="$emit('close')"></button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Alert',
    props: {
      type: {
        type: String,
        default: 'info',
        validator: (value) => ['success', 'danger', 'warning', 'info'].includes(value)
      },
      show: {
        type: Boolean,
        default: true
      },
      dismissible: {
        type: Boolean,
        default: false
      }
    },
    emits: ['close']
  }
  </script>
  
  <style lang="scss" scoped>
  .alert {
    padding: 15px;
    margin-bottom: 20px;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    animation: fadeInDown 0.4s ease-out;
    position: relative;
    
    .btn-close {
      position: absolute;
      top: 0;
      right: 0;
      padding: 0.75rem;
      background: transparent;
      border: 0;
      font-size: 1.25rem;
      cursor: pointer;
    }
  }
  
  .alert-success {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
  }
  
  .alert-danger {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
  }
  
  .alert-warning {
    color: #856404;
    background-color: #fff3cd;
    border-color: #ffeeba;
  }
  
  .alert-info {
    color: #0c5460;
    background-color: #d1ecf1;
    border-color: #bee5eb;
  }
  
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>