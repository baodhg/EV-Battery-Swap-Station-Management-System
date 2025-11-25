package com.evswap.evswapstation.repository;

import com.evswap.evswapstation.dto.TransactionBatteryDTO;
import com.evswap.evswapstation.entity.TransactionEntity;
import com.evswap.evswapstation.dto.TransactionDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionEntity, Long> {

    // Existing methods
    TransactionEntity findByPayPalTransactionId(String payPalTransactionId);
    List<TransactionEntity> findByStatus(String status);

    // QUERY ĐÃ SỬA - Sử dụng CONCAT để convert sang String
    @Query("""
       SELECT new com.evswap.evswapstation.dto.TransactionDTO(
            t.transactionId,
            t.timeDate,
            u.fullName,
            u.email,
            MIN(v.vin),
            t.amount,
            CONCAT('', t.paymentId),
            t.status
       )
       FROM TransactionEntity t
       LEFT JOIN t.user u
       LEFT JOIN Vehicle v ON v.user = u
       GROUP BY t.transactionId, t.timeDate, u.fullName, u.email, t.amount, t.paymentId, t.status
       ORDER BY t.timeDate DESC
       """)
    List<TransactionDTO> findAllTransactionsWithDetails();

    @Query("SELECT t FROM TransactionEntity t " +
            "LEFT JOIN FETCH t.user " +
            "WHERE t.transactionId = :id")
    Optional<TransactionEntity> findByIdWithUser(@Param("id") Long id);

    // ✅ SỬA DÒNG NÀY: Đổi t.userId → t.user.id
    @Query("SELECT t FROM TransactionEntity t " +
            "LEFT JOIN FETCH t.user " +
            "WHERE t.user.id = :userId " +  // ← ĐÃ SỬA
            "ORDER BY t.timeDate DESC")
    List<TransactionEntity> findByUserIdWithUser(@Param("userId") Long userId);

    @Query("SELECT new com.evswap.evswapstation.dto.TransactionBatteryDTO(" +
            "t.transactionId, u.userName, u.phone, i.status, " +
            "i.battery.batteryID, t.returnDate) " +
            "FROM TransactionEntity t " +
            "JOIN t.user u " +
            "LEFT JOIN Inventory i ON t.inventoryId = i.inventoryID " +
            "ORDER BY t.transactionId DESC")
    List<TransactionBatteryDTO> findAllTransactionBatteryInfo();

    // ====== DASHBOARD QUERIES MỚI ======

    /**
     * Tìm giao dịch trong khoảng thời gian
     */
    List<TransactionEntity> findByTransactionDateBetween(
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    /**
     * Đếm giao dịch theo status trong khoảng thời gian
     */
    @Query("SELECT t.status, COUNT(t) FROM TransactionEntity t " +
            "WHERE t.transactionDate BETWEEN :startDate AND :endDate " +
            "GROUP BY t.status")
    List<Object[]> countByStatusBetweenDates(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * Tính tổng doanh thu theo ngày trong tuần
     */
    @Query("SELECT DAYOFWEEK(t.transactionDate), SUM(t.amount) " +
            "FROM TransactionEntity t " +
            "WHERE t.transactionDate BETWEEN :startDate AND :endDate " +
            "AND t.status = 'COMPLETED' " +
            "GROUP BY DAYOFWEEK(t.transactionDate) " +
            "ORDER BY DAYOFWEEK(t.transactionDate)")
    List<Object[]> sumRevenueByDayOfWeek(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * Đếm giao dịch theo ngày trong tuần
     */
    @Query("SELECT DAYOFWEEK(t.transactionDate), COUNT(t) " +
            "FROM TransactionEntity t " +
            "WHERE t.transactionDate BETWEEN :startDate AND :endDate " +
            "GROUP BY DAYOFWEEK(t.transactionDate) " +
            "ORDER BY DAYOFWEEK(t.transactionDate)")
    List<Object[]> countByDayOfWeek(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * Tổng doanh thu trong khoảng thời gian (chỉ COMPLETED)
     */
    @Query("SELECT SUM(t.amount) FROM TransactionEntity t " +
            "WHERE t.transactionDate BETWEEN :startDate AND :endDate " +
            "AND t.status = 'COMPLETED'")
    Double sumRevenueByDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * Đếm giao dịch theo user trong tháng hiện tại
     * ✅ FIX: Dùng userID (chữ I và D viết hoa) theo User entity
     */
    @Query("SELECT t.user.userID, COUNT(t) FROM TransactionEntity t " +
            "WHERE MONTH(t.transactionDate) = MONTH(CURRENT_DATE) " +
            "AND YEAR(t.transactionDate) = YEAR(CURRENT_DATE) " +
            "GROUP BY t.user.userID " +
            "ORDER BY COUNT(t) DESC")
    List<Object[]> countByUserThisMonth();

    /**
     * Top 10 giao dịch gần nhất
     */
    @Query("SELECT t FROM TransactionEntity t " +
            "ORDER BY t.transactionDate DESC")
    List<TransactionEntity> findTop10ByOrderByTransactionDateDesc();

    /**
     * Đếm giao dịch theo giờ trong ngày (Peak Hours)
     */
    @Query("SELECT " +
            "CASE " +
            "  WHEN HOUR(t.transactionDate) < 10 THEN CONCAT('0', CAST(HOUR(t.transactionDate) AS string), ':00') " +
            "  ELSE CONCAT(CAST(HOUR(t.transactionDate) AS string), ':00') " +
            "END, " +
            "COUNT(t) " +
            "FROM TransactionEntity t " +
            "WHERE t.transactionDate BETWEEN :startDate AND :endDate " +
            "GROUP BY HOUR(t.transactionDate) " +
            "ORDER BY HOUR(t.transactionDate)")
    List<Object[]> countByHourOfDay(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * Top stations theo số lượng giao dịch
     * ✅ FIX: Dùng stationID từ TransactionEntity
     */
    @Query("SELECT s.stationName, COUNT(t), SUM(t.amount), " +
            "CAST((COUNT(t) * 100.0 / :totalCapacity) AS int) " +
            "FROM TransactionEntity t " +
            "JOIN Station s ON t.stationId = s.stationID " +
            "WHERE t.transactionDate BETWEEN :startDate AND :endDate " +
            "GROUP BY s.stationID, s.stationName " +
            "ORDER BY COUNT(t) DESC")
    List<Object[]> findTopStationPerformance(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("totalCapacity") Integer totalCapacity
    );

    /**
     * Đếm user mới theo tháng (cho User Growth)
     * ✅ FIX: Sử dụng createdAt từ User entity
     */
    @Query("SELECT " +
            "CASE MONTH(u.createdAt) " +
            "  WHEN 1 THEN 'Jan' WHEN 2 THEN 'Feb' WHEN 3 THEN 'Mar' " +
            "  WHEN 4 THEN 'Apr' WHEN 5 THEN 'May' WHEN 6 THEN 'Jun' " +
            "  WHEN 7 THEN 'Jul' WHEN 8 THEN 'Aug' WHEN 9 THEN 'Sep' " +
            "  WHEN 10 THEN 'Oct' WHEN 11 THEN 'Nov' WHEN 12 THEN 'Dec' " +
            "END, " +
            "COUNT(u), " +
            "MONTH(u.createdAt) " +
            "FROM User u " +
            "WHERE u.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY MONTH(u.createdAt) " +
            "ORDER BY MONTH(u.createdAt)")
    List<Object[]> countUsersByMonth(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * Đếm user active (có giao dịch trong tháng)
     */
    @Query("SELECT MONTH(t.transactionDate), COUNT(DISTINCT t.user.userID) " +
            "FROM TransactionEntity t " +
            "WHERE t.transactionDate BETWEEN :startDate AND :endDate " +
            "GROUP BY MONTH(t.transactionDate) " +
            "ORDER BY MONTH(t.transactionDate)")
    List<Object[]> countActiveUsersByMonth(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}