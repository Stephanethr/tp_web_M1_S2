import { useInventory } from '../../context/InventoryContext';
import { useCharacter } from '../../context/CharacterContext';

export const InventoryPage = () => {
  const { inventory, equipped, loading, error, handleDelete, handleUse, handleEquip } = useInventory();
  const { activeCharacter} = useCharacter();

  if (!activeCharacter) {
    return <div className="p-4">Veuillez sélectionner un personnage</div>;
  }

  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Inventaire de {activeCharacter.name}</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Équipé</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(equipped).map(([slot, item]) => (
            <div key={slot} className="border p-4 rounded-lg bg-gray-50">
              <div className="font-medium capitalize">{slot}</div>
              <div className="mt-1">
                {item ? (
                  <>
                    <div>{item.name}</div>
                    <button 
                      onClick={() => handleEquip(item.id, slot)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Retirer
                    </button>
                  </>
                ) : (
                  <div className="text-gray-400">Vide</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Objets</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {inventory.map(item => (
            <div key={item.id} className="border p-4 rounded-lg bg-white">
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-600 mb-2">x{item.quantity}</div>
              
              <div className="flex flex-wrap gap-2">
                {item.equipable && (
                  <button
                    onClick={() => handleEquip(item.id, item.slot)}
                    className="px-2 py-1 text-xs bg-blue-100 rounded hover:bg-blue-200"
                  >
                    Équiper
                  </button>
                )}
                
                {item.consumable && (
                  <button
                    onClick={() => handleUse(item.id)}
                    className="px-2 py-1 text-xs bg-green-100 rounded hover:bg-green-200"
                  >
                    Utiliser
                  </button>
                )}

                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-2 py-1 text-xs bg-red-100 rounded hover:bg-red-200"
                >
                  Jeter
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;