package com.lms.attendance.controller;

import com.lms.attendance.model.ExamScore;
import com.lms.attendance.service.ExamScoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exams/{classId}/exam-scores")
public class ExamScoreController {
    private final ExamScoreService examScoreService;
    
    public ExamScoreController(ExamScoreService examScoreService) {
        this.examScoreService = examScoreService;
    }
    
    // 학생별 시험 점수 및 등급 조회 (강의별)
    @GetMapping
    public ResponseEntity<List<ExamScore>> getExamScores(@PathVariable("classId") int classId) {
        List<ExamScore> scores = examScoreService.getExamScoresByClassId(classId);
        return ResponseEntity.ok(scores);
    }
    
    @PostMapping
    public ResponseEntity<?> addExamScore(@PathVariable int classId, @RequestBody ExamScore examScore) {
        // URL의 classId를 강제 적용
        examScore.setClassId(classId);
        examScoreService.addExamScore(examScore);
        return ResponseEntity.ok("성적 추가 성공");
    }
    
    // 특정 학생의 시험 점수 및 등급 업데이트
    @PutMapping("/{studentId}")
    public ResponseEntity<?> updateExamScore(
    	    @PathVariable("classId") int classId, 
    	    @PathVariable("studentId") String studentId, 
    	    @RequestBody Map<String, Object> payload) {
    	Object scoreObj = payload.get("score");
        Object gradeObj = payload.get("grade");
        if (scoreObj == null || gradeObj == null) {
            return ResponseEntity.badRequest().body("성적 정보(score, grade)가 누락되었습니다.");
        }
        Double score;
        try {
            score = Double.valueOf(scoreObj.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("유효한 score 값을 입력해주세요.");
        }
        String grade = gradeObj.toString();
        examScoreService.updateExamScore(classId, studentId, score, grade);
        return ResponseEntity.ok("성적 업데이트 성공");
    }
}