package com.evswap.evswapstation.controller;

import com.evswap.evswapstation.dto.AdminDashboardStatsDTO;
import com.evswap.evswapstation.dto.WeeklySwapDTO;
import com.evswap.evswapstation.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    /**
     * GET /api/admin/dashboard/stats
     * Lấy thống kê tổng quan cho admin dashboard
     * Response: {
     *   "activeStations": 24,
     *   "stationsGrowth": 2,
     *   "totalBatteries": 1248,
     *   "avgBatterySOH": 87.0,
     *   "activeUsers": 3542,
     *   "usersGrowth": 12.0,
     *   "todaySwaps": 186,
     *   "swapsGrowth": 8.0
     * }
     */
    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStatsDTO> getDashboardStats() {
        try {
            AdminDashboardStatsDTO stats = adminDashboardService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/admin/dashboard/weekly-swaps
     * Lấy số lượng swap theo từng ngày trong tuần
     * Response: [
     *   { "day": "Mon", "swaps": 45 },
     *   { "day": "Tue", "swaps": 52 },
     *   ...
     * ]
     */
    @GetMapping("/weekly-swaps")
    public ResponseEntity<List<WeeklySwapDTO>> getWeeklySwaps() {
        try {
            List<WeeklySwapDTO> swaps = adminDashboardService.getWeeklySwaps();
            return ResponseEntity.ok(swaps);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/admin/dashboard/summary
     * Lấy toàn bộ dữ liệu dashboard trong 1 request
     */
    @GetMapping("/summary")
    public ResponseEntity<?> getDashboardSummary() {
        try {
            var summary = new DashboardSummary(
                    adminDashboardService.getDashboardStats(),
                    adminDashboardService.getWeeklySwaps()
            );
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Inner class for summary response
    record DashboardSummary(
            AdminDashboardStatsDTO stats,
            List<WeeklySwapDTO> weeklySwaps
    ) {}
}