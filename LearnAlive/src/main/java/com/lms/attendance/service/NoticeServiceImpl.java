package com.lms.attendance.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;

import com.lms.attendance.model.Notice;
import com.lms.attendance.repository.NoticeMapper;

@Service
public class NoticeServiceImpl implements NoticeService {

    private final NoticeMapper noticeMapper;

    public NoticeServiceImpl(NoticeMapper noticeMapper) {
        this.noticeMapper = noticeMapper;
    }

    @Override
    public List<Notice> getAllNotices() {
        return noticeMapper.getAllNotices();
    }

    @Override
    public void createNotice(Notice notice) {
        noticeMapper.createNotice(notice);
    }

    @Override
    public void updateNotice(Notice notice) {
        noticeMapper.updateNotice(notice);
    }

    @Override
    public void deleteNotice(@Param("notice_id") int notice_id) {
        noticeMapper.deleteNotice(notice_id);
    }

    @Override
    public Notice getNoticeById(@Param("notice_id") int notice_id) {  // 공지사항 조회 메소드 구현
        return noticeMapper.getNoticeById(notice_id);  // DB에서 해당 notice_id를 가진 공지사항을 조회
    }
}