export interface User {
  id: number;           // user_id dans l'API
  username: string;     // user_login dans l'API
  email: string;        // user_mail dans l'API
  active_character_id: number | null;
  date_registered?: string;  // user_date_new dans l'API
  last_login?: string;       // user_date_login dans l'API
}