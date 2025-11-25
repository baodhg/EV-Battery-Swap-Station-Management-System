package com.evswap.evswapstation.service;

import com.evswap.evswapstation.dto.BatteryReturnDTO;
import com.evswap.evswapstation.dto.BatteryReturnRequest;
import com.evswap.evswapstation.entity.Battery;
import com.evswap.evswapstation.entity.BatteryReturn;
import com.evswap.evswapstation.entity.TransactionEntity;
import com.evswap.evswapstation.repository.BatteryRepository;
import com.evswap.evswapstation.repository.BatteryReturnRepository;
import com.evswap.evswapstation.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BatteryReturnService {

    private final BatteryReturnRepository batteryReturnRepository;
    private final BatteryRepository batteryRepository;
    private final TransactionRepository transactionRepository;

    public List<BatteryReturnDTO> getAllBatteryReturns() {
        return batteryReturnRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BatteryReturnDTO getBatteryReturnById(Integer batteryID, Integer transactionID) {
        BatteryReturn.BatteryReturnId id = new BatteryReturn.BatteryReturnId(batteryID, transactionID);
        BatteryReturn batteryReturn = batteryReturnRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy battery return với BatteryID: " + batteryID + " và TransactionID: " + transactionID));
        return convertToDTO(batteryReturn);
    }

    public List<BatteryReturnDTO> getBatteryReturnsByStatus(String status) {
        return batteryReturnRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BatteryReturnDTO createBatteryReturn(BatteryReturnRequest request) {
        LocalDateTime returnTime = LocalDateTime.now();

        // 1. Kiểm tra Battery tồn tại
        Battery battery = batteryRepository.findById(request.getBatteryID())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy battery với ID: " + request.getBatteryID()));

        // 2. Kiểm tra Transaction tồn tại
        TransactionEntity transaction = transactionRepository.findById(request.getTransactionID().longValue())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy transaction với ID: " + request.getTransactionID()));

        // 3. Kiểm tra xem đã tồn tại chưa (vì composite key)
        BatteryReturn.BatteryReturnId compositeId = new BatteryReturn.BatteryReturnId(
                request.getBatteryID(),
                request.getTransactionID()
        );

        if (batteryReturnRepository.existsById(compositeId)) {
            throw new RuntimeException("Battery return này đã tồn tại!");
        }

        // 4. Tạo BatteryReturn record
        BatteryReturn batteryReturn = BatteryReturn.builder()
                .batteryID(request.getBatteryID())
                .transactionID(request.getTransactionID())
                .returnDateTime(returnTime)
                .customer(request.getCustomer())
                .phone(request.getPhone())
                .status("PENDING")
                .build();

        BatteryReturn saved = batteryReturnRepository.save(batteryReturn);

        // 5. Cập nhật Quantity của Battery (+1)
        Integer currentQuantity = battery.getQuantity() != null ? battery.getQuantity() : 0;
        battery.setQuantity(currentQuantity + 1);

        // 6. Cập nhật borrowStatus nếu cần
        battery.setBorrowStatus("Available");
        batteryRepository.save(battery);

        // 7. Cập nhật Return Date trong Transaction
        transaction.setReturnDate(returnTime);

        // 8. Cập nhật status của transaction thành COMPLETED
        transaction.setStatus("COMPLETED");
        transactionRepository.save(transaction);

        return convertToDTO(saved);
    }

    @Transactional
    public BatteryReturnDTO updateStatus(Integer batteryID, Integer transactionID, String newStatus) {
        BatteryReturn.BatteryReturnId id = new BatteryReturn.BatteryReturnId(batteryID, transactionID);

        BatteryReturn batteryReturn = batteryReturnRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy battery return với BatteryID: " + batteryID + " và TransactionID: " + transactionID));

        batteryReturn.setStatus(newStatus);
        BatteryReturn updated = batteryReturnRepository.save(batteryReturn);
        return convertToDTO(updated);
    }

    private BatteryReturnDTO convertToDTO(BatteryReturn batteryReturn) {
        BatteryReturnDTO dto = BatteryReturnDTO.builder()
                .batteryID(batteryReturn.getBatteryID())
                .transactionID(batteryReturn.getTransactionID())
                .returnDateTime(batteryReturn.getReturnDateTime())
                .customer(batteryReturn.getCustomer())
                .phone(batteryReturn.getPhone())
                .status(batteryReturn.getStatus())
                .build();

        // Nếu có thông tin battery
        if (batteryReturn.getBattery() != null) {
            dto.setBatteryCode(batteryReturn.getBattery().getBatteryName());
            dto.setBatteryCapacity(batteryReturn.getBattery().getCapacity());
        }

        return dto;
    }
}