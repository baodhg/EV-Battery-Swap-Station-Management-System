package com.evswap.evswapstation.service;

import com.evswap.evswapstation.dto.ReportDTO;
import com.evswap.evswapstation.entity.Report;
import com.evswap.evswapstation.entity.User;
import com.evswap.evswapstation.repository.ReportRepository;
import com.evswap.evswapstation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    // Lấy toàn bộ báo cáo với tên user
    public List<ReportDTO> getAllReportsWithUserName() {
        List<Report> reports = reportRepository.findAll();
        return reports.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Lấy toàn bộ báo cáo (không có tên user - giữ lại cho tương thích)
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    // Lấy báo cáo theo ID với tên user
    public ReportDTO getReportByIdWithUserName(Long reportId) {
        Optional<Report> reportOptional = reportRepository.findById(reportId);
        return reportOptional.map(this::convertToDTO).orElse(null);
    }

    // Lấy báo cáo theo ID (không có tên user - giữ lại cho tương thích)
    public Report getReportById(Long reportId) {
        Optional<Report> report = reportRepository.findById(reportId);
        return report.orElse(null);
    }

    // Lấy reports theo userId với tên user
    public List<ReportDTO> getReportsByUserId(Integer userId) {
        List<Report> reports = reportRepository.findByUserId(userId);
        return reports.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Thêm báo cáo mới
    public Report addReport(Report report) {
        return reportRepository.save(report);
    }

    // Cập nhật trạng thái của báo cáo
    public Report updateReportStatus(Long reportId, String status) {
        Optional<Report> reportOptional = reportRepository.findById(reportId);
        if (reportOptional.isPresent()) {
            Report report = reportOptional.get();
            report.setStatus(status);
            return reportRepository.save(report);
        }
        return null;
    }

    // Xóa báo cáo
    public boolean deleteReport(Long reportId) {
        if (reportRepository.existsById(reportId)) {
            reportRepository.deleteById(reportId);
            return true;
        }
        return false;
    }

    // Convert Report entity sang ReportDTO với tên user
    private ReportDTO convertToDTO(Report report) {
        String userName = "Unknown";
        String fullName = "Unknown User";

        if (report.getUserId() != null) {
            Optional<User> userOptional = userRepository.findById(report.getUserId());
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                userName = user.getUserName() != null ? user.getUserName() : "Unknown";
                fullName = user.getFullName() != null ? user.getFullName() : "Unknown User";
            }
        }

        return ReportDTO.fromEntity(report, userName, fullName);
    }
}