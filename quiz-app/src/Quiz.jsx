import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Quiz.css'; 

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    axios.post('https://api.essaychecker.ai/quiz/trial/', {})
      .then(response => {
        console.log('API Response:', response.data); 
        
        if (response.data && response.data.data) {
          const questionsArray = Object.values(response.data.data);
          setQuestions(questionsArray);
          setLoading(false);
        } else {
          console.error('Unexpected API response format:', response.data);
          setError('Unexpected response format');
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error fetching quiz data:', error);
        setError('Failed to fetch quiz data');
        setLoading(false);
      });
  }, []);

  const handleAnswerClick = (key) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = key;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (questions.length - 1)) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let calculatedScore = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.ans) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
  };

  if (error) {
    return (
      <div className="quiz-container">
        <h1>Error: {error}</h1>
      </div>
    );
  }

  if (loading) {
    return <p className="loading">Loading questions...</p>;
  }

  if (score !== null) {
    return (
      <div className="quiz-container">
        <h1>Your Score: {score}/{questions.length}</h1>
      </div>
    );
  }

  if (questions.length === 0) {
    return <p className="loading">Loading questions...</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <div className="card">
        <h2 className="question-title">Question {currentQuestionIndex + 1}</h2>
        <p className="question-text">
          Synonym for the word <strong>{currentQuestion.word}</strong>
        </p>
        <div className="answers">
          {Object.keys(currentQuestion.options).map((key) => (
            <button
              key={key}
              className={`answer-button ${selectedAnswer === key ? 'selected' : ''}`}
              onClick={() => handleAnswerClick(key)}
            >
              {currentQuestion.options[key].word}
            </button>
          )) || <p>No answers available</p>}
        </div>
        <button
          className="next-button"
          onClick={handleNextQuestion}
        >
          {currentQuestionIndex < (questions.length - 1) ? 'Next Question' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
