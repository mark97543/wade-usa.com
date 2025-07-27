import { useState } from 'react';

/**
 * @hook useItemManager
 * @description A custom hook to manage a list of items (e.g., flights, hotels).
 * It encapsulates the state and common handlers for adding, deleting, and updating items.
 * @param {Array} [initialItems=[]] - The initial array of items.
 * @returns {object} An object containing the items array and handler functions.
 */
export const useItemManager = (initialItems = []) => {
  const [items, setItems] = useState(initialItems);

  /**
   * Adds a new item to the list, assigning a temporary unique ID.
   * @param {object} newItemTemplate - An object with the default values for a new item.
   */
  const addItem = (newItemTemplate) => {
    const newItem = {
      ...newItemTemplate,
      id: `new-${Date.now()}`,
    };
    setItems(prevItems => [...(prevItems || []), newItem]);
  };

  const deleteItem = (indexToDelete) => {
    setItems(currentItems => currentItems.filter((_, index) => index !== indexToDelete));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  return { items, setItems, addItem, deleteItem, handleItemChange };
};