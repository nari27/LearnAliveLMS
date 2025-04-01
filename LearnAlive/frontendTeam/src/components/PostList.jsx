import { useState, useEffect } from "react";
import { getAllPosts, deletePost, getPostById } from "../api/postApi"; // 게시글 조회 API
import { fetchBoardsByClassId } from "../api/boardsApi";
import { useParams,useLocation  } from "react-router-dom";
import AddPostPage from "./AddPostPage";
import PostDetail from "./PostDetail";
import { useAuth } from "../context/AuthContext";
import FilteredPostList from "./FilteredPostList";


function PostList({ boardId }) {
  const { classId } = useParams();
  const [posts, setPosts] = useState([]); // 게시글 목록 상태
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시글 상태
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [showCreatePost, setShowCreatePost] = useState(false); // 게시글 작성 폼을 보일지 말지에 대한 상태
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
  const [refresh, setRefresh] = useState(false); // ✅ 새로고침 트리거 추가
  // const [selectedPost, setSelectedPost] = useState(null);
 //------------------------------------------- --------------------------------
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const postsPerPage = 10; // 한 페이지당 게시글 개수
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.max(1, Math.ceil(posts.length / postsPerPage)); // 전체 페이지 개수
  //---------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [showFiltered, setShowFiltered] = useState(false);

  const location = useLocation();
  //--------------------------------------------------------
   // 정렬 기준과 방향 상태 추가
   const [sortCriteria, setSortCriteria] = useState("createdAt"); // 기본 정렬 기준: 작성일
   const [sortOrder, setSortOrder] = useState("desc"); // 기본 정렬 방향: 내림차순


  // 검색어 변경 시 호출
  const handleSearchChange = (e) => {
  setSearchQuery(e.target.value);
  };

  // 검색 버튼 클릭 시 호출
  const handleSearchClick = () => {
    // 검색어가 있을 경우 필터링
    if (searchQuery) {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) 
      );
      setFilteredPosts(filtered);
      setShowFiltered(true);
    } else {
      // 검색어가 없으면 모든 게시글을 표시
      setFilteredPosts(posts);
      setShowFiltered(false);
    }
  };
  
  const fetchData = async () => {
    if (!boardId) return; // boardId가 없으면 실행하지 않음

    try {
      // 게시판 목록 불러오기
      setLoading(true);
      setPosts([]);  // 새 게시판을 불러오기 전에 이전 게시판의 내용을 초기화
      setShowFiltered(false);
      const postsData = await getAllPosts(boardId);
      const sortedPosts = postsData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setPosts(sortedPosts);
      setFilteredPosts([sortedPosts]);  // 필터링된 게시글 목록 초기화

      // 게시판 정보 불러오기
      const fetchedBoard = await fetchBoardsByClassId(classId);
      setBoard(fetchedBoard.isDefault);  // 기본 게시판 여부 설정

      const selectedBoard = fetchedBoard.find(board => board.boardId === boardId);
      if (selectedBoard) {
        setBoard(selectedBoard); // 찾은 보드를 상태에 저장
        console.log(selectedBoard.isDefault); // isDefault 값 확인
      } else {
        console.log("해당 boardId에 대한 게시판을 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("게시글이나 게시판 정보를 불러오는 데 실패했습니다:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
  
    fetchData();
    setSearchQuery("");  // 검색어 초기화
    setFilteredPosts([]);  // 필터링된 게시글 목록 초기화
  }, [boardId, refresh, location]);
  
  
  if (loading) {
    return <div>로딩 중...</div>;
  }

   // 정렬 함수
   const handleSort = (criteria) => {
    setSortCriteria(criteria);

    // 클릭할 때마다 정렬 방향 토글
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

    // 정렬된 게시글 목록
    const sortedPosts = [...posts].sort((a, b) => {
      let comparison = 0;
  
      if (sortCriteria === "likes" || sortCriteria === "view") {
        comparison = a[sortCriteria] - b[sortCriteria]; // 숫자 비교
      } else if (sortCriteria === "createdAt") {
        comparison = new Date(a[sortCriteria]) - new Date(b[sortCriteria]); // 날짜 비교
      }
  
      // 오름차순일 경우 그대로, 내림차순일 경우 반대로
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleTitleClick = async (post) => {
    try {
      // postId를 사용하여 해당 게시글을 가져옴
      const selectedPostData = await getPostById(post.postId);
      console.log("가져온 게시글:", selectedPostData); // 가져온 게시글 출력
      setSelectedPost(selectedPostData);

   // 클릭한 게시글의 모든 데이터를 업데이트하고, 좋아요 상태는 덮어쓰지 않음
   setPosts((prevPosts) =>
    prevPosts.map((p) =>
      p.postId === post.postId
        ? { ...p, ...selectedPostData } // 게시글 정보만 업데이트
        : p
    )
  );
  } catch (error) {
    console.error("게시글을 가져오는 데 실패했습니다:", error);
    alert("게시글을 불러오는 데 실패했습니다.");
  }
};
  
  //게시글 수정시 업데이트
  const handleUpdatePost = (postId, updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.postId === postId
          ? { ...post, title: updatedPost.title, content: updatedPost.content }
          : post
      )
    );
  };

   // 📌 새 게시글 추가 시 리스트 업데이트
   const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [...prevPosts, newPost]); // 새 게시글 추가
    setRefresh((prev) => !prev); // ✅ refresh 값을 반대로 변경 (트리거 역할)
    setShowCreatePost(false); // 게시글 작성 후 목록으로 돌아가기
  
    // 게시글 작성 후 선택된 게시글 초기화
    setSelectedPost(null); // 새 게시글 작성 후에 이전에 선택된 게시글이 있으면 해제
  };
  

  // 게시글 삭제하기
  const handleDelete = async (postId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
  
    try {
      await deletePost(postId);
      setPosts(posts.filter((post) => post.postId !== postId)); // 삭제된 게시글을 상태에서 제거
      alert("게시글이 삭제되었습니다.");
    } catch (error) {
      console.error("게시글 삭제 중 오류 발생:", error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

   // 좋아요 상태 업데이트를 위한 함수
   const handleLikeToggle = (postId, updatedLikes) => {
    // 해당 게시물을 찾아서 좋아요 수를 업데이트
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.postId === postId ? { ...post, likes: updatedLikes } : post
      )
    );
  };

  // 페이징 핸들러
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="post-container">
      {showCreatePost ? (
        <AddPostPage
        boardId={boardId}
        onCancle={() => setShowCreatePost(false)}
        onPostCreated={handlePostCreated}
      />
      ) : (
          <>
          <h2 className="title-bar">
            📌 {board?.boardName || "알 수 없음"} 게시판
          </h2>

          {/* 게시글 추가 버튼 + 검색창 (📌 목록일 때만 보여야 함) */}
          {!showCreatePost && !selectedPost && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {/* 왼쪽: 게시글 추가 버튼 */}
              <div>
                {(board?.isDefault === 1 || (board?.isDefault === 0 && user?.role === "professor")) && (
                  <button className="normal-button" onClick={() => setShowCreatePost(true)}>
                    게시글 추가
                  </button>
                )}
              </div>

              {/* 오른쪽: 검색창 */}
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="검색어 입력"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <button onClick={handleSearchClick}>검색</button>
              </div>
            </div>
          )}

          {selectedPost ? (
            <PostDetail
              post={selectedPost}
              onBack={() => setSelectedPost(null)}
              onLikeToggle={handleLikeToggle}
              onUpdate={handleUpdatePost}
              fetchData={fetchData}
            />
          ) : (
            <>
              {showFiltered ? (
                <FilteredPostList
                  filteredPosts={filteredPosts}
                  handleDelete={handleDelete}
                  onPostClick={handleTitleClick}
                  paginate={paginate}
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              ) : (
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th style={{ cursor: "pointer" }} onClick={() => handleSort("view")}>
                          조회수 {sortCriteria === "view" && (sortOrder === "asc" ? "🔼" : "🔽")}
                        </th>
                        <th style={{ cursor: "pointer" }} onClick={() => handleSort("likes")}>
                          좋아요 {sortCriteria === "likes" && (sortOrder === "asc" ? "🔼" : "🔽")}
                        </th>
                        <th style={{ cursor: "pointer" }} onClick={() => handleSort("createdAt")}>
                          작성일 {sortCriteria === "createdAt" && (sortOrder === "asc" ? "🔼" : "🔽")}
                        </th>
                        {(user?.role === "professor" || sortedPosts.some(post => post.authorId === user?.userId)) && <th>관리</th>}


                      </tr>
                    </thead>
                    <tbody>
                      {sortedPosts.length > 0 ? (
                        sortedPosts.map((post) => (
                          <tr key={post.postId}>
                            <td>{post.postId}</td>
                            <td className="post-title" onClick={() => handleTitleClick(post)} >
                              {post.title}
                            </td>
                            <td>{post.author}</td>
                            <td>{post.view}</td>
                            <td>{post.likes}</td>
                            <td>{post.createdAt}</td>
                            {(user?.role === "professor" || user?.userId === post.authorId) && (
                            <td>
                              <button onClick={() => handleDelete(post.postId)} className="delete-button">삭제</button>
                            </td>
                          )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6">게시글이 없습니다.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* 페이지 버튼 */}
                  <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', gap: '10px' }}>
                  {/* ◀ 이전 버튼 */}
                  {currentPage > 1 && (
                    <button onClick={() => setCurrentPage(currentPage - 1)}>
                      ◀ 이전
                    </button>
                  )}

                  {/* 현재 페이지 정보 */}
                  <span style={{ margin: '0 1rem', fontWeight: 'bold' }}>
                    [ {currentPage} / {totalPages} ]
                  </span>

                  {/* 다음 ▶ 버튼 */}
                  {currentPage < totalPages && (
                    <button onClick={() => setCurrentPage(currentPage + 1)}>
                      다음 ▶
                    </button>
                  )}
                </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default PostList;