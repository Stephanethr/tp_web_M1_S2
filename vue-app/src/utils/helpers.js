/**
 * Fonction pour gérer les erreurs et retourner un message d'erreur convivial
 * @param {Error} error - L'erreur capturée
 * @param {string} defaultMessage - Message d'erreur par défaut
 * @returns {string} Message d'erreur à afficher
 */
export function handleApiError(error, defaultMessage = 'Une erreur est survenue') {
    if (error.response && error.response.data && error.response.data.message) {
      return error.response.data.message
    }
    
    if (error.message) {
      return error.message
    }
    
    return defaultMessage
  }
  
  /**
   * Formate une date sous forme de chaîne de caractères lisible
   * @param {string} dateString - Date à formater (format ISO)
   * @returns {string} Date formatée
   */
  export function formatDate(dateString) {
    if (!dateString) return ''
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    
    return new Date(dateString).toLocaleDateString('fr-FR', options)
  }
  
  /**
   * Calcule le pourcentage pour l'affichage des barres de progression
   * @param {number} value - Valeur actuelle
   * @param {number} max - Valeur maximale
   * @param {number} [multiplier=1] - Multiplicateur pour les petites valeurs
   * @returns {number} Pourcentage (0-100)
   */
  export function calculatePercentage(value, max = 100, multiplier = 1) {
    const percentage = (value / max) * 100 * multiplier
    return Math.min(Math.max(percentage, 0), 100) // Limiter entre 0 et 100
  }
  
  /**
   * Limite une chaîne de caractères à une longueur maximale
   * @param {string} text - Texte à limiter
   * @param {number} maxLength - Longueur maximale
   * @param {string} [ellipsis='...'] - Caractères à ajouter en cas de troncature
   * @returns {string} Texte limité
   */
  export function truncateText(text, maxLength, ellipsis = '...') {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength - ellipsis.length) + ellipsis
  }