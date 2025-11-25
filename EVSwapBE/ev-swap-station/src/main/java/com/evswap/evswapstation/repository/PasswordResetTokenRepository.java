package com.evswap.evswapstation.repository;

import com.evswap.evswapstation.entity.PasswordResetToken;
import com.evswap.evswapstation.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findByTokenAndRevokedFalse(String token);

    void deleteByUser(User user);

    void deleteByExpiryDateBefore(LocalDateTime date);

    boolean existsByUserAndRevokedFalseAndExpiryDateAfter(User user, LocalDateTime date);
}
