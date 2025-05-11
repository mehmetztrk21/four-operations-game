import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the game history item type
export interface GameHistoryItem {
  id: string;
  date: string;
  operation: string;
  score: number;
  questionCount: number;
  difficulty: string;
  percentage: number;
}

// Key for AsyncStorage
const HISTORY_STORAGE_KEY = '@math_game_history';

// Get all history items
export const getGameHistory = async (): Promise<GameHistoryItem[]> => {
  try {
    const historyString = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    if (historyString) {
      return JSON.parse(historyString);
    }
    return [];
  } catch (error) {
    console.error('Error getting game history:', error);
    return [];
  }
};

// Save a new game history item
export const saveGameResult = async (gameData: Omit<GameHistoryItem, 'id' | 'date'>): Promise<void> => {
  try {
    // Get existing history
    const existingHistory = await getGameHistory();
    
    // Create new history item with date and unique ID
    const newHistoryItem: GameHistoryItem = {
      ...gameData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    
    // Add to the beginning of the array (most recent first)
    const updatedHistory = [newHistoryItem, ...existingHistory];
    
    // Save updated history
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error saving game result:', error);
  }
};

// Delete a history item by ID
export const deleteHistoryItem = async (id: string): Promise<void> => {
  try {
    const existingHistory = await getGameHistory();
    const updatedHistory = existingHistory.filter(item => item.id !== id);
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error deleting history item:', error);
  }
};

// Clear all history
export const clearGameHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing game history:', error);
  }
}; 