import { ItemType as ItemTypeEnum } from './item-types.enum';

export interface Item {
  id: number;
  name: string;
  type_id: number;       // ID numérique du type d'objet dans la base de données
  type_name?: string;    // Nom du type d'objet (fourni par le backend)
  quantity: number;
  character_id?: number;
  source?: string;       // 'inventory' ou 'character_items' selon l'API
  consumable?: boolean;  // Si l'objet peut être consommé
  effect?: string;       // Effet de l'objet (pour les objets spéciaux)
}

export interface ItemTypeModel {
  id: number;
  type_name: string;
  description?: string;
}