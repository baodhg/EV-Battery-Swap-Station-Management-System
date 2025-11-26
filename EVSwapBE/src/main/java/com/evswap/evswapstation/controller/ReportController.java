package com.evswap.evswapstation.controller;

import com.evswap.evswapstation.dto.ReportDTO;
import com.evswap.evswapstation.entity.Report;
import com.evswap.evswapstation.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    // API để lấy toàn bộ báo cáo với tên user
    @GetMapping("/with-username")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<List<ReportDTO>> getAllReportsWithUserName() {
        List<ReportDTO> reports = reportService.getAllReportsWithUserName();
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

    // API để lấy toàn bộ báo cáo (không có tên user)
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<List<Report>> getAllReports() {
        List<Report> reports = reportService.getAllReports();
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

    // API để lấy báo cáo theo ID với tên user
    @GetMapping("/{reportId}/with-username")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ReportDTO> getReportByIdWithUserName(@PathVariable Long reportId) {
        ReportDTO report = reportService.getReportByIdWithUserName(reportId);
        if (report != null) {
            return new ResponseEntity<>(report, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // API để lấy báo cáo theo ID (không có tên user)
    @GetMapping("/{reportId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<Report> getReportById(@PathVariable Long reportId) {
        Report report = reportService.getReportById(reportId);
        if (report != null) {
            return new ResponseEntity<>(report, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // API để lấy báo cáo theo userId với tên user
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','DRIVER')")
    public ResponseEntity<List<ReportDTO>> getReportsByUserId(@PathVariable Integer userId) {
        List<ReportDTO> reports = reportService.getReportsByUserId(userId);
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

    // API để thêm báo cáo mới
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','DRIVER')")
    public ResponseEntity<Report> addReport(@RequestBody Report report) {
        Report newReport = reportService.addReport(report);
        return new ResponseEntity<>(newReport, HttpStatus.CREATED);
    }

    // API để cập nhật trạng thái báo cáo
    @PutMapping("/{reportId}/status")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<Report> updateReportStatus(
            @PathVariable Long reportId,
            @RequestBody StatusUpdateRequest request) {
        Report updatedReport = reportService.updateReportStatus(reportId, request.getStatus());
        if (updatedReport != null) {
            return new ResponseEntity<>(updatedReport, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // API để xóa báo cáo
    @DeleteMapping("/{reportId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<Void> deleteReport(@PathVariable Long reportId) {
        boolean deleted = reportService.deleteReport(reportId);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // DTO class cho status update request
    public static class StatusUpdateRequest {
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}