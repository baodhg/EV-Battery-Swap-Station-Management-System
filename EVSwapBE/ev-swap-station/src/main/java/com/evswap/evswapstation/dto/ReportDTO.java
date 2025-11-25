package com.evswap.evswapstation.dto;

import com.evswap.evswapstation.entity.Report;
import java.util.Date;

public class ReportDTO {
    private Long reportId;
    private Integer userId;  // Đổi từ Long sang Integer để khớp với User entity
    private String userName;  // Username của user
    private String fullName;  // Tên đầy đủ của user
    private Integer transactionId;
    private String reportContent;
    private Date reportDate;
    private String status;
    private String description;

    // Constructor
    public ReportDTO() {}

    public ReportDTO(Long reportId, Integer userId, String userName, String fullName, Integer transactionId,
                     String reportContent, Date reportDate, String status, String description) {
        this.reportId = reportId;
        this.userId = userId;
        this.userName = userName;
        this.fullName = fullName;
        this.transactionId = transactionId;
        this.reportContent = reportContent;
        this.reportDate = reportDate;
        this.status = status;
        this.description = description;
    }

    // Constructor từ Report entity
    public static ReportDTO fromEntity(Report report, String userName, String fullName) {
        ReportDTO dto = new ReportDTO();
        dto.setReportId(report.getReportId());
        dto.setUserId(report.getUserId());
        dto.setUserName(userName);
        dto.setFullName(fullName);
        dto.setTransactionId(report.getTransactionId());
        dto.setReportContent(report.getReportContent());
        dto.setReportDate(report.getReportDate());
        dto.setStatus(report.getStatus());
        dto.setDescription(report.getDescription());
        return dto;
    }

    // Getters and Setters
    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Integer getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Integer transactionId) {
        this.transactionId = transactionId;
    }

    public String getReportContent() {
        return reportContent;
    }

    public void setReportContent(String reportContent) {
        this.reportContent = reportContent;
    }

    public Date getReportDate() {
        return reportDate;
    }

    public void setReportDate(Date reportDate) {
        this.reportDate = reportDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}