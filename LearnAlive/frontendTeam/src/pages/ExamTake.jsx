import { useEffect, useState } from 'react';
import { fetchExamDetail, submitExam } from '../api/examApi';
import { useAuth } from '../context/AuthContext';
import '../styles/ExamTake.css';
import PropTypes from 'prop-types';

const ExamTake = ({ examId, onBack, onExamSubmitted }) => {
  const { user } = useAuth();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [totalExamTime, setTotalExamTime] = useState(null);

  useEffect(() => {
    const loadExam = async () => {
      try {
        const data = await fetchExamDetail(examId);
        console.log('📥 불러온 시험 데이터:', data);
        if (data && Array.isArray(data.questions)) {
          setExam(data);
          setAnswers(new Array(data.questions.length).fill(null));

          const endTime = new Date(data.endTime); // 시험 종료 시간
          const startTime = new Date(data.startTime); // 시험 시작 시간
          const totalExamTime = endTime - startTime; // 총 시험 시간 (ms 단위)
          let timeRemaining = totalExamTime;
          const totalTime = Math.floor((endTime - startTime) / 60000); // 분 단위 변환
          setTotalExamTime(totalTime); // 상태 저장

          const timer = setInterval(() => {
            if (timeRemaining <= 0) {
              clearInterval(timer);
              setTimeLeft(0); // 시간 종료
            } else {
              timeRemaining -= 1000; // 1초씩 차감
              setTimeLeft(timeRemaining); // 남은 시간 업데이트
            }
          }, 1000);

          return () => clearInterval(timer); // 컴포넌트가 unmount 될 때 interval 해제
        } else {
          console.error('시험 데이터에 문제가 있습니다.', data);
        }
      } catch (error) {
        console.error('시험 정보를 불러오는 데 실패했습니다.', error);
      }
    };
    loadExam();
  }, [examId]);

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const unansweredQuestions = [];
    answers.forEach((answer, index) => {
      if (answer === null) {
        unansweredQuestions.push(index + 1);
      }
    });

    if (unansweredQuestions.length > 0) {
      alert(`${unansweredQuestions.join(', ')}번 문제의 답을 선택하세요!`);
      return;
    }

    const examData = {
      examId,
      studentId: user.userId,
      answers,
    };

    setIsSubmitting(true);
    try {
      const result = await submitExam(examData);
      console.log('시험 제출 결과:', result);
      alert('시험 제출 완료!');
      onExamSubmitted();
    } catch (error) {
      console.error('시험 제출 실패:', error);
      alert('시험 제출에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAnsweredCount = () => {
    return answers.filter((answer) => answer !== null).length;
  };

  if (!exam || !exam.questions || exam.questions.length === 0) {
    return <p className="loading">시험 정보를 불러오는 중...</p>;
  }

  const formatTime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    // const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="exam-container">
      <div className="exam-header">
        <h2 className="exam-title">{exam.title} (시험 응시)</h2>
      </div>

      <div className="exam-info">
        <div className="exam-info-field-1">
          <span>
            담당 교수 : {exam.profName}
            <br />
            <br />
            수료기준 : 60점
            <br />
            <br />총 시험 시간 : {totalExamTime}분
            <br />
            <br />
            시험 시작 시간 : {exam.startTime.replace('T', ' ')}
            <br />
            <br />
            시험 종료 시간 : {exam.endTime.replace('T', ' ')}
          </span>
          <div className="timer-container">
            <div className="timer-header-1">
              <div className="timer-1">
                ⏱️ {timeLeft !== null ? formatTime(timeLeft) : '00:00'}
              </div>
              <div className="getAnsweredCount">
                {getAnsweredCount()}/{exam.questionCount}
              </div>
            </div>

            <div className="answer-preview-1">
              {exam.questions.map((question, index) => (
                <span key={index} className="answer-item-1">
                  <span>{index + 1}</span>
                  {answers[index] !== null ? (
                    <span className="answered">✅</span>
                  ) : (
                    <span className="not-answered">⬜</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        <h3>시험 문제 ({exam.questionCount}문항)</h3>

        <div className="question-options">
          {exam.questions.map((question, index) => (
            <div key={index}>
              <div className="question-header-1">
                <h3 className="question-number-1">Q{index + 1}.</h3>
                <div className="question-title-1">{question.questionTitle}</div>
                {/* 오른쪽: 점수 */}
                <span className="score1">0/5</span>
              </div>
              <div className="question-text">{question.questionText}</div>
              {['answer1', 'answer2', 'answer3', 'answer4'].map((key, i) => (
                <div key={i} className="option">
                  <label>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      className="Qoption1"
                      value={i + 1}
                      checked={answers[index] === i + 1}
                      onChange={() => handleAnswerChange(index, i + 1)}
                    />
                    {i + 1}. {question[key] || '선택지 없음'}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="submit-container">
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            시험 제출
          </button>
        </div>

        <div className="button-container">
          <button className="back-btn" onClick={onBack}>
            ⬅ 목록으로
          </button>
        </div>
      </div>
    </div>
  );
};

ExamTake.propTypes = {
  examId: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
  onExamSubmitted: PropTypes.func.isRequired,
};

export default ExamTake;
