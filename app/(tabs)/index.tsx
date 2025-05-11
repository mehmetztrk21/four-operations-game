import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


// Math operation icons
const icons = {
  addition: require('../../assets/plus.png'),
  subtraction: require('../../assets/minus.png'),
  multiplication: require('../../assets/multiply.png'),
  division: require('../../assets/divide.png'),
};

export default function HomeScreen() {
  const router = useRouter();

  // Navigate to the game operations screen
  const handleNewGame = () => {
    router.push('/operations-menu' as any);
  };

  // Navigate to the history screen
  const handleGameHistory = () => {
    router.push('/history' as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matematik Oyunu</Text>
      <Text style={styles.subtitle}>Tekrar Hoşgeldiniz !</Text>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.menuButton, styles.playButton]}
          onPress={handleNewGame}
        >
          <Icon name="play-circle" size={60} color="#FFFFFF" style={styles.menuIcon} />
          <Text style={styles.menuButtonText}>Yeni Oyun</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.menuButton, styles.historyButton]}
          onPress={handleGameHistory}
        >
          <Icon name="history" size={60} color="#FFFFFF" style={styles.menuIcon} />
          <Text style={styles.menuButtonText}>Geçmiş Oyunlarım</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF9C4', // Soft yellow background
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF6F00',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 22,
    marginBottom: 60,
    color: '#E65100',
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    gap: 30,
  },
  menuButton: {
    width: '100%',
    height: 120,
    borderRadius: 25,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderWidth: 3,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  playButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  historyButton: {
    backgroundColor: '#9C27B0',
    borderColor: '#6A1B9A',
  },
  menuIcon: {
    marginRight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  menuButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
