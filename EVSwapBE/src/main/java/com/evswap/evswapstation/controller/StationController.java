package com.evswap.evswapstation.controller;

import com.evswap.evswapstation.entity.Station;
import com.evswap.evswapstation.service.StationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stations")
@RequiredArgsConstructor
public class StationController {
    private final StationService stationService;

    @GetMapping("/nearby")
    public ResponseEntity<?> getNearbyStations(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5") double radiusKm
    ) {
        return ResponseEntity.ok(stationService.findNearbyStations(lat, lng, radiusKm));
    }

    @GetMapping
    public ResponseEntity<List<Station>> getAll() {
        return ResponseEntity.ok(stationService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Station> getById(@PathVariable Integer id) {
        return stationService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Station> create(@RequestBody Station station) {
        return ResponseEntity.ok(stationService.create(station));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Station> update(@PathVariable Integer id, @RequestBody Station station) {
        return ResponseEntity.ok(stationService.update(id, station));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        stationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== TRANSACTION MANAGEMENT (In-Memory) ====================

    // Lưu trữ giao dịch tạm thời trong bộ nhớ
    private static final Map<Integer, SwapTransaction> transactionStore = new HashMap<>();
    private static Integer transactionIdCounter = 1;

    /**
     * Tạo giao dịch mới tại trạm
     * POST /api/stations/{stationId}/transactions
     */
    @PostMapping("/{stationId}/transactions")
    public ResponseEntity<SwapTransaction> createTransaction(
            @PathVariable Integer stationId,
            @RequestBody SwapTransaction transaction) {

        // Kiểm tra trạm có tồn tại không
        if (stationService.getById(stationId).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        transaction.setId(transactionIdCounter++);
        transaction.setStationId(stationId);
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setUpdatedAt(LocalDateTime.now());

        if (transaction.getTransactionDate() == null) {
            transaction.setTransactionDate(LocalDateTime.now());
        }

        if (transaction.getVehicleVin() != null) {
            transaction.setVehicleVin(transaction.getVehicleVin().toUpperCase());
        }

        transactionStore.put(transaction.getId(), transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
    }

    /**
     * Lấy tất cả giao dịch của trạm
     * GET /api/stations/{stationId}/transactions
     */
    @GetMapping("/{stationId}/transactions")
    public ResponseEntity<List<SwapTransaction>> getStationTransactions(@PathVariable Integer stationId) {
        List<SwapTransaction> transactions = transactionStore.values().stream()
                .filter(t -> t.getStationId().equals(stationId))
                .sorted(Comparator.comparing(SwapTransaction::getTransactionDate).reversed())
                .toList();
        return ResponseEntity.ok(transactions);
    }

    /**
     * Lấy chi tiết giao dịch
     * GET /api/stations/{stationId}/transactions/{transactionId}
     */
    @GetMapping("/{stationId}/transactions/{transactionId}")
    public ResponseEntity<SwapTransaction> getTransactionById(
            @PathVariable Integer stationId,
            @PathVariable Integer transactionId) {

        SwapTransaction transaction = transactionStore.get(transactionId);
        if (transaction == null || !transaction.getStationId().equals(stationId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(transaction);
    }

    /**
     * Cập nhật giao dịch
     * PUT /api/stations/{stationId}/transactions/{transactionId}
     */
    @PutMapping("/{stationId}/transactions/{transactionId}")
    public ResponseEntity<SwapTransaction> updateTransaction(
            @PathVariable Integer stationId,
            @PathVariable Integer transactionId,
            @RequestBody SwapTransaction updatedTransaction) {

        SwapTransaction transaction = transactionStore.get(transactionId);
        if (transaction == null || !transaction.getStationId().equals(stationId)) {
            return ResponseEntity.notFound().build();
        }

        transaction.setTransactionDate(updatedTransaction.getTransactionDate());
        transaction.setCustomerName(updatedTransaction.getCustomerName());
        transaction.setCustomerEmail(updatedTransaction.getCustomerEmail());
        transaction.setVehicleVin(updatedTransaction.getVehicleVin().toUpperCase());
        transaction.setAmount(updatedTransaction.getAmount());
        transaction.setUpdatedAt(LocalDateTime.now());

        return ResponseEntity.ok(transaction);
    }

    /**
     * Xóa giao dịch
     * DELETE /api/stations/{stationId}/transactions/{transactionId}
     */
    @DeleteMapping("/{stationId}/transactions/{transactionId}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable Integer stationId,
            @PathVariable Integer transactionId) {

        SwapTransaction transaction = transactionStore.get(transactionId);
        if (transaction == null || !transaction.getStationId().equals(stationId)) {
            return ResponseEntity.notFound().build();
        }

        transactionStore.remove(transactionId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Tìm kiếm giao dịch tại trạm
     * GET /api/stations/{stationId}/transactions/search?customerName=...&customerEmail=...&vehicleVin=...
     */
    @GetMapping("/{stationId}/transactions/search")
    public ResponseEntity<List<SwapTransaction>> searchStationTransactions(
            @PathVariable Integer stationId,
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) String customerEmail,
            @RequestParam(required = false) String vehicleVin) {

        List<SwapTransaction> transactions = transactionStore.values().stream()
                .filter(t -> t.getStationId().equals(stationId))
                .filter(t -> customerName == null ||
                        t.getCustomerName().toLowerCase().contains(customerName.toLowerCase()))
                .filter(t -> customerEmail == null ||
                        t.getCustomerEmail().toLowerCase().contains(customerEmail.toLowerCase()))
                .filter(t -> vehicleVin == null ||
                        t.getVehicleVin().toLowerCase().contains(vehicleVin.toLowerCase()))
                .sorted(Comparator.comparing(SwapTransaction::getTransactionDate).reversed())
                .toList();

        return ResponseEntity.ok(transactions);
    }

    /**
     * Lấy doanh thu của trạm
     * GET /api/stations/{stationId}/revenue?startDate=...&endDate=...
     */
    @GetMapping("/{stationId}/revenue")
    public ResponseEntity<Map<String, Object>> getStationRevenue(
            @PathVariable Integer stationId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        List<SwapTransaction> transactions = transactionStore.values().stream()
                .filter(t -> t.getStationId().equals(stationId))
                .filter(t -> startDate == null || !t.getTransactionDate().isBefore(startDate))
                .filter(t -> endDate == null || !t.getTransactionDate().isAfter(endDate))
                .toList();

        BigDecimal totalRevenue = transactions.stream()
                .map(SwapTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> response = new HashMap<>();
        response.put("totalRevenue", totalRevenue);
        response.put("totalTransactions", transactions.size());
        response.put("stationId", stationId);
        if (startDate != null) response.put("fromDate", startDate);
        if (endDate != null) response.put("toDate", endDate);

        return ResponseEntity.ok(response);
    }

    /**
     * Lấy tổng doanh thu tất cả trạm
     * GET /api/stations/revenue/total
     */
    @GetMapping("/revenue/total")
    public ResponseEntity<Map<String, Object>> getTotalRevenue() {
        BigDecimal totalRevenue = transactionStore.values().stream()
                .map(SwapTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> response = new HashMap<>();
        response.put("totalRevenue", totalRevenue);
        response.put("totalTransactions", transactionStore.size());

        return ResponseEntity.ok(response);
    }

    // Inner class cho giao dịch
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class SwapTransaction {
        private Integer id;
        private LocalDateTime transactionDate;
        private String customerName;
        private String customerEmail;
        private String vehicleVin;
        private BigDecimal amount;
        private Integer stationId;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}