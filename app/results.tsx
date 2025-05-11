import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { saveGameResult } from '../services/historyService';

// Define operation names
const operationNames = {
  addition: 'Toplama',
  subtraction: 'Çıkarma',
  multiplication: 'Çarpma',
  division: 'Bölme',
};

export default function ResultsScreen() {
  const params = useLocalSearchParams<{ 
    score: string; 
    questionCount: string;
    operation: string;
    percentage: string;
    targetEnabled: string;
    targetScore: string;
    targetSuccess: string;
    timeExpired: string;
    difficulty: string;
    timerEnabled: string;
    timerSeconds: string;
    soundEnabled: string;
  }>();
  const router = useRouter();
  
  // Parse params with fallbacks
  const score = parseInt(params.score || '0', 10);
  const questionCount = parseInt(params.questionCount || '0', 10);
  const operation = params.operation || '';
  const percentage = parseInt(params.percentage || '0', 10);
  const targetEnabled = params.targetEnabled === 'true';
  const targetScore = parseInt(params.targetScore || '50', 10);
  const targetSuccess = params.targetSuccess === 'true';
  const timeExpired = params.timeExpired === 'true';
  const difficulty = params.difficulty || 'easy';
  const timerEnabled = params.timerEnabled === 'true';
  const timerSeconds = parseInt(params.timerSeconds || '30', 10);
  const soundEnabled = params.soundEnabled === 'true';
  
  // Save game result to history
  useEffect(() => {
    const saveHistory = async () => {
      await saveGameResult({
        operation,
        score,
        questionCount,
        difficulty,
        percentage
      });
    };
    
    saveHistory();
  }, [operation, score, questionCount, difficulty, percentage]);
  
  // Get feedback based on performance and target status
  const getFeedback = () => {
    // Target score feedback takes priority
    if (targetEnabled) {
      if (targetSuccess) {
        return 'Harika! Hedef puanını başardın!';
      } else if (timeExpired) {
        return 'Süre doldu! Hedef puanı yakalayamadın, tekrar dene!';
      } else {
        return 'Hedef puanı yakalayamadın, tekrar dene!';
      }
    }
    
    // Regular performance feedback (for non-target games)
    if (percentage >= 90) return 'Mükemmel! Çok iyi iş çıkardın!';
    if (percentage >= 70) return 'Çok güzel! İyi iş çıkardın!';
    if (percentage >= 50) return 'İyi! Biraz daha pratik yaparsan daha iyi olacak.';
    return 'Daha fazla pratik yapmaya ne dersin?';
  };
  
  // Get performance emoji
  const getEmoji = () => {
    if (targetEnabled && !targetSuccess) return '🤔';
    
    if (percentage >= 90) return '🏆';
    if (percentage >= 70) return '😊';
    if (percentage >= 50) return '🙂';
    return '🤔';
  };
  
  // Replay with the same settings
  const handlePlayAgain = () => {
    router.push({
      pathname: '/settings',
      params: { 
        operation,
        difficulty: params.difficulty || 'easy',
        timerEnabled: params.timerEnabled || 'false',
        timerSeconds: params.timerSeconds || '30',
        soundEnabled: params.soundEnabled || 'true',
        targetEnabled: params.targetEnabled || 'false',
        targetScore: params.targetScore || '50'
      }
    } as any);
  };
  
  // Handle go home button
  const handleGoHome = () => {
    router.push('/');
  };

  // View game history
  const handleViewHistory = () => {
    router.push('/history');
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Sonuçlar',
          headerStyle: { backgroundColor: '#6A1B9A' },
          headerBackVisible: false,
          headerTintColor: '#fff',
        }} 
      />
      
      <View style={styles.container}>
        <Text style={styles.emoji}>{getEmoji()}</Text>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          bounces={true}
        >
          <View style={styles.resultCard}>
            <View style={styles.headerRow}>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Sonuçların</Text>
              </View>
            </View>
            
            <View style={styles.statSection}>
              <Text style={styles.statTitle}>İşlem:</Text>
              <Text style={styles.statValue}>
                {operationNames[operation as keyof typeof operationNames] || 'İşlem'}
              </Text>
            </View>
            
            <View style={styles.statSection}>
              <Text style={styles.statTitle}>Toplam Soru:</Text>
              <Text style={styles.statValue}>{questionCount}</Text>
            </View>
            
            <View style={styles.statSection}>
              <Text style={styles.statTitle}>Doğru Cevaplar:</Text>
              <Text style={styles.statValueSmall}>{score / 10}</Text>
            </View>
            
            <View style={styles.statSection}>
              <Text style={styles.statTitle}>Toplam Puan:</Text>
              <Text style={styles.statValue}>{score}</Text>
            </View>
            
            {targetEnabled && (
              <View style={styles.statSection}>
                <Text style={styles.statTitle}>Hedef Puan:</Text>
                <Text style={[
                  styles.statValue,
                  targetSuccess ? styles.successText : styles.failureText
                ]}>
                  {score}/{targetScore} {targetSuccess && '✓'}
                </Text>
              </View>
            )}
            
            <View style={styles.progressContainer}>
              <Text style={styles.statTitle}>Performansın</Text>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar,
                    { width: `${percentage}%` },
                    getProgressBarColor(percentage)
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{percentage}%</Text>
            </View>
            
            <Text style={styles.feedback}>{getFeedback()}</Text>
          </View>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]}
              onPress={handlePlayAgain}
            >
              <Text style={styles.buttonText}>Tekrar Oyna</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]}
              onPress={handleViewHistory}
            >
              <Text style={styles.buttonText}>Geçmişi Gör</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.homeButton]}
              onPress={handleGoHome}
            >
              <Text style={styles.buttonText}>Ana Sayfa</Text>
            </TouchableOpacity>
            
            <View style={{ height: 50 }} />
          </View>
        </ScrollView>
      </View>
    </>
  );
}

// Get progress bar color based on percentage
function getProgressBarColor(percentage: number) {
  if (percentage >= 90) return { backgroundColor: '#4CAF50' };
  if (percentage >= 70) return { backgroundColor: '#8BC34A' };
  if (percentage >= 50) return { backgroundColor: '#FFC107' };
  return { backgroundColor: '#F44336' };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5', // Light purple background
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 20,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#CE93D8',
    maxHeight: 'auto', // Maksimum yükseklik sınırını kaldırdık
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  titleContainer: {
    backgroundColor: '#9C27B0',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  titleText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  operationIcon: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  statSection: {
    marginVertical: 10,
  },
  statTitle: {
    fontSize: 16,
    color: '#7B1FA2',
    marginBottom: 5,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4A148C',
  },
  statValueSmall: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A148C',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#E1BEE7',
    borderRadius: 16,
    padding: 14,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 2,
    borderColor: '#BA68C8',
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBarContainer: {
    height: 25,
    backgroundColor: '#E1BEE7',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#9575CD',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#673AB7',
    borderRadius: 12,
    overflow: 'hidden',
  },
  progressText: {
    position: 'absolute',
    right: 10,
    top: 3,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  feedback: {
    marginTop: 16,
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'column', // Dikey düzende butonlar
    width: '100%',
    marginTop: 20,
    gap: 12, // Butonlar arası boşluk
  },
  button: {
    width: '100%', // Tam genişlik
    paddingVertical: 18,
    borderRadius: 20,
    elevation: 8, // Daha belirgin gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    marginBottom: 12, // Ekstra alt boşluk
  },
  primaryButton: {
    backgroundColor: '#8E24AA',
    borderColor: '#6A1B9A',
  },
  secondaryButton: {
    backgroundColor: '#4DB6AC',
    borderColor: '#00897B',
  },
  homeButton: {
    backgroundColor: '#FF7043', // Farklı renk vererek vurgu
    borderColor: '#E64A19',
    marginBottom: 0, // Son buton için alt boşluğu kaldır
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22, // Daha büyük yazı
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  successText: {
    color: '#4CAF50',
  },
  failureText: {
    color: '#F44336',
  },
  targetMissedText: {
    color: '#D50000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    backgroundColor: '#FFCDD2',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#EF5350',
  },
}); 