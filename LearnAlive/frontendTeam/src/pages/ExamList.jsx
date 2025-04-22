import { useState, useEffect } from 'react';
import { fetchExams, ExamResultsByExamId } from '../api/examApi';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import ExamCreate from './ExamCreate';
import ExamDetail from './ExamDetail';
import ExamResult from './ExamResult';
import ExamTake from './ExamTake';
import ExamResults from '../components/ExamResults';

const ExamList = () => {
  const { classId } = useParams();
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // list, create, detail, take, result, results
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [examResults, setExamResults] = useState([]);

  useEffect(() => {
    if (!classId || !user) return;
    fetchExams(classId, user.userId)
      .then((data) => {
        setExams(data);
      })
      .catch((error) => {
        console.error('❌ 시험 목록 불러오기 실패:', error);
      });
  }, [classId, user]);

  // 시험 목록을 새로고침하는 함수
  const refreshExams = () => {
    fetchExams(classId, user.userId)
      .then((data) => setExams(data))
      .catch((error) => console.error('❌ 시험 목록 불러오기 실패:', error));
  };

  // 시험 생성 후 목록으로 복귀
  const handleExamCreated = () => {
    setViewMode('list');
    refreshExams();
  };

  // 시험 클릭 시 역할 및 응시 여부에 따라 화면 전환
  const handleExamClick = (exam) => {
    setSelectedExamId(exam.examId);
    if (user.role === 'student') {
      if (exam.score !== undefined && exam.score !== null) {
        setViewMode('result'); // 이미 응시한 경우 학생 결과 화면
      } else {
        setViewMode('take'); // 미응시한 경우 시험 응시 화면
      }
    } else {
      // 교수자인 경우 시험 제목 클릭 시 상세 화면으로 이동
      setViewMode('detail');
    }
  };

  // 교수자가 '점수 조회' 버튼 클릭 시 전체 시험 결과 화면 열기
  const openExamResults = (examId) => {
    setSelectedExamId(examId);
    ExamResultsByExamId(examId)
      .then((data) => {
        setExamResults(data);
        setViewMode('results');
      })
      .catch((error) => {
        console.error('❌ 시험 결과 불러오기 실패:', error);
      });
  };

  if (!user) return <p>로그인 해주세요.</p>;

  return (
    <div className="post-container">
      {viewMode === 'list' && (
        <>
          <h2 className="title-bar">📝 시험 목록</h2>
          {user.role === 'professor' && (
            <button
              onClick={() => setViewMode('create')}
              className="normal-button"
            >
              💁‍♀️ 시험 추가
            </button>
          )}
          {exams.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>시험명</th>
                  <th>담당 교수</th>
                  <th>문항수</th>
                  <th>시험 시작</th>
                  <th>시험 종료</th>
                  <th>시험 점수</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.examId}>
                    <td
                      onClick={() => handleExamClick(exam)}
                      className="post-title"
                    >
                      {exam.title}
                    </td>
                    <td>{exam.profName || '-'}</td>
                    <td>{exam.questionCount || '-'}</td>
                    <td>
                      {exam.startTime ? exam.startTime.replace('T', ' ') : '-'}
                    </td>
                    <td>
                      {exam.endTime ? exam.endTime.replace('T', ' ') : '-'}
                    </td>
                    <td>
                      {user.role === 'student' ? (
                        exam.score || '미응시'
                      ) : (
                        <button
                          onClick={() => openExamResults(exam.examId)}
                          className="normal-button"
                        >
                          점수 조회
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>📌 아직 시험이 개설되지 않았습니다.</p>
          )}
        </>
      )}

      {viewMode === 'create' && (
        <ExamCreate
          classId={classId}
          onExamCreated={handleExamCreated}
          onBack={() => setViewMode('list')}
        />
      )}

      {viewMode === 'detail' && selectedExamId && (
        <ExamDetail
          examId={selectedExamId}
          onBack={() => setViewMode('list')}
        />
      )}

      {viewMode === 'take' && selectedExamId && (
        <ExamTake
          examId={selectedExamId}
          classId={classId}
          onBack={() => setViewMode('list')}
          onExamSubmitted={() => {
            setViewMode('result');
            window.scrollTo(0, 0);
          }}
        />
      )}

      {viewMode === 'result' && selectedExamId && (
        <ExamResult
          examId={selectedExamId}
          classId={classId}
          onBack={() => {
            setViewMode('list');
            refreshExams();
          }}
        />
      )}

      {viewMode === 'results' && (
        <ExamResults
          examResults={examResults}
          onBack={() => setViewMode('list')}
        />
      )}
    </div>
  );
};

export default ExamList;
