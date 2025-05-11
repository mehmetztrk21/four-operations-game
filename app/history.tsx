import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { GameHistoryItem, getGameHistory, deleteHistoryItem, clearGameHistory } from '../services/historyService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Define operation names
const operationNames = {
  addition: 'Toplama',
  subtraction: 'Çıkarma',
  multiplication: 'Çarpma',
  division: 'Bölme',
};

// Format date string to local date and time
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

export default function HistoryScreen() {
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load game history
  const loadHistory = async () => {
    setIsLoading(true);
    const gameHistory = await getGameHistory();
    setHistory(gameHistory);
    setIsLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Handle delete history item
  const handleDeleteItem = (id: string) => {
    Alert.alert(
      "Skor Sil",
      "Bu skoru silmek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { 
          text: "Sil", 
          style: "destructive",
          onPress: async () => {
            await deleteHistoryItem(id);
            loadHistory();
          }
        }
      ]
    );
  };

  // Handle clear all history
  const handleClearHistory = () => {
    Alert.alert(
      "Tüm Skorları Sil",
      "Tüm geçmiş skorlarınızı silmek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { 
          text: "Sil", 
          style: "destructive",
          onPress: async () => {
            await clearGameHistory();
            loadHistory();
          }
        }
      ]
    );
  };

  // Render each history item
  const renderHistoryItem = ({ item }: { item: GameHistoryItem }) => {
    const operationName = operationNames[item.operation as keyof typeof operationNames] || 'İşlem';
    const operationColor = getOperationColor(item.operation);
    
    return (
      <View style={[styles.historyItem, { borderLeftColor: operationColor, borderLeftWidth: 6 }]}>
        <View style={styles.historyHeader}>
          <View style={styles.headerLeft}>
            <Icon 
              name={
                item.operation === 'addition' ? 'plus' : 
                item.operation === 'subtraction' ? 'minus' : 
                item.operation === 'multiplication' ? 'close' : 
                'division'
              } 
              size={24} 
              color={operationColor}
              style={styles.operationIcon} 
            />
            <Text style={styles.operationName}>{operationName}</Text>
          </View>
          
          <View style={styles.headerRight}>
            <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
            <TouchableOpacity 
              onPress={() => handleDeleteItem(item.id)}
              style={styles.deleteButton}
            >
              <Icon name="delete" size={22} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.historyDetails}>
          <View style={styles.detailsGrid}>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Zorluk</Text>
              <Text style={[
                styles.detailValue, 
                {
                  color: 
                    item.difficulty === 'easy' ? '#4CAF50' : 
                    item.difficulty === 'medium' ? '#FF9800' : '#F44336'
                }
              ]}>
                {item.difficulty === 'easy' ? 'Kolay' : 
                 item.difficulty === 'medium' ? 'Orta' : 'Zor'}
              </Text>
            </View>
            
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Puan</Text>
              <Text style={[styles.detailValue, { color: '#673AB7' }]}>{item.score}</Text>
            </View>
            
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Sorular</Text>
              <Text style={[styles.detailValue, { color: '#2196F3' }]}>{item.questionCount}</Text>
            </View>
            
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Başarı</Text>
              <Text style={[
                styles.detailValue, 
                getSuccessTextStyle(item.percentage)
              ]}>{item.percentage}%</Text>
            </View>
          </View>
          
          {/* Performans çubuğu */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${item.percentage}%` },
                  getProgressBarColor(item.percentage)
                ]} 
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Geçmiş Oyunlarım',
          headerBackTitle: 'Ana Sayfa',
          headerBackVisible:false,
          headerStyle: { backgroundColor: '#673AB7' }, // Mor başlık
          headerTintColor: '#fff',
        }} 
      />
      
      <View style={styles.container}>
        {history.length > 0 ? (
          <>
            <FlatList
              data={history}
              renderItem={renderHistoryItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={true}
            />
            
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={handleClearHistory}
            >
              <Icon name="delete-sweep" size={24} color="white" style={styles.buttonIcon} />
              <Text style={styles.clearButtonText}>Tüm Geçmişi Temizle</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="history" size={100} color="#9575CD" />
            <Text style={styles.emptyText}>
              {isLoading ? 'Yükleniyor...' : 'Henüz oyun geçmişiniz bulunmamaktadır.'}
            </Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.push('/')}
        >
          <Icon name="home" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.homeButtonText}>Ana Sayfaya Dön</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

// Helper function to get text color based on success percentage
function getSuccessTextStyle(percentage: number) {
  if (percentage >= 90) return { color: '#4CAF50', fontWeight: 'bold' as const };
  if (percentage >= 70) return { color: '#8BC34A', fontWeight: 'bold' as const };
  if (percentage >= 50) return { color: '#FFC107', fontWeight: 'bold' as const };
  return { color: '#F44336', fontWeight: 'bold' as const };
}

// Helper function to get operation color
function getOperationColor(operation: string) {
  switch (operation) {
    case 'addition': return '#4CAF50'; // Yeşil - Toplama
    case 'subtraction': return '#F44336'; // Kırmızı - Çıkarma
    case 'multiplication': return '#2196F3'; // Mavi - Çarpma
    case 'division': return '#FF9800'; // Turuncu - Bölme
    default: return '#9C27B0'; // Mor - Varsayılan
  }
}

// Helper function to get progress bar color based on percentage
function getProgressBarColor(percentage: number) {
  if (percentage >= 90) return { backgroundColor: '#4CAF50' };
  if (percentage >= 70) return { backgroundColor: '#8BC34A' };
  if (percentage >= 50) return { backgroundColor: '#FFC107' };
  return { backgroundColor: '#F44336' };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5', // Açık mor arkaplan
    padding: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    borderLeftWidth: 6,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  operationIcon: {
    marginRight: 6,
  },
  operationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  historyDate: {
    fontSize: 14,
    color: '#757575',
    marginRight: 10,
  },
  deleteButton: {
    padding: 6,
  },
  historyDetails: {
    marginTop: 5,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailBox: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 6,
    marginBottom: 2,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#673AB7',
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderWidth: 2,
    borderColor: '#D32F2F',
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  homeButton: {
    backgroundColor: '#673AB7',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderWidth: 2,
    borderColor: '#512DA8',
  },
  homeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonIcon: {
    marginRight: 8,
  },
}); 