import { v4 as uuidv4 } from 'uuid';

/**
 * PermanentStorageService - A service for storing data permanently in localStorage
 * This ensures data persistence across sessions and works on the live website
 */
class PermanentStorageService {
  /**
   * Store data in localStorage with the given key
   * @param key The key to store the data under
   * @param data The data to store
   */
  store<T>(key: string, data: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`✅ Data stored successfully with key: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error storing data with key ${key}:`, error);
      return false;
    }
  }

  /**
   * Retrieve data from localStorage with the given key
   * @param key The key to retrieve data from
   * @returns The retrieved data, or null if not found
   */
  retrieve<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        console.log(`ℹ️ No data found for key: ${key}`);
        return null;
      }
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`❌ Error retrieving data with key ${key}:`, error);
      return null;
    }
  }

  /**
   * Update an item in an array stored in localStorage
   * @param key The key where the array is stored
   * @param id The id of the item to update
   * @param updateFn A function that takes the item and returns the updated item
   * @returns True if successful, false otherwise
   */
  updateItem<T extends { id?: string }>(
    key: string, 
    id: string, 
    updateFn: (item: T) => T
  ): boolean {
    try {
      const items = this.retrieve<T[]>(key) || [];
      const index = items.findIndex(item => item.id === id);
      
      if (index === -1) {
        console.error(`❌ Item with id ${id} not found in ${key}`);
        return false;
      }
      
      items[index] = updateFn(items[index]);
      return this.store(key, items);
    } catch (error) {
      console.error(`❌ Error updating item in ${key}:`, error);
      return false;
    }
  }

  /**
   * Add an item to an array stored in localStorage
   * @param key The key where the array is stored
   * @param item The item to add
   * @returns The added item with a generated id, or null if failed
   */
  addItem<T extends { id?: string }>(key: string, item: Omit<T, 'id'>): T | null {
    try {
      const items = this.retrieve<T[]>(key) || [];
      const newItem = {
        ...item,
        id: uuidv4()
      } as T;
      
      items.push(newItem);
      const success = this.store(key, items);
      
      return success ? newItem : null;
    } catch (error) {
      console.error(`❌ Error adding item to ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove an item from an array stored in localStorage
   * @param key The key where the array is stored
   * @param id The id of the item to remove
   * @returns True if successful, false otherwise
   */
  removeItem<T extends { id?: string }>(key: string, id: string): boolean {
    try {
      const items = this.retrieve<T[]>(key) || [];
      const filteredItems = items.filter(item => item.id !== id);
      
      if (filteredItems.length === items.length) {
        console.error(`❌ Item with id ${id} not found in ${key}`);
        return false;
      }
      
      return this.store(key, filteredItems);
    } catch (error) {
      console.error(`❌ Error removing item from ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all data for a specific key
   * @param key The key to clear data for
   */
  clear(key: string): boolean {
    try {
      localStorage.removeItem(key);
      console.log(`✅ Data cleared for key: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error clearing data for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Generate a unique ID
   * @returns A unique ID string
   */
  generateId(): string {
    return uuidv4();
  }
}

export const permanentStorageService = new PermanentStorageService();

// Expose to window for debugging and migration scripts
if (typeof window !== 'undefined') {
  (window as any).permanentStorageService = permanentStorageService;
}