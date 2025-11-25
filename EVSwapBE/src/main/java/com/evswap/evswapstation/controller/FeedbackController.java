package com.evswap.evswapstation.controller;

import com.evswap.evswapstation.dto.FeedbackDTO;
import com.evswap.evswapstation.entity.Feedback;
import com.evswap.evswapstation.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    // Create or Update Feedback
    @PostMapping
    public ResponseEntity<?> createOrUpdateFeedback(@RequestBody FeedbackDTO feedbackDTO) {
        try {
            Feedback feedback = feedbackService.saveFeedback(feedbackDTO);
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

    // Get Feedback by ID
    @GetMapping("/{feedbackId}")
    public ResponseEntity<?> getFeedbackById(@PathVariable Integer feedbackId) {
        try {
            Feedback feedback = feedbackService.getFeedbackById(feedbackId);
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Feedback not found");
        }
    }

    // Get Feedbacks by User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getFeedbacksByUserId(@PathVariable Integer userId) {
        try {
            List<Feedback> feedbacks = feedbackService.getFeedbacksByUserId(userId);
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    // Get Feedbacks by Station ID
    @GetMapping("/station/{stationId}")
    public ResponseEntity<?> getFeedbacksByStationId(@PathVariable Integer stationId) {
        try {
            List<Feedback> feedbacks = feedbackService.getFeedbacksByStationId(stationId);
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    // Delete Feedback
    @DeleteMapping("/{feedbackId}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Integer feedbackId) {
        try {
            feedbackService.deleteFeedback(feedbackId);
            return ResponseEntity.ok("Feedback deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Feedback not found");
        }
    }
}
