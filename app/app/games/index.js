import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

function Games() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const params = useLocalSearchParams();
  const { gameId } = params;

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    if (gameId) {
      const fetchQuizData = async () => {
        try {
          const response = await fetch(`${API_URL}/api/quiz/${gameId}`);
          const data = await response.json();
          setQuestions(data);
        } catch (error) {
          console.error('Error fetching quiz data:', error);
          Alert.alert('Error', 'Failed to load quiz data.');
        }
      };
      fetchQuizData();
    }
  }, [gameId]);

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    const nextQuestion = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextQuestion);
    if (nextQuestion < questions.length) {
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quiz</Text>
      {showScore ? (
        <>
          <Text style={styles.feedback}>Je hebt {score} van de {questions.length} goed</Text> 
          <Pressable style={styles.redoButton} onPress={resetQuiz}>
            <Text style={styles.redoButtonText}>Probeer opnieuw</Text>
          </Pressable>
        </>
      ) : (
        questions.length > 0 ? (
          <View>
            <Text style={styles.question}>{questions[currentQuestionIndex].question}</Text>
            {questions[currentQuestionIndex].options.map((option, index) => (
              <Pressable key={index} style={styles.option} onPress={() => handleAnswerOptionClick(option === questions[currentQuestionIndex].answer)}>
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Text style={styles.noQuizMessage}>Er is geen quiz voor dit vak</Text>
        )
      )}
    </View>
  );
}

export default Games;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#181818',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: '#a336c1', 
    fontWeight: 'bold',
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
    color: '#FFFFFF', 
  },
  option: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#282828', 
    borderRadius: 5, 
    borderWidth: 1,
    borderColor: '#404040',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  feedback: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#a336c1', 
  },
  redoButton: {
    marginTop: 20,
    backgroundColor: '#a336c1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  redoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noQuizMessage: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
