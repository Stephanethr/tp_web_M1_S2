import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, BehaviorSubject, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Character } from '../models/character.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private apiUrl = environment.apiUrl;
  
  // BehaviorSubject pour gérer le personnage actif côté frontend
  private activeCharacterSubject = new BehaviorSubject<Character | null>(null);
  public activeCharacter$ = this.activeCharacterSubject.asObservable();

  // Stockage local des personnages pour éviter des requêtes inutiles
  private charactersCache: Character[] = [];

  constructor(private http: HttpClient) {
    // Charger les personnages au démarrage de l'application
    this.getAllCharacters().subscribe();
  }

  getAllCharacters(): Observable<Character[]> {
    return this.http.get<any>(`${this.apiUrl}/api/v1/characters/`)
      .pipe(
        map(response => {
          if (response && response.characters) {
            // Adapter le format de la réponse
            const characters = response.characters.map((char: any) => ({
              id: char.id,
              name: char.name,
              race: char.race,
              type: char.class,
              health: char.health,
              attack: char.attack,
              defense: char.defense,
              level: char.level,
              is_active: char.is_active
            }));
            this.charactersCache = characters;
            return characters;
          }
          return [];
        })
      );
  }

  getCharacterById(id: number): Observable<Character> {
    // Essayer d'abord de récupérer le personnage depuis le cache
    const cachedCharacter = this.charactersCache.find(char => char.id === id);
    if (cachedCharacter) {
      return of(cachedCharacter);
    }

    // Sinon, faire une requête API
    return this.http.get<any>(`${this.apiUrl}/api/v1/characters/${id}/`)
      .pipe(
        map(response => {
          if (response && response.character) {
            // Adapter le format de la réponse
            const character: Character = {
              id: response.character.id,
              name: response.character.name,
              race: response.character.race,
              type: response.character.class,
              health: response.character.health,
              attack: response.character.attack,
              defense: response.character.defense,
              level: response.character.level,
              is_active: response.character.is_active
            };
            return character;
          }
          throw new Error('Personnage non trouvé');
        })
      );
  }

  createCharacter(name: string, race: string, characterClass: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/characters/`, {
      name,
      race,
      class: characterClass
    }).pipe(
      map(response => {
        // Adapter la réponse au format attendu par les composants
        return {
          success: true,
          character: {
            id: response.character.id,
            name: response.character.name,
            race: response.character.race,
            type: response.character.class,
            health: response.character.health,
            attack: response.character.attack,
            defense: response.character.defense,
            level: response.character.level,
            is_active: true
          },
          message: response.message
        };
      }),
      tap(response => {
        if (response.success && response.character) {
          // Mettre à jour le cache
          this.charactersCache.push(response.character);
          // Sélectionner automatiquement le nouveau personnage
          this.setActiveCharacter(response.character);
        }
      })
    );
  }

  // Méthode pour appeler l'API mais aussi gérer la sélection côté frontend
  selectCharacter(characterId: number): Observable<any> {
    // D'abord, essayer de sélectionner le personnage dans le cache
    const character = this.charactersCache.find(char => char.id === characterId);
    
    if (character) {
      // Mise à jour côté frontend
      this.setActiveCharacter(character);
    }

    // Également envoyer la requête au serveur
    return this.http.post<any>(`${this.apiUrl}/api/v1/characters/${characterId}/select/`, {})
      .pipe(
        map(response => {
          // Adapter la réponse au format attendu par les composants
          return {
            success: true,
            message: response.message
          };
        }),
        tap(response => {
          if (response.success) {
            // Mettre à jour tous les personnages pour refléter la sélection
            this.charactersCache.forEach(char => {
              char.is_active = char.id === characterId;
            });
          }
        })
      );
  }

  // Méthode purement frontend pour définir le personnage actif
  setActiveCharacter(character: Character): void {
    // Mettre à jour le BehaviorSubject
    this.activeCharacterSubject.next(character);
    
    // Mettre à jour le statut actif dans le cache
    this.charactersCache.forEach(char => {
      char.is_active = char.id === character.id;
    });

    // Sauvegarder l'ID du personnage actif dans le localStorage
    localStorage.setItem('activeCharacterId', character.id.toString());
  }

  // Récupérer le personnage actif (du cache ou du localStorage)
  getActiveCharacter(): Character | null {
    const currentActive = this.activeCharacterSubject.value;
    
    if (currentActive) {
      return currentActive;
    }

    // Si aucun personnage actif en mémoire, essayer de récupérer depuis localStorage
    const activeId = localStorage.getItem('activeCharacterId');
    if (activeId) {
      const character = this.charactersCache.find(char => char.id === +activeId);
      if (character) {
        this.setActiveCharacter(character);
        return character;
      }
    }

    // Si aucun personnage actif trouvé, utiliser le premier personnage disponible
    if (this.charactersCache.length > 0) {
      const firstActiveCharacter = this.charactersCache.find(char => char.is_active);
      
      if (firstActiveCharacter) {
        this.setActiveCharacter(firstActiveCharacter);
        return firstActiveCharacter;
      } else {
        this.setActiveCharacter(this.charactersCache[0]);
        return this.charactersCache[0];
      }
    }

    return null;
  }

  // Propriété pour obtenir facilement l'ID du personnage actif
  get activeCharacterId(): number | null {
    const character = this.getActiveCharacter();
    return character ? character.id : null;
  }
}