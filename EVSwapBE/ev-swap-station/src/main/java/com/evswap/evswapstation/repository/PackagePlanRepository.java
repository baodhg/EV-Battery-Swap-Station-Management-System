package com.evswap.evswapstation.repository;

import com.evswap.evswapstation.entity.PackagePlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PackagePlanRepository extends JpaRepository<PackagePlan, Integer> {
    Optional<PackagePlan> findByPackageName(String packageName);

    /**
     * Đếm số giao dịch theo từng package plan
     */
    @Query("SELECT p.packageName, COUNT(t) " +
            "FROM TransactionEntity t " +
            "JOIN PackagePlan p ON t.packageId = p.packageId " +
            "WHERE t.status = 'COMPLETED' " +
            "GROUP BY p.packageId, p.packageName " +
            "ORDER BY COUNT(t) DESC")
    List<Object[]> countTransactionsByPackage();
}

