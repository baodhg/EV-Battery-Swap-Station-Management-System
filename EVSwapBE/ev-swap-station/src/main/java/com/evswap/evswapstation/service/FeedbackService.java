package com.evswap.evswapstation.service;

import com.evswap.evswapstation.dto.FeedbackDTO;
import com.evswap.evswapstation.entity.Feedback;
import com.evswap.evswapstation.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    // Create or Update Feedback
    public Feedback saveFeedback(FeedbackDTO feedbackDTO) {
        // Validate rating (1-5)
        if (feedbackDTO.getRating() < 1 || feedbackDTO.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        // Validate bookingId is provided
        if (feedbackDTO.getBookingId() == null) {
            throw new IllegalArgumentException("Booking ID is required");
        }

        Feedback feedback;

        // If feedbackId is provided, update existing feedback
        if (feedbackDTO.getFeedbackId() != null) {
            feedback = feedbackRepository.findById(feedbackDTO.getFeedbackId())
                    .orElseThrow(() -> new RuntimeException("Feedback not found"));
            feedback.setRating(feedbackDTO.getRating());
            feedback.setComment(feedbackDTO.getComment());
        } else {
            // Check if user already gave feedback for this booking
            Optional<Feedback> existingFeedback = feedbackRepository.findByUserIdAndBookingId(
                    feedbackDTO.getUserId(),
                    feedbackDTO.getBookingId()
            );

            if (existingFeedback.isPresent()) {
                // Update existing feedback
                feedback = existingFeedback.get();
                feedback.setRating(feedbackDTO.getRating());
                feedback.setComment(feedbackDTO.getComment());
            } else {
                // Create new feedback
                feedback = new Feedback();
                feedback.setUserId(feedbackDTO.getUserId());
                feedback.setStationId(feedbackDTO.getStationId());
                feedback.setBookingId(feedbackDTO.getBookingId());
                feedback.setRating(feedbackDTO.getRating());
                feedback.setComment(feedbackDTO.getComment());
            }
        }

        return feedbackRepository.save(feedback);
    }

    // Get Feedback by ID
    public Feedback getFeedbackById(Integer feedbackId) {
        return feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
    }

    // Get Feedbacks by User ID
    public List<Feedback> getFeedbacksByUserId(Integer userId) {
        return feedbackRepository.findByUserId(userId);
    }

    // Get Feedbacks by Station ID
    public List<Feedback> getFeedbacksByStationId(Integer stationId) {
        return feedbackRepository.findByStationId(stationId);
    }

    // Get Feedback by Booking ID
    public Optional<Feedback> getFeedbackByBookingId(Integer bookingId) {
        return feedbackRepository.findByBookingId(bookingId);
    }

    // Delete Feedback
    public void deleteFeedback(Integer feedbackId) {
        if (!feedbackRepository.existsById(feedbackId)) {
            throw new RuntimeException("Feedback not found");
        }
        feedbackRepository.deleteById(feedbackId);
    }
}