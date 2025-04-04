package com.lms.attendance.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.lms.attendance.model.Notice;

public interface NoticeService {
    List<Notice> getAllNotices();
    void createNotice(Notice notice);
    void updateNotice(Notice notice);
    void deleteNotice(@Param("notice_id") int notice_id); // noticeId -> notice_id로 변경
    Notice getNoticeById(@Param("notice_id") int notice_id); // 단일 공지사항 조회 메소드 추가
}