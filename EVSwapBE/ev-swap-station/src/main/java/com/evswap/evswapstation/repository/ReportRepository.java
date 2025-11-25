package com.evswap.evswapstation.repository;

import com.evswap.evswapstation.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    // Query để lấy Reports với userId (Integer thay vì Long)
    @Query("SELECT r FROM Report r WHERE r.userId = :userId")
    List<Report> findByUserId(Integer userId);

    // Query để lấy tất cả reports
    List<Report> findAll();
}