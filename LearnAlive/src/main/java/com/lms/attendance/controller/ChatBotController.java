package com.lms.attendance.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.lms.attendance.model.ChatBot;
import com.lms.attendance.service.ChatBotService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatBotController {

    private final ChatBotService chatBotService;

    // 모든 챗봇 질문/답변 가져오기
    @GetMapping("/all")
    public ResponseEntity<List<ChatBot>> getAllChatBots() {
        List<ChatBot> chatBots = chatBotService.getAllChatBots();
        return ResponseEntity.ok(chatBots);
    }

    // 특정 키워드로 질문/답변 검색
    @GetMapping("/search")
    public ResponseEntity<List<ChatBot>> searchChatBot(@RequestParam String keyword) {    
        List<ChatBot> searchResults = chatBotService.searchChatBotByKeyword(keyword);
        return ResponseEntity.ok(searchResults);
    }
}