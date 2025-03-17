import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Character, Race, CharacterType } from '../models/character.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllCharacters(): Observable<Character[]> {
    return this.http.get<Character[]>(`${this.apiUrl}/game/characters`);
  }

  getCharacterById(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/game/character_profile/${id}`);
  }

  createCharacter(character: { name: string, race: Race, class: CharacterType }): Observable<Character> {
    const formData = new FormData();
    formData.append('name', character.name);
    formData.append('race', character.race);
    formData.append('class', character.class);
    
    return this.http.post<Character>(`${this.apiUrl}/game/create_character`, formData);
  }

  selectCharacter(characterId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/game/select_character/${characterId}`, {});
  }
}