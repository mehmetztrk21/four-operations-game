import { Audio } from 'expo-av';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Define operation titles and symbols
const operationInfo = {
  addition: { title: 'Toplama', symbol: '+' },
  subtraction: { title: 'Çıkarma', symbol: '-' },
  multiplication: { title: 'Çarpma', symbol: '×' },
  division: { title: 'Bölme', symbol: '÷' },
};

// Generate random numbers based on operation and difficulty
const generateNumbers = (operation: string, difficulty: string) => {
  let num1, num2;
  
  switch (operation) {
    case 'addition':
      if (difficulty === 'easy') {
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
      } else if (difficulty === 'medium') {
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
      } else { // hard
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 100) + 1;
      }
      break;
    case 'subtraction':
      if (difficulty === 'easy') {
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * num1) + 1;
      } else if (difficulty === 'medium') {
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * num1) + 1;
      } else { // hard
        num1 = Math.floor(Math.random() * 100) + 50;
        num2 = Math.floor(Math.random() * 50) + 1;
      }
      break;
    case 'multiplication':
      if (difficulty === 'easy') {
        num1 = Math.floor(Math.random() * 5) + 1;
        num2 = Math.floor(Math.random() * 5) + 1;
      } else if (difficulty === 'medium') {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
      } else { // hard
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
      }
      break;
    case 'division':
      if (difficulty === 'easy') {
        num2 = Math.floor(Math.random() * 5) + 1; // Divisor
        num1 = num2 * (Math.floor(Math.random() * 5) + 1); // Make sure it's divisible
      } else if (difficulty === 'medium') {
        num2 = Math.floor(Math.random() * 10) + 1; // Divisor
        num1 = num2 * (Math.floor(Math.random() * 10) + 1);
      } else { // hard
        num2 = Math.floor(Math.random() * 12) + 1; // Divisor
        num1 = num2 * (Math.floor(Math.random() * 12) + 1);
      }
      break;
    default:
      num1 = 1;
      num2 = 1;
  }
  
  return { num1, num2 };
};

// Calculate correct answer
const calculateAnswer = (num1: number, num2: number, operation: string) => {
  switch (operation) {
    case 'addition':
      return num1 + num2;
    case 'subtraction':
      return num1 - num2;
    case 'multiplication':
      return num1 * num2;
    case 'division':
      return num1 / num2;
    default:
      return 0;
  }
};

export default function OperationScreen() {
  const params = useLocalSearchParams<{ 
    operation: string;
    difficulty: string;
    timerEnabled: string;
    timerSeconds: string;
    soundEnabled: string;
    targetEnabled: string;
    targetScore: string;
  }>();
  const router = useRouter();
  
  // Parse params
  const operation = params.operation || 'addition';
  const difficulty = params.difficulty || 'easy';
  const timerEnabled = params.timerEnabled === 'true';
  const timerSeconds = parseInt(params.timerSeconds || '30');
  const soundEnabled = params.soundEnabled === 'true';
  const targetEnabled = params.targetEnabled === 'true';
  const targetScoreValue = parseInt(params.targetScore || '50');
  
  // Game state
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  const [showWrongAnimation, setShowWrongAnimation] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [targetReached, setTargetReached] = useState(false);
  const [finishButtonActive, setFinishButtonActive] = useState(!targetEnabled);
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<number[]>([]);
  
  // References
  const inputRef = useRef<TextInput>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const correctSound = useRef<Audio.Sound | null>(null);
  const wrongSound = useRef<Audio.Sound | null>(null);
  
  // Animation values
  const shake = useRef(new Animated.Value(0)).current;
  
  // Generate new question
  const generateQuestion = () => {
    const { num1, num2 } = generateNumbers(operation, difficulty);
    setNum1(num1);
    setNum2(num2);
    const answer = calculateAnswer(num1, num2, operation);
    setCorrectAnswer(answer);
    setUserAnswer('');
    
    // Generate multiple choice options for easy mode
    if (difficulty === 'easy') {
      setMultipleChoiceOptions(generateMultipleChoiceOptions(answer, operation));
    }
    
    // Focus input for better UX if not in easy mode
    if (difficulty !== 'easy') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };
  
  // Initialize sounds
  useEffect(() => {
    const loadSounds = async () => {
      try {
        const { sound: correctSoundObj } = await Audio.Sound.createAsync(
          require('../../assets/sounds/correct.mp3')
        );
        correctSound.current = correctSoundObj;
        
        const { sound: wrongSoundObj } = await Audio.Sound.createAsync(
          require('../../assets/sounds/wrong.mp3')
        );
        wrongSound.current = wrongSoundObj;
      } catch (error) {
        console.log('Error loading sounds:', error);
      }
    };
    
    if (soundEnabled) {
      loadSounds();
    }
    
    return () => {
      // Unload sounds on unmount
      if (correctSound.current) {
        correctSound.current.unloadAsync();
      }
      if (wrongSound.current) {
        wrongSound.current.unloadAsync();
      }
    };
  }, [soundEnabled]);
  
  // Timer logic
  useEffect(() => {
    if (timerEnabled) {
      setTimeLeft(timerSeconds);
      
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000) as any;
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerEnabled, timerSeconds]);
  
  // Watch timeLeft and finish game when it reaches 0
  useEffect(() => {
    if (timerEnabled && timeLeft === 0) {
      // Clear the interval to prevent further updates
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Use setTimeout to delay the navigation until after the render is complete
      const timeout = setTimeout(() => {
        finishGame();
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [timeLeft, timerEnabled]);
  
  // Watch for target score reached
  useEffect(() => {
    if (targetEnabled && score >= targetScoreValue && !targetReached) {
      setTargetReached(true);
      setFinishButtonActive(true);
      
      // Play success sound
      if (soundEnabled) {
        playSound(true);
      }
      
      // Show congratulations message
      // Alert.alert(
      //   "Tebrikler!",
      //   "Hedef puanına ulaştınız! Devam edebilir veya bitir butonuna basarak sonuçları görebilirsiniz.",
      //   [{ text: "Tamam", style: "default" }]
      // );
      finishGame();
    }
  }, [score, targetEnabled, targetScoreValue]);
  
  // Initial question
  useEffect(() => {
    generateQuestion();
  }, [operation, difficulty]);
  
  // Play a sound
  const playSound = async (isCorrect: boolean) => {
    if (!soundEnabled) return;
    
    try {
      if (isCorrect && correctSound.current) {
        await correctSound.current.replayAsync();
      } else if (!isCorrect && wrongSound.current) {
        await wrongSound.current.replayAsync();
      }
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };
  
  // Shake animation for wrong answers
  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };
  
  // Generate multiple choice options
  const generateMultipleChoiceOptions = (correctAnswer: number, operation: string) => {
    const options = [correctAnswer];
    
    // Generate two wrong options that make sense
    while (options.length < 3) {
      let wrongOption;
      
      // Generate options appropriate to operation and not too far from correct answer
      switch (operation) {
        case 'addition':
          wrongOption = correctAnswer + Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1);
          break;
        case 'subtraction':
          wrongOption = correctAnswer + Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1);
          break;
        case 'multiplication':
          wrongOption = correctAnswer + Math.floor(Math.random() * 3) * (Math.random() > 0.5 ? 1 : -1);
          break;
        case 'division':
          wrongOption = correctAnswer + (Math.random() > 0.5 ? 1 : -1);
          break;
        default:
          wrongOption = correctAnswer + Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1);
      }
      
      // Make sure it's not negative or the same as another option
      if (wrongOption > 0 && !options.includes(wrongOption)) {
        options.push(wrongOption);
      }
    }
    
    // Shuffle the options
    return options.sort(() => Math.random() - 0.5);
  };
  
  // Check answer function (for typing mode)
  const checkAnswer = () => {
    const parsedAnswer = parseFloat(userAnswer);
    
    if (isNaN(parsedAnswer)) {
      // Empty or invalid input - shake the input
      shakeAnimation();
      return;
    }
    
    // For division, handle floating point precision issues
    const isCorrect = operation === 'division' 
      ? Math.abs(parsedAnswer - correctAnswer) < 0.01
      : parsedAnswer === correctAnswer;
    
    processAnswer(isCorrect);
  };
  
  // Process answer (common logic for both typed and multiple choice)
  const processAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      // Increment question count and score
      setQuestionCount(questionCount + 1);
      setScore(score + 10);
      
      // Reset wrong attempts counter
      setWrongAttempts(0);
      
      // Show correct animation and play sound
      setShowCorrectAnimation(true);
      playSound(true);
      
      // Hide animation after 1 second and generate new question
      setTimeout(() => {
        setShowCorrectAnimation(false);
        generateQuestion(); // Generate new question only on correct answer
      }, 1000);
    } else {
      // Increment wrong attempts counter
      setWrongAttempts(wrongAttempts + 1);
      
      // Show wrong animation and play sound
      setShowWrongAnimation(true);
      playSound(false);
      
      // Hide animation after 1 second
      setTimeout(() => {
        setShowWrongAnimation(false);
        // Only clear input if not in multiple choice mode
        if (difficulty !== 'easy') {
          setUserAnswer(''); 
          // Focus input for better UX
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);
        }
      }, 1000);
    }
  };
  
  // Handle multiple choice selection
  const handleMultipleChoiceSelect = (selectedAnswer: number) => {
    const isCorrect = selectedAnswer === correctAnswer;
    processAnswer(isCorrect);
  };
  
  // Finish game and show results
  const finishGame = () => {
    // Clear timer if active
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // If no questions were answered, set at least 1 to avoid division by zero
    const finalQuestionCount = Math.max(questionCount, 1);
    
    // Determine if game was successful based on target
    const targetSuccess = !targetEnabled || (targetEnabled && score >= targetScoreValue);
    const timeExpired = timerEnabled && timeLeft === 0;
    
    // Calculate percentage of correct answers
    let percentage = Math.round((score / (finalQuestionCount * 10)) * 100);
    
    // If target score was enabled but not reached, adjust percentage to reflect that
    if (targetEnabled && !targetSuccess) {
      // Calculate percentage based on target score instead
      percentage = Math.round((score / targetScoreValue) * 100);
    }
    
    router.push({
      pathname: '/results',
      params: { 
        // Game results
        score: score.toString(), 
        questionCount: finalQuestionCount.toString(), 
        operation,
        percentage: percentage.toString(),
        
        // Target-related settings
        targetEnabled: targetEnabled ? 'true' : 'false',
        targetScore: targetScoreValue.toString(),
        targetSuccess: targetSuccess ? 'true' : 'false',
        timeExpired: timeExpired ? 'true' : 'false',
        
        // Original game settings (for play again)
        difficulty,
        timerEnabled: timerEnabled ? 'true' : 'false',
        timerSeconds: timerSeconds.toString(),
        soundEnabled: soundEnabled ? 'true' : 'false'
      }
    } as any);
  };
  
  // Get operation title and symbol
  const { title, symbol } = operationInfo[operation as keyof typeof operationInfo] || 
    { title: 'İşlem', symbol: '?' };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title,
          headerBackTitle: "Ayarlar",
          headerBackVisible: false,
          headerStyle: { backgroundColor: getOperationColor(operation) },
          headerTintColor: '#fff' 
        }} 
      />
      
      <View style={styles.container}>
        {timerEnabled && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              Süre: {timeLeft}s
            </Text>
          </View>
        )}
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Puan: {score}</Text>
          <Text style={styles.scoreText}>Soru: {questionCount}</Text>
        </View>
        
        <Animated.View 
          style={[
            styles.questionContainer,
            { transform: [{ translateX: shake }] }
          ]}
        >
          <Text style={styles.questionText}>{num1}</Text>
          <Text style={styles.operationSymbol}>{symbol}</Text>
          <Text style={styles.questionText}>{num2}</Text>
          <Text style={styles.operationSymbol}>=</Text>
          
          {difficulty === 'easy' ? (
            <View style={styles.multipleChoiceContainer}>
              {wrongAttempts >= 2 && (
                <View style={styles.hintContainer}>
                  <Text style={styles.hintText}>
                    İpucu: Cevap {correctAnswer}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <TextInput
              ref={inputRef}
              style={styles.input}
              keyboardType="numeric"
              value={userAnswer}
              onChangeText={setUserAnswer}
              placeholder="?"
              placeholderTextColor="#999"
              maxLength={5}
              onSubmitEditing={checkAnswer}
            />
          )}
          
          {/* Show hint after 2 wrong attempts for type-in answers */}
          {difficulty !== 'easy' && wrongAttempts >= 2 && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>
                İpucu: Cevap {correctAnswer}
              </Text>
            </View>
          )}
        </Animated.View>
        
        {/* Multiple choice options */}
        {difficulty === 'easy' && (
          <View style={styles.optionsContainer}>
            {multipleChoiceOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleMultipleChoiceSelect(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {/* Answer/Finish buttons */}
        <View style={styles.buttonContainer}>
          {difficulty !== 'easy' && (
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: getOperationColor(operation) }]}
              onPress={checkAnswer}
            >
              <Text style={styles.buttonText}>Cevapla</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[
              styles.button, 
              finishButtonActive ? styles.finishButton : styles.finishButtonDisabled,
              difficulty === 'easy' ? styles.wideButton : {}
            ]}
            onPress={finishGame}
            disabled={!finishButtonActive}
          >
            <Text style={styles.buttonText}>
              {targetEnabled && !targetReached ? `Hedef: ${score}/${targetScoreValue}` : 'Bitir'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Animation overlays */}
        {showCorrectAnimation && (
          <View style={styles.animationOverlay}>
            <LottieView
              source={require('../../assets/animations/correct.json')}
              autoPlay
              loop={false}
              style={styles.animation}
            />
          </View>
        )}
        
        {showWrongAnimation && (
          <View style={styles.animationOverlay}>
            <LottieView
              source={require('../../assets/animations/wrong.json')}
              autoPlay
              loop={false}
              style={styles.animation}
            />
          </View>
        )}
      </View>
    </>
  );
}

// Get color based on operation
function getOperationColor(operation: string | undefined): string {
  switch (operation) {
    case 'addition':
      return '#4CAF50';
    case 'subtraction':
      return '#F44336';
    case 'multiplication':
      return '#2196F3';
    case 'division':
      return '#FF9800';
    default:
      return '#333';
  }
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDE7', // Soft yellow background
    padding: 20,
    borderRadius: 20,
  },
  timerContainer: {
    backgroundColor: '#FFF59D', // Light yellow
    padding: 12,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD600',
    elevation: 4,
  },
  timerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF6D00',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    backgroundColor: '#E0F7FA', // Light cyan
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#00BCD4',
    elevation: 4,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0097A7',
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 3,
    borderColor: '#BBDEFB',
  },
  questionText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3F51B5',
    marginHorizontal: 10,
  },
  operationSymbol: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FF4081',
  },
  input: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3F51B5',
    borderBottomWidth: 3,
    borderBottomColor: '#FF4081',
    minWidth: 70,
    textAlign: 'center',
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 40,
    gap: 20,
  },
  button: {
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  finishButton: {
    backgroundColor: '#FF4081',
    borderColor: '#C2185B',
  },
  finishButtonDisabled: {
    backgroundColor: '#AAAAAA',
    borderColor: '#757575',
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  animationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  animation: {
    width: 250,
    height: 250,
  },
  hintContainer: {
    position: 'absolute',
    bottom: -45,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FBC02D',
  },
  hintText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F57F17',
  },
  multipleChoiceContainer: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingHorizontal: 10,
  },
  optionButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 3,
    borderColor: '#42A5F5',
  },
  optionText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3F51B5',
  },
  wideButton: {
    width: '100%',
  },
}); 