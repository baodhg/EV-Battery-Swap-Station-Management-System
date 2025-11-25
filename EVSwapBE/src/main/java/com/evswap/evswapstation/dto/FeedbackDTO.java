package com.evswap.evswapstation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackDTO {
    private Integer feedbackId;
    private Integer userId;
    private Integer stationId;
    private Integer bookingId;
    private Integer rating;
    private String comment;
}