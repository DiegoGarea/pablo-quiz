import React, {useState, useEffect} from 'react';
import questions from '../data/questions';
import timer from '../assets/timer.png';

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [milliseconds, setMilliseconds] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    let interval;

    if (quizStarted && !quizFinished) {
      interval = setInterval(() => {
        const currentTime = new Date();
        const elapsedTime = currentTime - quizStartTime;
        const seconds = Math.floor(elapsedTime / 1000);
        const milliseconds = elapsedTime % 1000;

        setSeconds(seconds);
        setMilliseconds(milliseconds);
      }, 1);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [quizStarted, quizFinished, quizStartTime]);

  const handleNextQuestion = () => {
    if (
      currentQuestionIndex < shuffledQuestions.length - 1 &&
      isCorrect === true
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsCorrect(null);
      setSelectedOptionIndex(null);
    }
    if (currentQuestionIndex === shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionIndex(null);
      setQuizStarted(false);
      setQuizFinished(true);
    }
    if (isCorrect === false) {
      setQuizStarted(false);
      setSelectedOptionIndex(null);
    }
  };

  const handleAnswerClick = (isCorrectAnswer, index) => {
    if (selectedOptionIndex !== index) {
      setSelectedOptionIndex(index);
      setIsCorrect(isCorrectAnswer);
    }
  };

  const startQuiz = () => {
    const shuffled = questions
      .map((item) => ({item, random: Math.random()}))
      .sort((a, b) => a.random - b.random);

    const shuffledQuestionsWithAnswers = shuffled.map(({item}) => ({
      ...item,
      answerOptions: item.answerOptions
        .map((option) => ({option, random: Math.random()}))
        .sort((a, b) => a.random - b.random)
        .map(({option}) => option),
    }));

    setShuffledQuestions(shuffledQuestionsWithAnswers);
    setSelectedOptionIndex(null);
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setQuizFinished(false);
    setIsCorrect(null);
    setSeconds(0);
    setMilliseconds(0);
    setQuizStartTime(new Date());
  };

  return (
    <div className="flex justify-center items-center border-[1px] m-auto mt-20 w-[800px] p-[120px] shadow-md shadow-black-500/50">
      {quizStarted ? (
        <div>
          <div className="flex text-[20px] text-center mb-10 justify-end">
            <img src={timer} alt="timer" />
            {seconds}.{milliseconds} sec
          </div>
          {shuffledQuestions.map(({questionText, answerOptions}, index) => (
            <div
              key={index}
              style={{
                display: index === currentQuestionIndex ? 'block' : 'none',
              }}
            >
              <div className="flex items-center mb-10">
                <p className="mx-2 bg-red-700 w-[50px] h-[50px] rounded-full text-center text-white text-[35px]">
                  {currentQuestionIndex + 1}
                </p>
                <p className="text-gray-400">{questionText}</p>
              </div>
              <div>
                {answerOptions.map(({answerText, isCorrect}, index) => (
                  <div
                    key={index}
                    onClick={() => handleAnswerClick(isCorrect, index)}
                    className={`${
                      selectedOptionIndex === index
                        ? 'bg-gray-500 text-white'
                        : 'bg-white text-red-700'
                    } rounded-md p-2 cursor-pointer border-[2px] border-bg-gray mt-[20px] text-center font-bold`}
                  >
                    {answerText}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button
            className="text-[20px] bg-red-700 text-white w-[100%] py-[8px] mt-[20px] hover:bg-red-800"
            onClick={() => handleNextQuestion()}
          >
            SIGUIENTE
          </button>
        </div>
      ) : (
        <div className="bg-red">
          <div className="text-center">
            Obtuviste {currentQuestionIndex} respuestas correctas
          </div>
          <div className="flex text-center">
            <img src={timer} alt="timer" className="px-[10px]" />
            Tiempo transcurrido: {seconds}.{milliseconds} segundos
          </div>
          <button
            className="text-[20px] bg-red-700 text-white rounded-sm px-[120px] py-[8px] mt-[20px] hover:bg-red-800"
            onClick={() => startQuiz()}
          >
            COMENZAR
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
