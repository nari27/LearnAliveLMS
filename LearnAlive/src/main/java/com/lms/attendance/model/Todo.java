package com.lms.attendance.model;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class Todo {
    private int todoId;         // 투두 ID
    private String userId;         // 사용자 ID
    private String text;        // 투두 내용
    private boolean completed;  // 완료 여부
    private Timestamp createdAt; // 생성 시간
    private LocalDateTime updatedAt; // 마지막 업데이트 시간
}