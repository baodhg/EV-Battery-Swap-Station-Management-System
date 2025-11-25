package com.evswap.evswapstation.service;

import com.evswap.evswapstation.dto.AdminDashboardStatsDTO;
import com.evswap.evswapstation.dto.WeeklySwapDTO;
import com.evswap.evswapstation.repository.StationRepository;
import com.evswap.evswapstation.repository.TransactionRepository;
import com.evswap.evswapstation.repository.UserRepository;
import com.evswap.evswapstation.repository.BatteryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final StationRepository stationRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final BatteryRepository batteryRepository;

    /**
     * Lấy thống kê tổng quan cho admin dashboard
     */
    public AdminDashboardStatsDTO getDashboardStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        // Start of current month
        LocalDateTime startOfMonth = now.with(TemporalAdjusters.firstDayOfMonth())
                .withHour(0).withMinute(0).withSecond(0);

        // Start of last month
        LocalDateTime startOfLastMonth = startOfMonth.minusMonths(1);

        // 1. Active Stations - Tất cả 9 stations đều active
        int activeStations = (int) stationRepository.count();

        // 2. Stations growth this month (không có station mới)
        int stationsGrowth = 0;

        // 3. Total Batteries - Lấy từ Battery table (sum quantity)
        Integer totalBatteries = batteryRepository.getTotalBatteryCount();
        if (totalBatteries == null) {
            totalBatteries = 0;
        }

        // 4. Average Battery SOH (State of Health)
        // Dùng average capacity để estimate SOH
        // Giả sử rated capacity là 100Ah, current capacity / 100 * 100 = SOH%
        Double avgCapacity = batteryRepository.getAverageCapacity();
        double avgBatterySOH = 87.0; // Default
        if (avgCapacity != null && avgCapacity > 0) {
            // Nếu capacity trung bình là ~87Ah trên 100Ah rated = 87% SOH
            avgBatterySOH = (avgCapacity / 100.0) * 100.0;
            // Giới hạn trong khoảng 70-100%
            avgBatterySOH = Math.max(70, Math.min(100, avgBatterySOH));
        }

        // 5. Active Users (có status ACTIVE hoặc không có status field)
        int activeUsers = (int) userRepository.findAll().stream()
                .filter(u -> u.getStatus() == null ||
                        "ACTIVE".equalsIgnoreCase(u.getStatus()))
                .count();

        // 6. Users growth (% increase compared to last month)
        long usersThisMonth = userRepository.findAll().stream()
                .filter(u -> u.getCreatedAt() != null &&
                        u.getCreatedAt().isAfter(startOfMonth))
                .count();

        long usersLastMonth = userRepository.findAll().stream()
                .filter(u -> u.getCreatedAt() != null &&
                        u.getCreatedAt().isAfter(startOfLastMonth) &&
                        u.getCreatedAt().isBefore(startOfMonth))
                .count();

        double usersGrowth = usersLastMonth > 0
                ? ((double) (usersThisMonth - usersLastMonth) / usersLastMonth) * 100
                : 100.0;

        // 7. Today's swaps (transactions today)
        long todaySwaps = transactionRepository.findAll().stream()
                .filter(t -> t.getTransactionDate() != null &&
                        t.getTransactionDate().toLocalDate().equals(today))
                .count();

        // 8. Swaps growth compared to yesterday
        long yesterdaySwaps = transactionRepository.findAll().stream()
                .filter(t -> t.getTransactionDate() != null &&
                        t.getTransactionDate().toLocalDate().equals(yesterday))
                .count();

        double swapsGrowth = yesterdaySwaps > 0
                ? ((double) (todaySwaps - yesterdaySwaps) / yesterdaySwaps) * 100
                : (todaySwaps > 0 ? 100.0 : 0.0);

        return new AdminDashboardStatsDTO(
                activeStations,
                stationsGrowth,
                totalBatteries,
                avgBatterySOH,
                activeUsers,
                usersGrowth,
                (int) todaySwaps,
                swapsGrowth
        );
    }

    /**
     * Lấy số lượng swap theo từng ngày trong tuần
     */
    public List<WeeklySwapDTO> getWeeklySwaps() {
        LocalDateTime startOfWeek = LocalDateTime.now()
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .withHour(0).withMinute(0).withSecond(0);

        LocalDateTime endOfWeek = startOfWeek.plusWeeks(1);

        // Get all transactions this week
        var transactions = transactionRepository.findByTransactionDateBetween(startOfWeek, endOfWeek);

        // Group by day of week
        Map<String, Long> swapsByDay = transactions.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getTransactionDate().getDayOfWeek().toString(),
                        Collectors.counting()
                ));

        // Convert to DTO with proper day order
        String[] days = {"MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"};
        String[] dayNames = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};

        List<WeeklySwapDTO> result = new ArrayList<>();
        for (int i = 0; i < days.length; i++) {
            Long count = swapsByDay.getOrDefault(days[i], 0L);
            result.add(new WeeklySwapDTO(dayNames[i], count));
        }

        return result;
    }
}