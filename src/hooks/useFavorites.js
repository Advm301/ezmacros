import { useState, useEffect } from 'react';

const STORAGE_KEY = 'ezmacros_favorites';

export default function useFavorites() {
  const [favorites, setFavorites] = useState(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Support both array and object format for backwards compatibility
        const ids = Array.isArray(parsed) ? parsed : parsed.recipeIds || [];
        setFavorites(new Set(ids));
      }
      setIsLoaded(true);
    } catch (err) {
      console.error('Error loading favorites from localStorage:', err);
      // Graceful fallback: keep empty set, don't crash
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (!isLoaded) return; // Don't save until initial load is complete

    try {
      const favsArray = Array.from(favorites);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          recipeIds: favsArray,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (err) {
      console.error('Error saving favorites to localStorage:', err);
      // Graceful fallback: don't crash if localStorage is unavailable
    }
  }, [favorites, isLoaded]);

  const addFavorite = (id) => {
    setFavorites((prev) => new Set([...prev, id]));
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      updated.delete(id);
      return updated;
    });
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const isFavorited = (id) => {
    return favorites.has(id);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorited,
  };
}
