package com.evswap.evswapstation.controller;

import com.evswap.evswapstation.dto.*;
import com.evswap.evswapstation.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * GET /api/transactions
     * Lấy tất cả giao dịch với thông tin: Transaction ID, Date & Time, Customer, VIN, Amount, Payment
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<List<TransactionDTO>> getAllTransactions() {
        List<TransactionDTO> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    /**
     * GET /api/transactions/{id}
     * Lấy chi tiết một giao dịch theo ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<TransactionDTO> getTransactionById(@PathVariable Long id) {
        TransactionDTO transaction = transactionService.getTransactionById(id);
        if (transaction != null) {
            return ResponseEntity.ok(transaction);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * GET /api/transactions/status/{status}
     * Lấy giao dịch theo trạng thái (PENDING, COMPLETED, FAILED, CANCELLED)
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByStatus(@PathVariable String status) {
        List<TransactionDTO> transactions = transactionService.getTransactionsByStatus(status);
        return ResponseEntity.ok(transactions);
    }

    /**
     * GET /api/transactions/user/{userId}
     * Lấy tất cả giao dịch của một khách hàng
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','DRIVER')")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByUserId(@PathVariable Long userId) {
        List<TransactionDTO> transactions = transactionService.getTransactionsByUserId(userId);
        return ResponseEntity.ok(transactions);
    }

    /**
     * POST /api/transactions
     * Tạo giao dịch mới
     * Body example:
     * {
     *   "userId": 1,
     *   "amount": 150.50,
     *   "stationId": 5,
     *   "packageId": 3,
     *   "status": "PENDING",
     *   "record": "Battery swap transaction"
     * }
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<?> createTransaction(@RequestBody TransactionDTO transactionDTO) {
        try {
            TransactionDTO createdTransaction = transactionService.createTransaction(transactionDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTransaction);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating transaction: " + e.getMessage());
        }
    }

    /**
     * PUT /api/transactions/{id}
     * Cập nhật giao dịch theo ID
     * Body example:
     * {
     *   "status": "COMPLETED",
     *   "payPalTransactionId": "PAYID-123456",
     *   "amount": 175.00
     * }
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<?> updateTransaction(
            @PathVariable Long id,
            @RequestBody TransactionDTO transactionDTO) {
        try {
            TransactionDTO updatedTransaction = transactionService.updateTransaction(id, transactionDTO);
            if (updatedTransaction != null) {
                return ResponseEntity.ok(updatedTransaction);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Transaction not found with ID: " + id);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error updating transaction: " + e.getMessage());
        }
    }

    /**
     * DELETE /api/transactions/{id}
     * Xóa giao dịch theo ID
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        try {
            boolean deleted = transactionService.deleteTransaction(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Transaction not found with ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting transaction: " + e.getMessage());
        }
    }

    /**
     * PATCH /api/transactions/{id}/status
     * Cập nhật chỉ status của giao dịch
     * Body example: { "status": "COMPLETED" }
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<?> updateTransactionStatus(
            @PathVariable Long id,
            @RequestBody TransactionDTO statusUpdate) {
        try {
            if (statusUpdate.getStatus() == null) {
                return ResponseEntity.badRequest().body("Status is required");
            }

            TransactionDTO transaction = new TransactionDTO();
            transaction.setStatus(statusUpdate.getStatus());

            TransactionDTO updated = transactionService.updateTransaction(id, transaction);
            if (updated != null) {
                return ResponseEntity.ok(updated);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Transaction not found with ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error updating status: " + e.getMessage());
        }
    }

    @GetMapping("/battery-info")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<List<TransactionBatteryDTO>> getTransactionBatteryInfo() {
        try {
            List<TransactionBatteryDTO> result = transactionService.getAllTransactionBatteryInfo();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ============= NEW DASHBOARD ENDPOINTS =============

    /**
     * GET /api/transactions/dashboard/stats
     * Lấy thống kê tổng quan cho dashboard
     * Response: {
     *   "totalTransactions": 341,
     *   "transactionGrowth": 12.0,
     *   "totalRevenue": 221650000,
     *   "revenueGrowth": 8.0,
     *   "totalBatteries": 90,
     *   "damagedBatteries": 5
     * }
     */
    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        try {
            DashboardStatsDTO stats = transactionService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    /**
     * GET /api/transactions/dashboard/by-day
     * Lấy số lượng giao dịch theo từng ngày trong tuần
     * Response: [
     *   { "day": "Mon", "count": 45 },
     *   { "day": "Tue", "count": 52 },
     *   ...
     * ]
     */
    @GetMapping("/dashboard/by-day")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<List<TransactionByDayDTO>> getTransactionsByDay() {
        try {
            List<TransactionByDayDTO> data = transactionService.getTransactionsByDay();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    /**
     * GET /api/transactions/dashboard/revenue-by-day
     * Lấy doanh thu theo từng ngày trong tuần
     * Response: [
     *   { "day": "Mon", "revenue": 3000000 },
     *   { "day": "Tue", "revenue": 3200000 },
     *   ...
     * ]
     */
    @GetMapping("/dashboard/revenue-by-day")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<List<RevenueByDayDTO>> getRevenueByDay() {
        try {
            List<RevenueByDayDTO> data = transactionService.getRevenueByDay();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    /**
     * GET /api/transactions/dashboard/battery-status
     * Lấy phân bổ trạng thái pin
     * Response: {
     *   "full": 45,
     *   "charging": 28,
     *   "maintenance": 12,
     *   "damaged": 5
     * }
     */
    @GetMapping("/dashboard/battery-status")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<BatteryStatusDTO> getBatteryStatus() {
        try {
            BatteryStatusDTO status = transactionService.getBatteryStatusDistribution();
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    /**
     * GET /api/transactions/dashboard/weekly-comparison
     * So sánh tuần này vs tuần trước
     * Response: {
     *   "currentWeek": {
     *     "totalTransactions": 341,
     *     "totalRevenue": 221650000
     *   },
     *   "lastWeek": {
     *     "totalTransactions": 304,
     *     "totalRevenue": 205000000
     *   },
     *   "growth": {
     *     "transactionGrowth": 12.17,
     *     "revenueGrowth": 8.12
     *   }
     * }
     */
    @GetMapping("/dashboard/weekly-comparison")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<WeeklyComparisonDTO> getWeeklyComparison() {
        try {
            WeeklyComparisonDTO comparison = transactionService.getWeeklyComparison();
            return ResponseEntity.ok(comparison);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    /**
     * GET /api/transactions/dashboard/summary
     * Lấy toàn bộ dữ liệu dashboard trong 1 request
     * Response: {
     *   "stats": {...},
     *   "transactionsByDay": [...],
     *   "revenueByDay": [...],
     *   "batteryStatus": {...}
     * }
     */
    @GetMapping("/dashboard/summary")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummary() {
        try {
            DashboardSummaryDTO summary = transactionService.getDashboardSummary();
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    /**
     * GET /api/transactions/dashboard/peak-hours
     * Lấy dữ liệu giao dịch theo giờ trong tuần
     */
    @GetMapping("/dashboard/peak-hours")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<List<PeakHoursDTO>> getPeakHours() {
        try {
            List<PeakHoursDTO> data = transactionService.getPeakHoursData();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * GET /api/transactions/dashboard/top-stations
     * Lấy top 5 performing stations
     */
    @GetMapping("/dashboard/top-stations")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<List<StationPerformanceDTO>> getTopStations() {
        try {
            List<StationPerformanceDTO> data = transactionService.getTopPerformingStations();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * GET /api/transactions/dashboard/user-growth
     * Lấy user growth trend (7 tháng)
     */
    @GetMapping("/dashboard/user-growth")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<UserGrowthDTO> getUserGrowth() {
        try {
            UserGrowthDTO data = transactionService.getUserGrowthTrend();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * GET /api/transactions/dashboard/subscription-distribution
     * Lấy phân phối package plans
     */
    @GetMapping("/dashboard/subscription-distribution")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<SubscriptionDistributionDTO> getSubscriptionDistribution() {
        try {
            SubscriptionDistributionDTO data = transactionService.getSubscriptionDistribution();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
