import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item, ItemType } from '../models/item.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getInventory(sortBy: string = 'item_name', order: string = 'asc'): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/inventory?sort_by=${sortBy}&order=${order}`);
  }

  getItemTypes(): Observable<ItemType[]> {
    return this.http.get<ItemType[]>(`${this.apiUrl}/item_types`);
  }

  addItem(item: Item): Observable<Item> {
    const formData = new FormData();
    formData.append('name', item.name);
    formData.append('type_id', item.typeId.toString());
    formData.append('quantity', item.quantity.toString());
    
    return this.http.post<Item>(`${this.apiUrl}/add_item`, formData);
  }

  updateItem(item: Item): Observable<Item> {
    const formData = new FormData();
    formData.append('name', item.name);
    formData.append('type_id', item.typeId.toString());
    formData.append('quantity', item.quantity.toString());
    
    return this.http.post<Item>(`${this.apiUrl}/edit/${item.id}`, formData);
  }

  deleteItem(itemId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete/${itemId}`, {});
  }

  consumeItem(itemId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/consume/${itemId}`, {});
  }
}