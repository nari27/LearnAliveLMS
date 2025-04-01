package com.lms.attendance.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TeamPostMilestoneStatus {
    private int statusId;
    private int postId;
    private int milestoneId;
    private String status;
    private LocalDateTime updatedAt;
}