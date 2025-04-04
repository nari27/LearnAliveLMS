import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom"; // useNavigate 추가
import { useAuth } from "../context/AuthContext";
import { fetchClassrooms } from "../api/classroomApi"; // ✅ API 함수 불러오기

const MyPage = () => {
  const [classrooms, setClassrooms] = useState([]); // 강의실 리스트 상태
  const { user } = useAuth();
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

  const userId = user?.userId; // 로그인한 사용자 ID 가져오기

  // ✅ 강의실 목록 가져오기
  useEffect(() => {
    const getClassrooms = async () => {
      if (!userId) return; // userId가 없으면 요청하지 않음
      try {
        const data = await fetchClassrooms(userId); // API 호출
        setClassrooms(data); // 강의실 목록 저장
      } catch (error) {
        console.error("강의실 목록을 불러오는데 실패했습니다.", error);
      }
    };

    getClassrooms();
  }, [userId]);

  // ✅ 강의실 선택 시 바로 이동
  const handleClassroomChange = (event) => {
    const selectedClassId = event.target.value;
    if (selectedClassId) {
      navigate(`/classroom/${selectedClassId}/boards`); // 강의실 페이지로 이동
    }
  };

  return (
    <div>
      <div className="class-choice">
        {/* 강의실 선택 dropdown */}
        <div className="classroom-detail-container">
        <select onChange={handleClassroomChange} defaultValue="">
          <option value="" disabled> -- 강의실 선택 -- </option>
          {classrooms.map((classroom) => (
            <option key={classroom.classId} value={classroom.classId}>
              {classroom.className} {/* 강의실 이름 표시 */}
            </option>
          ))}
        </select>
        </div>
      </div>
      <div className="classroom-layout">
      <div className="classroom-menu">
           <Link to="/mypage/myprofile"> <button className="menu-button"> 내 정보 </button> </Link>
          <Link to="/mypage/mypost"> <button className="menu-button"> 내 게시물 조회 </button> </Link>
          <Link to="/mypage/myclasses"> <button className="menu-button"> 내 강의 조회 </button> </Link>
          {user?.role === "student" && (
            <Link to="/mypage/myattendance"> <button className="menu-button"> 출결내역 확인 </button> </Link>
          )}
          {user?.role === "student" && (
          <Link to="/mypage/mygrades"> <button className="menu-button"> 성적 확인 </button> </Link>
          )}
          <Link to="/mypage/achievements"> <button className="menu-button"> 업적 </button> </Link>
      </div>
      <div className="classroom-content">
        <Outlet /> {/* 현재 선택된 서브페이지가 여기에 표시됨 */}
      </div>
      </div>
    </div>
  );
};

export default MyPage;