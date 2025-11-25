package com.evswap.evswapstation.repository;

import com.evswap.evswapstation.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {
    PaymentEntity findByPayPalTransactionId(String payPalTransactionId);
}