package com.lms.attendance.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lms.attendance.model.Board;
import com.lms.attendance.model.Post;
import com.lms.attendance.repository.PostMapper;

@Service
public class PostService {
	private final PostMapper postMapper; 
	@Autowired  // Spring이 자동으로 PostMapper를 주입
    public PostService(PostMapper postMapper) {
        this.postMapper = postMapper;
    }
	
	@Transactional //트랜잭션 단위로 실행?
	public Post getPostById(int postId) {
        postMapper.increaseViewCount(postId); // 조회수 증가
        return postMapper.getPostById(postId); // 게시글 조회
	}
	 
        
	public Post createPost(int boardId, Post newPost) { //게시글 작성
		 newPost.setBoardId(boardId); // 게시글에 boardId 설정
        postMapper.createPost(newPost); 
        return newPost;
    }
	
	public void deletePostByPostId(int postid) { //게시글 삭제
		postMapper.deletePostByPostId(postid);
	}
	
	public Post updatePost(int postid, Post updatedPost) { //게시글 수정
        postMapper.updatePost(
            postid,
            updatedPost.getTitle(),
            updatedPost.getContent()
//            updatedPost.getAuthor()
        );
		return updatedPost;
	}
        //boardid에 맞는 게시글 가져오기
        public List<Post> getAllPosts(int boardId) {
            return postMapper.getAllPosts(boardId);
        }
       
       
        
        //게시글 제목으로 조회하기
        public List<Post> searchPostsByTitle(String title) {
            return postMapper.searchPostsByTitle(title);
        }
        
        //사용자의 모든 게시글
        public List<Post> getUsersAllPosts(String userId) {
            return postMapper.getUsersAllPosts(userId);
        }

     // 게시판 목록 조회 (classId 기준)
        public List<Board> getBoardsByClassId(int classId) {
            return postMapper.findBoardsByClassId(classId);
        }
        
        // 게시글 조회 (특정 게시판, 월별 조회)
        public List<Post> getPostsByBoardAndMonth(int boardId, String month) {
            // month 값에 "%"를 붙여 SQL의 LIKE 검색에 활용 (예: "2025-04%")
            return postMapper.findPostsByBoardAndMonth(boardId, month + "%");
        }
        
    }
	
	