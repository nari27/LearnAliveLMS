package com.lms.attendance.repository;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.lms.attendance.model.Board;
import com.lms.attendance.model.Post;

@Mapper
public interface PostMapper {

	@Insert("""
			    INSERT INTO Post (post_id, board_id, author_id, author_role, author, title, content, file_path)
			    VALUES (#{postId}, #{boardId}, #{authorId}, #{authorRole}, #{author}, #{title}, #{content}, #{filePath})
			""")
	@Results({ @Result(property = "postId", column = "post_id"), @Result(property = "boardId", column = "board_id"),
			@Result(property = "title", column = "title"), @Result(property = "authorId", column = "author_id"),
			@Result(property = "authorRole", column = "author_role"), @Result(property = "author", column = "author"),
			@Result(property = "filepath", column = "file_path") })
	void createPost(Post newPost);

	@Delete("DELETE FROM Post WHERE post_id = #{postId}")
	void deletePostByPostId(int postId);

	@Update("UPDATE Post SET view = view + 1 WHERE post_id = #{postId}")
	void increaseViewCount(@Param("postId") int postId);

	// ---------------게시글 수정 기능
	@Update("""
			    UPDATE Post
			    SET title = #{title}, content = #{content}
			    WHERE post_id = #{postId}
			""")
	void updatePost(@Param("postId") int postId, @Param("title") String title, @Param("content") String content
//    	    @Param("author") String author
	);

	// 모든 게시글 가져오기
	@Select("SELECT post_id, title, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at, author_id, author_role, author, view, likes FROM Post WHERE board_id = #{boardId};")
	@Results({ @Result(property = "postId", column = "post_id"), @Result(property = "title", column = "title"),
			@Result(property = "createdAt", column = "created_at"),
			@Result(property = "authorRole", column = "author_role"),
			@Result(property = "authorId", column = "author_id"), @Result(property = "author", column = "author"),
//        @Result(property = "filePath", column = "file_path")
	})
	List<Post> getAllPosts(int boardId);

	// 특정 사용자의 게시글 가져오기
	@Select("""
			    SELECT post_id,
			           title,
			           DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
			           author_id,
			           author_role,
			           author,
			           view
			      FROM Post
			     WHERE author_id = #{userId}
			""")
	@Results({ @Result(column = "post_id", property = "postId"), @Result(column = "title", property = "title"),
			@Result(column = "created_at", property = "createdAt"),
			@Result(column = "author_id", property = "authorId"),
			@Result(column = "author_role", property = "authorRole"), @Result(column = "author", property = "author"),
			@Result(column = "view", property = "view") })
	List<Post> getUsersAllPosts(@Param("userId") String userId);

// id별 게시글 가져오기    
	@Select("SELECT post_id, title, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at, author_id, content, author_role, author, view, file_path, likes FROM Post WHERE post_id = #{postId};")
	@Results({ @Result(property = "postId", column = "post_id"), @Result(property = "title", column = "title"),
			@Result(property = "createdAt", column = "created_at"),
			@Result(property = "authorRole", column = "author_role"),
			@Result(property = "authorId", column = "author_id"), @Result(property = "author", column = "author"),
			@Result(property = "filePath", column = "file_path") })
	Post getPostById(int postId);

	// title로 게시글 검색
	@Select("SELECT * FROM Post WHERE title LIKE CONCAT('%', #{title}, '%')")
	List<Post> searchPostsByTitle(String title);

	// 게시글의 총 좋아요 수 가져오기
	@Select("SELECT likes FROM post WHERE post_id = #{postId}")
	int getTotalLikes(int postId);

	// 좋아요
	@Update("UPDATE Post SET likes = likes + 1 WHERE post_id = #{postId}")
	void incrementLikes(@Param("postId") int postId);

	// 게시글 좋아요 수 감소
	@Update("UPDATE Post SET likes = likes - 1 WHERE post_id = #{postId}")
	void decrementLikes(@Param("postId") int postId);

	
	// ✅ 클래스에 속한 게시판 목록 조회
    @Select("SELECT * FROM board WHERE class_id = #{classId}")
    @Results({
        @Result(property = "boardId", column = "board_id"),
        @Result(property = "boardName", column = "board_name"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at")
    })
    List<Board> findBoardsByClassId(@Param("classId") int classId);
    
    // ✅ 특정 게시판의 게시글 조회 (월별)
    @Select("SELECT * FROM post WHERE board_id = #{boardId} AND created_at LIKE #{month}")
    @Results({
        @Result(property = "postId", column = "post_id"),
        @Result(property = "boardId", column = "board_id"),
        @Result(property = "title", column = "title"),
        @Result(property = "content", column = "content"),
        @Result(property = "author", column = "author"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "likeCount", column = "like_count"),
        @Result(property = "view", column = "view")
    })
    List<Post> findPostsByBoardAndMonth(@Param("boardId") int boardId, @Param("month") String month);

	
}
