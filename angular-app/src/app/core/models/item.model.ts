export interface ItemType {
    id: number;
    typeName: string;
  }
  
  export interface Item {
    id?: number;
    characterId: number;
    name: string;
    typeId: number;
    typeName?: string;
    quantity: number;
    effect?: string;
  }