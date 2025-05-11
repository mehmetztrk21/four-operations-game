import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Keyboard, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{
    operation: string,
    difficulty?: string,
    timerEnabled?: string,
    timerSeconds?: string,
    soundEnabled?: string,
    targetEnabled?: string,
    targetScore?: string
  }>();
  const operation = params.operation || '';

  // Game settings with default values from params if available
  const [difficulty, setDifficulty] = useState(params.difficulty || 'easy');
  const [timerEnabled, setTimerEnabled] = useState(params.timerEnabled === 'true');
  const [timerSeconds, setTimerSeconds] = useState(parseInt(params.timerSeconds || '30', 10));
  const [soundEnabled, setSoundEnabled] = useState(params.soundEnabled !== 'false'); // default true
  const [targetEnabled, setTargetEnabled] = useState(params.targetEnabled === 'true');
  const [targetScore, setTargetScore] = useState(params.targetScore || '50');

  // Handle start game button
  const handleStartGame = () => {
    router.push({
      pathname: `/operations/${operation}`,
      params: {
        difficulty,
        timerEnabled: timerEnabled ? 'true' : 'false',
        timerSeconds: timerSeconds.toString(),
        soundEnabled: soundEnabled ? 'true' : 'false',
        targetEnabled: targetEnabled ? 'true' : 'false',
        targetScore
      }
    } as any);
  };

  // Get operation title
  const getOperationTitle = () => {
    switch (operation) {
      case 'addition': return 'Toplama';
      case 'subtraction': return 'Çıkarma';
      case 'multiplication': return 'Çarpma';
      case 'division': return 'Bölme';
      default: return 'İşlem';
    }
  };

  // Get operation color
  const getOperationColor = () => {
    switch (operation) {
      case 'addition': return '#4CAF50';
      case 'subtraction': return '#F44336';
      case 'multiplication': return '#2196F3';
      case 'division': return '#FF9800';
      default: return '#333';
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Oyun Ayarları',
          headerBackTitle: 'Ana Sayfa',
          headerStyle: { backgroundColor: getOperationColor() },
          headerTintColor: '#fff',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push('/operations-menu')}>
              <Text style={{ color: 'white', marginLeft: 15 }}>Yeni Oyun</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          alwaysBounceVertical={true}
          scrollEnabled={true}
        >
          <Text style={styles.title}>Oyun Ayarları</Text>
          
          <View style={[styles.operationBadge, { backgroundColor: getOperationColor(), borderColor: getOperationColor() }]}>
            <Text style={styles.operationBadgeText}>{getOperationTitle()}</Text>
          </View>

          <View style={styles.settingContainer}>
            <Text style={styles.settingTitle}>Zorluk Seviyesi</Text>
            <View style={styles.difficultyContainer}>
              <TouchableOpacity
                style={[
                  styles.difficultyButton,
                  styles.easyButton,
                  difficulty === 'easy' && styles.activeButton,
                  difficulty === 'easy' && { backgroundColor: '#A5D6A7' } 
                ]}
                onPress={() => setDifficulty('easy')}
              >
                <Text style={[
                  styles.difficultyButtonText, 
                  difficulty === 'easy' && styles.activeButtonText
                ]}>
                  {difficulty === 'easy' && '✓ '}Kolay
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.difficultyButton,
                  styles.mediumButton,
                  difficulty === 'medium' && styles.activeButton,
                  difficulty === 'medium' && { backgroundColor: '#FFCC80' } 
                ]}
                onPress={() => setDifficulty('medium')}
              >
                <Text style={[
                  styles.difficultyButtonText,
                  difficulty === 'medium' && styles.activeButtonText
                ]}>
                  {difficulty === 'medium' && '✓ '}Orta
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.difficultyButton,
                  styles.hardButton,
                  difficulty === 'hard' && styles.activeButton,
                  difficulty === 'hard' && { backgroundColor: '#EF9A9A' } 
                ]}
                onPress={() => setDifficulty('hard')}
              >
                <Text style={[
                  styles.difficultyButtonText,
                  difficulty === 'hard' && styles.activeButtonText
                ]}>
                  {difficulty === 'hard' && '✓ '}Zor
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingContainer}>
            <Text style={styles.settingTitle}>Süre Ayarları</Text>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Süre Sınırı</Text>
              <Switch
                value={timerEnabled}
                onValueChange={setTimerEnabled}
                trackColor={{ false: '#E0E0E0', true: '#A5D6A7' }}
                thumbColor={timerEnabled ? '#4CAF50' : '#BDBDBD'}
              />
            </View>

            {timerEnabled && (
              <View style={styles.timerSliderContainer}>
                <Text style={styles.timerValue}>
                  Süre: {timerSeconds} saniye
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={10}
                  maximumValue={120}
                  step={5}
                  value={timerSeconds}
                  onValueChange={(value) => setTimerSeconds(value)}
                  minimumTrackTintColor="#4CAF50"
                  maximumTrackTintColor="#E0E0E0"
                  thumbTintColor="#4CAF50"
                />
              </View>
            )}
          </View>

          <View style={styles.settingContainer}>
            <Text style={styles.settingTitle}>Hedef Puan</Text>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Hedef Puanı Etkinleştir</Text>
              <Switch
                value={targetEnabled}
                onValueChange={setTargetEnabled}
                trackColor={{ false: '#E0E0E0', true: '#FFCC80' }}
                thumbColor={targetEnabled ? '#FF9800' : '#BDBDBD'}
              />
            </View>
            
            {targetEnabled && (
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <TextInput
                  style={styles.targetScoreInput}
                  keyboardType="numeric"
                  value={targetScore}
                  onChangeText={(text) => setTargetScore(text.replace(/[^0-9]/g, ''))}
                  placeholder="Hedef puanı girin"
                  maxLength={3}
                />
              </TouchableWithoutFeedback>
            )}
          </View>

          <View style={styles.settingContainer}>
            <Text style={styles.settingTitle}>Ses Ayarları</Text>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Ses Efektleri</Text>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: '#E0E0E0', true: '#90CAF9' }}
                thumbColor={soundEnabled ? '#2196F3' : '#BDBDBD'}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: getOperationColor() }]}
            onPress={handleStartGame}
          >
            <Text style={styles.startButtonText}>Oyunu Başlat</Text>
          </TouchableOpacity>
          
          {/* Ek alt boşluk */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    paddingBottom: 150,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  operationBadge: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 25,
    elevation: 6,
    borderWidth: 3,
  },
  operationBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  settingContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  settingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 5,
    borderWidth: 2,
  },
  easyButton: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8E9', // Very light green background
  },
  mediumButton: {
    borderColor: '#FF9800',
    backgroundColor: '#FFF8E1', // Very light orange background
  },
  hardButton: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE', // Very light red background
  },
  activeButton: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    borderWidth: 3, // Thicker border for active button
  },
  difficultyButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  activeButtonText: {
    color: '#333',
    fontSize: 17,
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  timerSliderContainer: {
    marginBottom: 10,
  },
  timerValue: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  targetScoreInput: {
    borderWidth: 2,
    borderColor: '#BBDEFB',
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
}); 