import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function OperationsMenuScreen() {
  const router = useRouter();

  const handleOperationPress = (operation: string) => {
    // Navigate to settings screen with the selected operation
    router.push({
      pathname: '/settings',
      params: { operation }
    } as any);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Yeni Oyun',
          headerBackTitle: 'Ana Sayfa',
          headerBackVisible:false,
          headerStyle: { backgroundColor: '#333' },
          headerTintColor: '#fff',
        }} 
      />
      
      <View style={styles.container}>
        <Text style={styles.title}>Matematik Oyunu</Text>
        <Text style={styles.subtitle}>İşlem seçiniz</Text>
        
        <View style={styles.grid}>
          <View style={styles.row}>
            <TouchableOpacity 
              style={[styles.card, styles.additionCard]} 
              onPress={() => handleOperationPress('addition')}
            >
              <Icon name="plus" size={50} color="#fff" style={styles.icon} />
              <Text style={styles.cardText}>Toplama</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.card, styles.subtractionCard]} 
              onPress={() => handleOperationPress('subtraction')}
            >
              <Icon name="minus" size={50} color="#fff" style={styles.icon} />
              <Text style={styles.cardText}>Çıkarma</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.row}>
            <TouchableOpacity 
              style={[styles.card, styles.multiplicationCard]} 
              onPress={() => handleOperationPress('multiplication')}
            >
              <Icon name="close" size={50} color="#fff" style={styles.icon} />
              <Text style={styles.cardText}>Çarpma</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.card, styles.divisionCard]} 
              onPress={() => handleOperationPress('division')}
            >
              <Icon name="division" size={50} color="#fff" style={styles.icon} />
              <Text style={styles.cardText}>Bölme</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.backButtonText}>Ana Sayfaya Dön</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    color: '#1B5E20',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
    color: '#388E3C',
  },
  grid: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  card: {
    width: '48%',
    aspectRatio: 0.9,
    borderRadius: 25,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 3,
  },
  additionCard: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  subtractionCard: {
    backgroundColor: '#F44336',
    borderColor: '#C62828',
  },
  multiplicationCard: {
    backgroundColor: '#2196F3',
    borderColor: '#1565C0',
  },
  divisionCard: {
    backgroundColor: '#FF9800',
    borderColor: '#EF6C00',
  },
  icon: {
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cardText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  backButton: {
    backgroundColor: '#8BC34A',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#689F38',
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
}); 