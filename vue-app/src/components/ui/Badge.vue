<template>
    <span :class="['badge', type ? `badge-${type}` : '']">
      <slot></slot>
    </span>
  </template>
  
  <script>
  export default {
    name: 'Badge',
    props: {
      type: {
        type: String,
        default: '',
        validator: (value) => [
          '', 'primary', 'secondary', 'success', 'danger', 
          'warning', 'info', 'light', 'dark', 'warrior',
          'mage', 'level', 'active'
        ].includes(value)
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .badge {
    display: inline-block;
    padding: 0.25em 0.4em;
    font-size: 75%;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25rem;
  }
  
  .badge-warrior {
    color: #fff;
    background-color: #dc3545;
  }
  
  .badge-mage {
    color: #fff;
    background-color: #007bff;
  }
  
  .badge-level {
    color: #212529;
    background-color: #ffc107;
  }
  
  .badge-active {
    color: #fff;
    background-color: #28a745;
  }
  
  .badge-success {
    background-color: #28a745;
    color: white;
  }
  
  .badge-danger {
    background-color: #dc3545;
    color: white;
  }
  
  .badge-info {
    background-color: #17a2b8;
    color: white;
  }
  
  .badge-warning {
    background-color: #ffc107;
    color: #212529;
  }
  
  .badge-secondary {
    background-color: #6c757d;
    color: white;
  }
  
  .badge-primary {
    background-color: #007bff;
    color: white;
  }
  
  .badge-light {
    background-color: #f8f9fa;
    color: #212529;
  }
  
  .badge-dark {
    background-color: #343a40;
    color: white;
  }
  </style>