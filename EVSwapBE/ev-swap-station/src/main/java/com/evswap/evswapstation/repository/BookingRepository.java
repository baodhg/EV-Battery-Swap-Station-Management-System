package com.evswap.evswapstation.repository;

import com.evswap.evswapstation.entity.BookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, Long> {

    // Vì BookingEntity có userId (Integer)
    List<BookingEntity> findByUserIdOrderByTimeDateDesc(Integer userId);

    // Không cần cái findByUserId cũ, trùng chức năng
}
