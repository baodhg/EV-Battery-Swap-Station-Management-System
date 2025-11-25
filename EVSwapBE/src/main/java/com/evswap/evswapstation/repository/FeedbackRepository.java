package com.evswap.evswapstation.repository;

import com.evswap.evswapstation.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {

    // Find all feedbacks by user ID
    List<Feedback> findByUserId(Integer userId);

    // Find all feedbacks by station ID
    List<Feedback> findByStationId(Integer stationId);

    // Find feedback by booking ID (unique per booking)
    Optional<Feedback> findByBookingId(Integer bookingId);

    // Find feedback by user and booking (to check if already exists)
    Optional<Feedback> findByUserIdAndBookingId(Integer userId, Integer bookingId);
}
