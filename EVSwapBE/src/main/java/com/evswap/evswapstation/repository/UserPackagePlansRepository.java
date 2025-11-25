package com.evswap.evswapstation.repository;

import com.evswap.evswapstation.entity.UserPackagePlans;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserPackagePlansRepository extends JpaRepository<UserPackagePlans, Long> {
    List<UserPackagePlans> findByUserIdAndStatus(Integer userId, String status);
    List<UserPackagePlans> findByUserId(Integer userId);
}