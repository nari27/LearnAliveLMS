package com.lms.attendance.repository;

import com.lms.attendance.model.TeamClassMilestone;
import org.apache.ibatis.annotations.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Mapper
public interface TeamClassMilestoneMapper {

    @Insert("INSERT INTO class_milestone (class_id, title, due_date) VALUES (#{classId}, #{title}, #{dueDate})")
    @Options(useGeneratedKeys = true, keyProperty = "milestoneId")
    void insertClassMilestone(TeamClassMilestone milestone);

    
    @Update("UPDATE class_milestone SET title = #{title}, due_date = #{dueDate}, updated_at = CURRENT_TIMESTAMP WHERE milestone_id = #{milestoneId}")
    void updateMilestone(@Param("milestoneId") int milestoneId, @Param("title") String title, @Param("dueDate") LocalDateTime dueDate);

    
    
    // 강의실 단위 공통 마일스톤 전체 조회 (교수용)
    @Select("SELECT milestone_id as milestoneId, class_id as classId, title, due_date as dueDate, created_at as createdAt, updated_at as updatedAt FROM class_milestone WHERE class_id = #{classId} ORDER BY milestone_id")
    List<TeamClassMilestone> selectMilestonesByClassId(int classId);

    // 특정 게시글에 대해, 공통 마일스톤과 진행 상태(없으면 pending)를 조인하여 조회
    @Select("""
        SELECT cm.milestone_id as milestoneId,
               cm.title,
               cm.due_date as dueDate,
               IFNULL(pms.status, 'pending') as status
        FROM class_milestone cm
        LEFT JOIN post_milestone_status pms
            ON cm.milestone_id = pms.milestone_id
           AND pms.post_id = #{postId}
        WHERE cm.class_id = #{classId}
        ORDER BY cm.milestone_id
        """)
    List<Map<String, Object>> selectMilestonesForPost(@Param("classId") int classId, @Param("postId") int postId);



@Delete("DELETE FROM class_milestone WHERE milestone_id = #{milestoneId}")
void deleteMilestone(int milestoneId);
}