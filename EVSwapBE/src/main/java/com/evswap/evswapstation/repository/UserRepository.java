package com.evswap.evswapstation.repository;

import com.evswap.evswapstation.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUserName(String userName);

    @Query("SELECT u FROM User u WHERE u.email = :email ORDER BY u.userID ASC")
    Optional<User> findByEmail(@Param("email") String email);

    List<User> findAllByEmail(String email);
    Optional<User> findByGoogleId(String googleId);

    boolean existsByUserName(String userName);
    boolean existsByEmail(String email);
    Optional<User> findByUserNameOrEmail(String userName, String email);

    // SỬA LẠI: Đổi từ findByUserId -> findByUserID và trả về User
    Optional<User> findByUserID(Long userID);
}