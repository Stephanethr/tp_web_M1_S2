import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Item, ItemTypeModel } from '../models/item.model';
import { ItemType } from '../models/item-types.enum';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = environment.apiUrl;

  // Types d'objets statiques (si l'API n'est pas disponible)
  private staticItemTypes: ItemTypeModel[] = [
    { id: ItemType.WEAPON, type_name: 'Arme' },
    { id: ItemType.ARMOR, type_name: 'Armure' },
    { id: ItemType.POTION, type_name: 'Potion' },
    { id: ItemType.PLANT, type_name: 'Plante' },
    { id: ItemType.KEY, type_name: 'Clé' }
  ];

  constructor(private http: HttpClient) { }

  getInventory(sortBy: string = 'item_name', order: string = 'asc'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/v1/inventory/?sort_by=${sortBy}&order=${order}`)
      .pipe(
        map(response => {
          // Adapter la réponse de l'API au format attendu par les composants
          return {
            success: true,
            items: response.items || [],
            character_name: response.character_name || ''
          };
        })
      );
  }

  getItemTypes(): Observable<ItemTypeModel[]> {
    return this.http.get<any>(`${this.apiUrl}/api/v1/inventory/types/`)
      .pipe(
        map(response => {
          if (response && response.item_types) {
            return response.item_types;
          }
          // Si l'API ne renvoie pas de types, utiliser les types statiques
          return this.staticItemTypes;
        })
      );
  }

  // Obtenir les types d'objets sans faire d'appel API
  getStaticItemTypes(): ItemTypeModel[] {
    return this.staticItemTypes;
  }

  addItem(name: string, type_id: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/v1/inventory/`, {
      name, 
      type_id,
      quantity
    }).pipe(
      map(response => {
        // Adapter la réponse de l'API au format attendu par les composants
        return {
          success: true,
          item: response,
          message: 'Objet ajouté avec succès'
        };
      })
    );
  }

  editItem(itemId: number, name: string, type_id: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/v1/inventory/${itemId}/`, {
      name,
      type_id,
      quantity
    }).pipe(
      map(response => {
        // Adapter la réponse de l'API au format attendu par les composants
        return {
          success: true,
          item: response,
          message: 'Objet modifié avec succès'
        };
      })
    );
  }

  deleteItem(itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/v1/inventory/${itemId}/`)
      .pipe(
        map(() => {
          // Adapter la réponse de l'API au format attendu par les composants
          return {
            success: true,
            message: 'Objet supprimé avec succès'
          };
        })
      );
  }

  consumeItem(itemId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/inventory/${itemId}/consume/`, {})
      .pipe(
        map(response => {
          // Adapter la réponse de l'API au format attendu par les composants
          return {
            success: true,
            message: response && 'message' in response ? response.message : 'Objet consommé avec succès',
            character: response && 'character' in response ? response.character : null
          };
        })
      );
  }
}