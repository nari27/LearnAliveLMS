import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchExamDetail, updateExam, deleteExam } from '../api/examApi';
import '../styles/ExamDetail.css';
import PropTypes from 'prop-types';

const ExamDetail = ({ examId: propExamId, onUpdated, onBack }) => {
  const { examId: paramExamId } = useParams();
  const finalExamId = propExamId || paramExamId; // props 우선, 없으면 params로 읽음
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedExam, setEditedExam] = useState({
    examId: 0,
    classId: '',
    title: '',
    profName: '',
    startTime: undefined,
    endTime: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    questionCount: 0,
    questions: [],
  });

  useEffect(() => {
    const loadExam = async () => {
      try {
        const data = await fetchExamDetail(finalExamId);
        console.log('📥 불러온 시험 데이터:', data); // 데이터 확인
        if (data) {
          setExam(data);
          setQuestions(data.questions || []);
          setEditedExam({
            examId: data.examId,
            classId: data.classId,
            title: data.title,
            profName: data.profName,
            startTime: data.startTime,
            endTime: data.endTime,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            questionCount: data.questionCount,
            questions: data.questions || [],
          });
        }
      } catch (error) {
        console.error('시험 정보를 불러오는 데 실패했습니다.', error);
      }
    };
    loadExam();
  }, [finalExamId]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    console.log(`변경된 값: ${name} = ${value}`); // 어떤 필드가 변경되었는지 확인
    setEditedExam((prev) => ({ ...prev, [name]: value }));
  };

  const handleCorrectAnswerChange = (index, answer) => {
    const updatedQuestions = [...editedExam.questions];
    updatedQuestions[index].correctAnswer = parseInt(answer, 10); // 숫자 형태로 변경
    setEditedExam((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleQuestionChange = (index, field, value) => {
    console.log(`질문 수정: index=${index}, field=${field}, value=${value}`);
    const updatedQuestions = [...editedExam.questions];
    updatedQuestions[index][field] = value;
    setEditedExam((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...editedExam.questions];
    updatedQuestions[questionIndex][`answer${optionIndex + 1}`] = value;
    setEditedExam((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleUpdate = async () => {
    // 필수 값 확인
    if (!editedExam.title || !editedExam.startTime || !editedExam.endTime) {
      alert('시험정보를 입력해주세요.');
      return;
    }

    try {
      console.log('📤 업데이트 요청 데이터:', editedExam);
      const updatedExam = await updateExam(finalExamId, editedExam);
      console.log('✅ 업데이트된 시험 데이터:', updatedExam);
      if (!updatedExam) {
        alert('시험 정보 수정에 실패했습니다.');
        return;
      }

      // 성공하면 UI 상태 업데이트
      setExam(updatedExam); // 백엔드에서 받은 최신 데이터 적용
      setIsEditing(false);
      alert('시험 정보가 업데이트되었습니다.');
      if (onUpdated) onUpdated(); // 부모에게 리로드 요청
    } catch (error) {
      console.error('❌ 시험 수정 실패:', error);
      alert('시험 수정에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteExam(finalExamId);
        alert('시험이 삭제되었습니다.');
        if (onBack) onBack();
      } catch (error) {
        console.error('시험 삭제에 실패했습니다.', error);
      }
    }
  };

  if (!exam) return <p className="loading">시험 정보를 불러오는 중...</p>;

  return (
    <div className="exam-container">
      <button
        onClick={onBack}
        className="back-button"
        style={{ display: 'block', marginLeft: 'auto' }}
      >
        ⬅ 돌아가기
      </button>
      <h2 className="exam-title">시험 상세보기</h2>

      <div className="exam-info">
        <div className="exam-title-input">
          <label>시험명:</label>
          {isEditing ? (
            <input
              type="text"
              placeholder="시험 제목 입력"
              name="title"
              value={editedExam.title}
              onChange={handleEditChange}
            />
          ) : (
            <span>{exam.title}</span>
          )}
          <label>담당교수:</label>
          {isEditing ? (
            <input
              type="text"
              placeholder="담당교수 입력"
              name="profName"
              value={editedExam.profName}
              onChange={handleEditChange}
            />
          ) : (
            <span className="exam-profname">{exam.profName}</span>
          )}
        </div>

        <div className="exam-field">
          <label>시험 시작 시간:</label>
          {isEditing ? (
            <input
              type="datetime-local"
              name="startTime"
              value={editedExam.startTime}
              onChange={handleEditChange}
            />
          ) : (
            <span className="exam-time">{exam.startTime}</span>
          )}
        </div>

        <div className="exam-field">
          <label className="exam-endtime">시험 종료 시간:</label>
          {isEditing ? (
            <input
              type="datetime-local"
              name="endTime"
              value={editedExam.endTime}
              onChange={handleEditChange}
            />
          ) : (
            <span className="exam-time">{exam.endTime}</span>
          )}
        </div>
      </div>
      <br></br>
      <h3 className="question-title-1">시험 문제 ({questions.length}문항)</h3>
      <div className="question-list">
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <div key={question.questionId} className="Qcard">
              <div className="Qtitle">
                <h4 className="Qnumber">Q{index + 1}.</h4>
                {isEditing ? (
                  <textarea
                    type="title"
                    placeholder="문제 제목 입력"
                    value={question.questionTitle}
                    onChange={(e) =>
                      handleQuestionChange(
                        index,
                        'questionTitle',
                        e.target.value
                      )
                    }
                  />
                ) : (
                  <p>{question.questionTitle}</p>
                )}
              </div>
              {isEditing ? (
                <textarea
                  type="text"
                  className="Qtext"
                  placeholder="문제 입력"
                  value={question.questionText}
                  onChange={(e) =>
                    handleQuestionChange(index, 'questionText', e.target.value)
                  }
                />
              ) : (
                <p className="Qtext">{question.questionText}</p>
              )}

              <div>
                {['answer1', 'answer2', 'answer3', 'answer4'].map(
                  (answer, i) => (
                    <div key={i} className="Qoption">
                      {isEditing ? (
                        <label>
                          <input
                            type="radio"
                            name={`question-${index}`}
                            className="Qradio"
                            checked={question.correctAnswer === i + 1}
                            onChange={() =>
                              handleCorrectAnswerChange(index, i + 1)
                            }
                          />
                          {i + 1}.{' '}
                          <input
                            type="text"
                            className="Qoption-input"
                            placeholder="선택지 입력"
                            value={question[answer]}
                            onChange={(e) =>
                              handleOptionChange(index, i, e.target.value)
                            }
                          />
                        </label>
                      ) : (
                        <label>
                          <input
                            type="radio"
                            name={`question-${index}`}
                            className="Qradio"
                            checked={question.correctAnswer === i + 1}
                            onChange={() =>
                              handleCorrectAnswerChange(index, i + 1)
                            }
                            disabled={!isEditing}
                          />
                          {i + 1}. {question[answer]}
                        </label>
                      )}
                    </div>
                  )
                )}
              </div>
              {isEditing ? (
                <div className="Qcorrect-answer">
                  <label> ✅ 정답 : {question.correctAnswer}</label>
                </div>
              ) : (
                <p className="Qcorrect-answer">
                  정답:{' '}
                  {
                    [1, 2, 3, 4][question.correctAnswer - 1] // 숫자 기준으로 표시
                  }
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="no-questions">등록된 문제가 없습니다.</p>
        )}
      </div>

      <div className="buttons">
        {isEditing ? (
          <>
            <button className="save-btn" onClick={handleUpdate}>
              저장
            </button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>
              취소
            </button>
          </>
        ) : (
          <>
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              수정
            </button>
            <button className="delete-button" onClick={handleDelete}>
              삭제
            </button>
          </>
        )}
      </div>
    </div>
  );
};

ExamDetail.propTypes = {
  examId: PropTypes.number.isRequired,
  onUpdated: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default ExamDetail;
