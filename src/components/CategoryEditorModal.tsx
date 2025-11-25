import React from "react";
import { Category, Cafe } from "../types";

interface CategoryEditorModalProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  cafes: Cafe[];
  onClose: () => void;
}

export const CategoryEditorModal: React.FC<CategoryEditorModalProps> = ({
  categories,
  setCategories,
  cafes,
  onClose
}) => {

  const updateCategoryField = (
    id: string,
    key: keyof Category,
    value: string
  ) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id ? { ...cat, [key]: value } : cat
      )
    );
  };

  const toggleCafeInCategory = (catId: string, cafeId: number) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === catId
          ? {
              ...cat,
              cafes: cat.cafes?.includes(cafeId)
                ? cat.cafes.filter(id => id !== cafeId)
                : [...(cat.cafes || []), cafeId]
            }
          : cat
      )
    );
  };

  const addCategory = () => {
    setCategories(prev => [
      ...prev,
      { id: Date.now().toString(), name: "New Category", emoji: "✨", cafes: [] }
    ]);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-md w-full max-w-2xl shadow-xl">
        <h2 className="text-xl font-serif mb-4">Edit Categories</h2>

        {/* Category Editor */}
        {categories.map(cat => (
          <div key={cat.id} className="border p-4 mt-3 rounded-md">
            <div className="flex items-center gap-2">
              <input
                value={cat.emoji}
                onChange={(e) => updateCategoryField(cat.id, "emoji", e.target.value)}
                className="w-14 border px-2 py-1 text-center"
              />
              <input
                value={cat.name}
                onChange={(e) => updateCategoryField(cat.id, "name", e.target.value)}
                className="border flex-1 px-3 py-1"
              />

              <button
                onClick={() => deleteCategory(cat.id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>

            <p className="mt-3 text-sm text-gray-500">Assign cafes to this category:</p>
            <div className="mt-2 grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {cafes.map(cafe => (
                <label key={cafe.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={cat.cafes?.includes(cafe.id) || false}
                    onChange={() => toggleCafeInCategory(cat.id, cafe.id)}
                  />
                  {cafe.name}
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={addCategory}
          className="mt-4 px-4 py-2 border rounded text-sm"
        >
          ＋ Add Category
        </button>

        <div className="text-right mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brand-dark text-white rounded"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
