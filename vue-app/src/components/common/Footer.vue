<template>
    <footer class="app-footer">
      <div class="footer-container">
        <p>&copy; {{ currentYear }} RPG Game. Tous droits réservés.</p>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'Footer',
    data() {
      return {
        currentYear: new Date().getFullYear()
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .app-footer {
    background-color: #f8f9fa;
    border-top: 1px solid #dee2e6;
    padding: 1rem 2rem;
    text-align: center;
    color: #6c757d;
  }
  </style>