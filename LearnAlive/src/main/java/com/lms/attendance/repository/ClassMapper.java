package com.lms.attendance.repository;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.lms.attendance.model.ClassDetail;
import com.lms.attendance.model.ClassSettings;
import com.lms.attendance.model.Classroom;

@Mapper
public interface ClassMapper {

	//사용자의 강의실 정보 가져오기
	@Select("(SELECT c.class_id AS classId, c.class_name AS className, c.prof_id AS profId, c.description AS description " +
	        "FROM class c JOIN student_class sc ON c.class_id = sc.class_id WHERE sc.student_id = #{userId}) " +
	        "UNION " +
	        "(SELECT c.class_id AS classId, c.class_name AS className, c.prof_id AS profId, c.description AS description " +
	        "FROM class c WHERE c.prof_id = #{userId})")
	List<Classroom> findClassesByUserId(String userId);

	//강의실 추가
	@Insert("""
		    INSERT INTO class (
		      class_name, prof_id, start_time, end_time, present_start, present_end, 
		      late_end, credit, capacity, course_type, required
		    ) VALUES (
		      #{className}, #{profId}, #{startTime}, #{endTime}, #{presentStart}, #{presentEnd},
		      #{lateEnd}, #{credit}, #{capacity}, #{courseType}, #{required}
		    )
		""")
		@Options(useGeneratedKeys = true, keyProperty = "classId")
		void insertClassroom(Classroom newClass);

	    // ✅ 요일 저장용 insert
	    @Insert("INSERT INTO class_day (class_id, day_of_week) VALUES (#{classId}, #{dayOfWeek})")
	    void insertClassDay(@Param("classId") Integer classId, @Param("dayOfWeek") String dayOfWeek);

	// ✅ 강의실 삭제 SQL
	@Delete("DELETE FROM Class WHERE class_id = #{classId}")
	void deleteClassById(int classId);

	// 모든 강의실 가져오기
	@Select("SELECT class_id, class_name, prof_id FROM Class")
	@Results({ @Result(column = "class_id", property = "classId"),
			@Result(column = "class_name", property = "className"), @Result(column = "prof_id", property = "profId") })
	List<Classroom> findAllClasses();

	// 특정 강의실의 출석 시간 정보
	@Select("""
			    SELECT start_time, end_time, present_start, present_end, late_end
			    FROM Class
			    WHERE class_id = #{classId}
			""")
	@Results(id = "ClassSettingsResultMap", value = { @Result(property = "startTime", column = "start_time"),
			@Result(property = "endTime", column = "end_time"),
			@Result(property = "presentStart", column = "present_start"),
			@Result(property = "presentEnd", column = "present_end"),
			@Result(property = "lateEnd", column = "late_end") })
	ClassSettings findClassSettingsById(@Param("classId") int classId);

	// ✅ 출석 시간 업데이트
	@Update("""
			    UPDATE Class
			    SET start_time = #{startTime},
			        end_time = #{endTime},
			        present_start = #{presentStart},
			        present_end = #{presentEnd},
			        late_end = #{lateEnd}
			    WHERE class_id = #{classId}
			""")
	void updateClassSettings(ClassSettings settings);

	// 클래스 정보를 가져오는 쿼리
	@Select("""
			    SELECT
			        c.class_id,
			        c.class_name,
			        c.prof_id,  -- ✅ VARCHAR 컬럼이므로 String으로 처리해야 함
			        p.name AS professor_name,
			        p.email AS professor_email
			    FROM Class c
			    JOIN Professor p ON c.prof_id = p.prof_id
			    WHERE c.class_id = #{classId}
			""")
	@Results({ @Result(column = "class_id", property = "classId"),
			@Result(column = "class_name", property = "className"), @Result(column = "prof_id", property = "profId"), // ✅
																														// String으로
																														// 변경
			@Result(column = "professor_name", property = "professorName"),
			@Result(column = "professor_email", property = "professorEmail") })
	ClassDetail findClassDetailById(int classId);

// 강의 설명 업데이트
	@Update("UPDATE Class SET description = #{description} WHERE class_id = #{classId}")
	void updateClassDescription(@Param("classId") int classId, @Param("description") String description);

	@Select("SELECT present_start, present_end, late_end FROM Class WHERE class_id = #{classId}")
	ClassSettings getClassSettings(@Param("classId") int classId);
	
	@Update("""
			   UPDATE Class
			   SET score = #{score},
			       grade = #{grade}
			   WHERE class_id = #{classId}
			""")
	void updateClassGrade(@Param("classId") int classId, @Param("score") Double score, @Param("grade") String grade);

	//전체 강의실 정보 조회 쿼리
	@Select("""
		    SELECT c.class_id AS classId,
		           c.class_name AS className,
		           c.prof_id AS profId,
		           p.name AS professorName,
		           c.credit,
		           c.capacity,
		           c.course_type AS courseType,
		           c.required
		    FROM class c
		    LEFT JOIN professor p ON c.prof_id = p.prof_id
		""")
		List<Classroom> findAllClassesForAdmin();
	
	//권장 학년 정보 추가 쿼리
	@Insert("INSERT INTO recommended_grade (class_id, grade) VALUES (#{classId}, #{grade})")
	void insertRecommendedGrade(@Param("classId") int classId, @Param("grade") int grade);

}
