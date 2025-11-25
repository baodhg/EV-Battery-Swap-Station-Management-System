package com.evswap.evswapstation.entity;
import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "BatteryReturn")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(BatteryReturn.BatteryReturnId.class)
public class BatteryReturn {

    @Id
    @Column(name = "BatteryID")
    private Integer batteryID;

    @Id
    @Column(name = "TransactionID")
    private Integer transactionID;

    @Column(name = "ReturnDateTime")
    private LocalDateTime returnDateTime;

    @Column(name = "Customer")
    private String customer;

    @Column(name = "Phone")
    private String phone;

    @Column(name = "Status")
    private String status;

    @ManyToOne
    @JoinColumn(name = "BatteryID", insertable = false, updatable = false)
    private Battery battery;

    // Composite Key Class
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BatteryReturnId implements Serializable {
        private Integer batteryID;
        private Integer transactionID;
    }
}