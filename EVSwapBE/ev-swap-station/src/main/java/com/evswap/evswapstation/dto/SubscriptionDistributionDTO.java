package com.evswap.evswapstation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.ArrayList;

@Data
@NoArgsConstructor
public class SubscriptionDistributionDTO {
    private List<PackageDistribution> packages;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PackageDistribution {
        private String name;      // Tên gói (Pay Per Use, Basic Monthly, etc.)
        private Long value;       // Số lượng giao dịch/subscriptions
        private String color;     // Màu hiển thị trên biểu đồ
        private Double percentage; // Phần trăm (optional, tính ở frontend cũng được)
    }

    // Constructor chỉ nhận List
    public SubscriptionDistributionDTO(List<PackageDistribution> packages) {
        this.packages = packages;
    }

    // Constructor cũ cho backward compatibility (nếu cần)
    public SubscriptionDistributionDTO(Long payPerUse, Long basicMonthly,
                                       Long premiumMonthly, Long unlimitedPro) {
        this.packages = new ArrayList<>();
        long total = payPerUse + basicMonthly + premiumMonthly + unlimitedPro;

        packages.add(new PackageDistribution("Pay Per Use", payPerUse,
                "#7241ce", calculatePercentage(payPerUse, total)));
        packages.add(new PackageDistribution("Basic Monthly", basicMonthly,
                "#A2F200", calculatePercentage(basicMonthly, total)));
        packages.add(new PackageDistribution("Premium Monthly", premiumMonthly,
                "#3b82f6", calculatePercentage(premiumMonthly, total)));
        packages.add(new PackageDistribution("Unlimited Pro", unlimitedPro,
                "#f59e0b", calculatePercentage(unlimitedPro, total)));
    }

    private Double calculatePercentage(Long value, Long total) {
        if (total == 0) return 0.0;
        return Math.round((value * 100.0 / total) * 100.0) / 100.0; // 2 số thập phân
    }
}