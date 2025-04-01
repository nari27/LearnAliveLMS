package com.lms.attendance.service;

import com.lms.attendance.model.TeamClassMilestone;
import com.lms.attendance.repository.TeamClassMilestoneMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class TeamClassMilestoneService {

    private final TeamClassMilestoneMapper mapper;

    public TeamClassMilestoneService(TeamClassMilestoneMapper mapper) {
        this.mapper = mapper;
    }

    @Transactional
    public void createMilestones(int classId, List<Map<String, Object>> milestonesData) {
        for (Map<String, Object> data : milestonesData) {
            TeamClassMilestone milestone = new TeamClassMilestone();
            milestone.setClassId(classId);
            milestone.setTitle((String) data.get("title"));
            String dueDateStr = (String) data.get("dueDate");
            // dueDate 문자열을 LocalDateTime으로 변환 (ISO 형식으로 가정)
            milestone.setDueDate(LocalDateTime.parse(dueDateStr));
            mapper.insertClassMilestone(milestone);
        }
    }

    
    @Transactional
    public void updateMilestone(int milestoneId, String title, LocalDateTime dueDate) {
        // 서비스에서 매퍼의 업데이트 메서드를 호출
        mapper.updateMilestone(milestoneId, title, dueDate);
    }

    
    public List<TeamClassMilestone> getClassMilestones(int classId) {
        return mapper.selectMilestonesByClassId(classId);
    }

    public List<Map<String, Object>> getMilestonesForPost(int classId, int postId) {
        return mapper.selectMilestonesForPost(classId, postId);
    }
    
    
    @Transactional
    public void deleteMilestone(int milestoneId) {
        mapper.deleteMilestone(milestoneId);
    }

    
}