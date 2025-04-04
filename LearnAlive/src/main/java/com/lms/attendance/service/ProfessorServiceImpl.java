package com.lms.attendance.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lms.attendance.model.Professor;
import com.lms.attendance.repository.ProfessorMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfessorServiceImpl implements ProfessorService {

    private final ProfessorMapper professorMapper;
    private final BCryptPasswordEncoder passwordEncoder; // 자동 주입

    @Override
    public List<Professor> getAllProfessors() {
        return professorMapper.getAllProfessors();
    }

    @Override
    public Professor getProfessorById(String prof_id) {
        return professorMapper.getProfessorById(prof_id);
    }

    @Override
    public void saveProfessor(Professor professor) {
        // 비밀번호 암호화
        if (professor.getPassword() != null && !professor.getPassword().isEmpty()) {
            professor.setPassword(passwordEncoder.encode(professor.getPassword()));
        }
        
        professorMapper.insertProfessor(professor);
    }

    @Override
    public void updateProfessor(Professor professor) {
        if (professor.getPassword() != null && !professor.getPassword().isEmpty()) {
            // BCrypt 해시들은 보통 "$2a$" 또는 "$2b$"로 시작하므로,
            // 비밀번호가 이미 암호화되어 있지 않으면 암호화 진행
            if (!professor.getPassword().startsWith("$2a$") && !professor.getPassword().startsWith("$2b$")) {
                professor.setPassword(passwordEncoder.encode(professor.getPassword()));
            }
        }
        professorMapper.updateProfessor(professor);
    }


    @Override
    public void deleteProfessor(String prof_id) {
        professorMapper.deleteProfessor(prof_id);
    }

    @Override
    public Professor findByNameAndEmail(String name, String email) {
        return professorMapper.findByNameAndEmail(name, email);
    }

    @Override
    public Professor findByIdAndNameAndPhone(String userId, String name, String phone) {
        return professorMapper.findByIdAndNameAndPhone(userId, name, phone);
    }
}