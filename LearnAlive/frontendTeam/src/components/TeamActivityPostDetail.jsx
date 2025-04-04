import { useState, useEffect } from "react";
import { 
  getTeamActivityPost, 
  deleteTeamActivityPost, 
  addTeamActivityComment, 
  getTeamActivityComments,
  attendTeamActivityPost,
  applyForTeamActivity,
  toggleTeamActivityLike
} from "../api/teamActivityApi";
import { useAuth } from "../context/AuthContext";
import ApprovedMembers from "./ApprovedMembers";

// 유저별로 storage key를 생성하는 헬퍼 함수
const getStorageKey = (baseKey, userId) => `${baseKey}_${userId}`;

const TeamActivityPostDetail = ({ post, onBack, refreshPosts }) => {
  const { user } = useAuth();
  const [postData, setPostData] = useState(post);
  const [liked, setLiked] = useState(false);
  const [applied, setApplied] = useState(false);
  const [attending, setAttending] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  // 상세 화면 진입 시 DB에서 최신 게시글 데이터 불러오기
  useEffect(() => {
    if (!post || !post.postId) return;
    const fetchPostData = async () => {
      try {
        const freshPost = await getTeamActivityPost(post.postId);
        setPostData(freshPost);
      } catch (error) {
        console.error("게시글 최신 데이터 불러오기 오류:", error);
      }
    };
    fetchPostData();
  }, [post]);

  // 컴포넌트 마운트 시 로컬 스토리지에서 좋아요 상태 복원
  useEffect(() => {
    if (!user) return;
    const likedPostsKey = getStorageKey("likedPosts", user.userId);
    const likedPosts = JSON.parse(localStorage.getItem(likedPostsKey) || "{}");
    setLiked(likedPosts[postData.postId] || false);
  }, [postData.postId, user]);

  // 참가 신청 상태 복원
  useEffect(() => {
    if (!user) return;
    const appliedPostsKey = getStorageKey("appliedPosts", user.userId);
    const appliedPosts = JSON.parse(localStorage.getItem(appliedPostsKey) || "{}");
    setApplied(appliedPosts[postData.postId] || false);
  }, [postData.postId, user]);

  // 댓글 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const commentsData = await getTeamActivityComments(postData.postId);
        setComments(commentsData);
      } catch (error) {
        console.error("댓글 불러오기 오류:", error);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [postData.postId]);

  // 팀 멤버 기반 참석 여부 확인
  useEffect(() => {
    if (user && postData.teamMembers) {
        console.log('✅ teamMembers:', postData.teamMembers);
        console.log('✅ 내 userId:', user.userId);
      setAttending(postData.teamMembers.includes(user.userId));
    }
  }, [user, postData.teamMembers]);

  const handleLike = async () => {
    try {
      const increment = liked ? -1 : 1;
      await toggleTeamActivityLike(postData.postId, increment);
      // 최신 데이터를 다시 불러와 업데이트
      const freshPost = await getTeamActivityPost(postData.postId);
      setPostData(freshPost);
      
      // 로컬 스토리지 좋아요 상태 업데이트
      const likedPostsKey = getStorageKey("likedPosts", user.userId);
      const likedPosts = JSON.parse(localStorage.getItem(likedPostsKey) || "{}");
      likedPosts[postData.postId] = !liked;
      localStorage.setItem(likedPostsKey, JSON.stringify(likedPosts));
      
      // 토글 후 메시지 출력
      if (!liked) {
        alert("좋아요를 눌렀습니다.");
      } else {
        alert("좋아요가 취소되었습니다.");
      }
      setLiked(!liked);
    } catch (error) {
      console.error("좋아요 처리 오류:", error);
    }
  };

  // 참가 신청 처리 (학생만 보임)
  const handleAttend = async () => {
    if (!user) return;
    const appliedPostsKey = getStorageKey("appliedPosts", user.userId);
    try {
      await applyForTeamActivity(postData.postId, user.userId);
      alert("참가 신청이 완료되었습니다. 승인 대기 중입니다.");
      const appliedPosts = JSON.parse(localStorage.getItem(appliedPostsKey) || "{}");
      appliedPosts[postData.postId] = true;
      localStorage.setItem(appliedPostsKey, JSON.stringify(appliedPosts));
      setApplied(true);
    } catch (error) {
      console.error("참가 신청 오류:", error);
    }
  };

  // 게시글 삭제 처리 (교수 전용)
  const handleDelete = async () => {
    if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      try {
        await deleteTeamActivityPost(postData.postId);
        refreshPosts();
        onBack();
      } catch (error) {
        console.error("게시글 삭제 오류:", error);
      }
    }
  };

  // 댓글 추가 처리
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const commentData = {
        commenterId: user?.userId || "",
        content: newComment,
      };
      await addTeamActivityComment(postData.postId, commentData);
      setNewComment("");
      const updatedComments = await getTeamActivityComments(postData.postId);
      setComments(updatedComments);
    } catch (error) {
      console.error("댓글 추가 오류:", error);
    }
  };

  // 멤버 보기 버튼 클릭 시 ApprovedMembers 컴포넌트로 전환
  if (showMembers) {
    return (
      <ApprovedMembers 
        postId={postData.postId} 
        onBack={() => setShowMembers(false)} 
        post={postData} 
      />
    );
  }

  return (
    <div>
      <button onClick={onBack} className="back-button" style={{ display: "block", marginLeft: "auto" }}>
        ⬅ 돌아가기
      </button>
      <h2>{postData.title}</h2>

      <hr></hr>
      <p><strong>작성자:</strong> {postData.authorName}</p>
      <p><strong>작성일:</strong> {new Date(postData.createdAt).toLocaleString()}</p>
      <p><strong>좋아요:</strong> {postData.likes}</p>
      <hr></hr>
      <div>
        <p>{postData.content}</p>
      </div>
      <div style={{ margin: "1rem 0" }}>
        <button onClick={handleLike} className="like-button">
          {liked ? "좋아요 취소" : "👍 좋아요"}
        </button>
        {/* 학생일 때, 작성자도 아니고, 아직 팀 멤버(승인)도 아니라면 신청 버튼을 표시 */}
        {user?.role === "student" && user.userId !== postData.authorId && !attending && !applied && (
          <button onClick={handleAttend} style={{ marginLeft: "5px" }} className="normal-button">
            참가 신청
          </button>
        )}
        {/* 만약 이미 신청했지만 아직 승인되지 않았다면 신청 완료 버튼(비활성화)을 표시 */}
        {user?.role === "student" && !attending && applied && (
          <button disabled style={{ gap: "5px" }} className="edit-button">
            신청 완료
          </button>
        )}
        <button onClick={() => setShowMembers(true)} className="normal-button">
          멤버 보기
        </button>
        <button onClick={() => onBack(postData)} className="delete-button">뒤로가기</button>
      </div>
      <div className="mt-4">
  <h4 className="mb-3">💬 댓글</h4>

  {loadingComments ? (
    <div className="text-muted">댓글을 불러오는 중...</div>
  ) : comments.length === 0 ? (
    <div className="text-muted">등록된 댓글이 없습니다.</div>
  ) : (
    <div className="d-flex flex-column gap-3 mb-4">
      {comments.map((comment) => (
        <div
          key={comment.commentId}
          className="px-3 py-2"
          style={{
            backgroundColor: "#FFE066",        // 💛 말풍선 색상
            borderRadius: "16px",
            alignSelf: user?.userId === comment.commenterId ? "end" : "start",
            maxWidth: "80%",
            width: "fit-content",              // ✅ 가변 너비 (내용만큼)
            wordBreak: "break-word",           // ✅ 긴 단어 줄바꿈
            padding: "12px 16px",              // ✅ 여유 있는 패딩
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)", // 살짝 그림자
            marginBottom: "20px"
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-1" style={{ gap: "10px", marginBottom: '3px'}}>
            <strong>{comment.commenterId}</strong>
            <small className="text-muted" style={{ fontSize: "0.8rem", marginLeft: "12px"}}>
              {new Date(comment.createdAt).toLocaleString()}
            </small>
          </div>
          <div>{comment.content}</div>
        </div>
      ))}
    </div>
  )}

  {/* 댓글 입력창 */}
  <form onSubmit={handleAddComment}>
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        placeholder="댓글을 입력하세요"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        required
      />
      <button className="btn btn-outline-primary" type="submit">
        추가
      </button>
    </div>
  </form>
</div>


    </div>
  );
};

export default TeamActivityPostDetail;