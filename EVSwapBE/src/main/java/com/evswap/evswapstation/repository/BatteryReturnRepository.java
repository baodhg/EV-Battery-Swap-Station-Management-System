package com.evswap.evswapstation.repository;

import com.evswap.evswapstation.entity.BatteryReturn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BatteryReturnRepository extends JpaRepository<BatteryReturn, BatteryReturn.BatteryReturnId> {

    List<BatteryReturn> findByStatus(String status);

    List<BatteryReturn> findByBatteryID(Integer batteryID);

    List<BatteryReturn> findByTransactionID(Integer transactionID);

    List<BatteryReturn> findByCustomer(String customer);

    Optional<BatteryReturn> findByBatteryIDAndTransactionID(Integer batteryID, Integer transactionID);
}