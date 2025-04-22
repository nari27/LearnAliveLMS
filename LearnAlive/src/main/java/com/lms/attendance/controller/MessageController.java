package com.lms.attendance.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.lms.attendance.model.AddressBook;
import com.lms.attendance.model.Message;
import com.lms.attendance.service.MessageService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    
    private final MessageService messageService;

    // 메시지 전송
    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody Message message) {
        messageService.sendMessage(message);
        return ResponseEntity.ok("쪽지를 보냈습니다.");
    }

    // 메시지 상세 조회
    @GetMapping("/{messageId}")
    public ResponseEntity<Message> getMessageById(@PathVariable int messageId) {
        Message message = messageService.getMessageById(messageId);
        if (message != null) {
            return ResponseEntity.ok(message);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // 메시지 목록 조회
    @GetMapping("/received/{receiverId}")
    public ResponseEntity<List<Message>> getReceivedMessages(@PathVariable String receiverId) {
        List<Message> messages = messageService.getReceivedMessages(receiverId);     
        return ResponseEntity.ok(messages);
    }

    // 보낸 메시지 목록 조회
    @GetMapping("/sent/{senderId}")
    public ResponseEntity<List<Message>> getSentMessages(@PathVariable String senderId) {
        List<Message> messages = messageService.getSentMessages(senderId);  
        return ResponseEntity.ok(messages);
    }

    // 메시지 읽기 (읽음 처리)
    @PutMapping("/read/{messageId}")
    public ResponseEntity<String> markAsRead(@PathVariable int messageId) {
        messageService.markAsRead(messageId);
        return ResponseEntity.ok("쪽지를 읽음 처리했습니다.");
    }

    // 메시지 삭제
    @DeleteMapping("/delete/{messageId}")
    public ResponseEntity<String> deleteMessage(@PathVariable int messageId) {
        messageService.deleteMessage(messageId);
        return ResponseEntity.ok("쪽지를 삭제했습니다.");
    }
    
    // 주소록 조회
    @GetMapping("/addressBook")
    public List<AddressBook> getAddressBook() {
        return messageService.getAddressBook();
    }
}