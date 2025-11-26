package com.evswap.evswapstation.controller;

import com.evswap.evswapstation.dto.BatteryReturnDTO;
import com.evswap.evswapstation.dto.BatteryReturnRequest;
import com.evswap.evswapstation.service.BatteryReturnService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/battery-returns")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ADMIN','STAFF')")
public class BatteryReturnController {

    private final BatteryReturnService batteryReturnService;

    /**
     * GET - Lấy tất cả battery returns
     * Endpoint: GET /api/battery-returns
     */
    @GetMapping
    public ResponseEntity<List<BatteryReturnDTO>> getAllBatteryReturns() {
        List<BatteryReturnDTO> returns = batteryReturnService.getAllBatteryReturns();
        return ResponseEntity.ok(returns);
    }

    /**
     * GET - Lấy battery return theo composite key
     * Endpoint: GET /api/battery-returns/{batteryID}/{transactionID}
     */
    @GetMapping("/{batteryID}/{transactionID}")
    public ResponseEntity<BatteryReturnDTO> getBatteryReturnById(
            @PathVariable Integer batteryID,
            @PathVariable Integer transactionID) {
        BatteryReturnDTO batteryReturn = batteryReturnService.getBatteryReturnById(batteryID, transactionID);
        return ResponseEntity.ok(batteryReturn);
    }

    /**
     * GET - Lấy battery returns theo status
     * Endpoint: GET /api/battery-returns/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<BatteryReturnDTO>> getBatteryReturnsByStatus(@PathVariable String status) {
        List<BatteryReturnDTO> returns = batteryReturnService.getBatteryReturnsByStatus(status);
        return ResponseEntity.ok(returns);
    }

    /**
     * POST - Tạo mới battery return
     * Endpoint: POST /api/battery-returns
     * Body: BatteryReturnRequest JSON
     */
    @PostMapping
    public ResponseEntity<BatteryReturnDTO> createBatteryReturn(
            @Valid @RequestBody BatteryReturnRequest request) {
        System.out.println("Received POST request: " + request);
        BatteryReturnDTO created = batteryReturnService.createBatteryReturn(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PATCH - Cập nhật status của battery return
     * Endpoint: PATCH /api/battery-returns/{batteryID}/{transactionID}/status
     * Body: { "status": "COMPLETED" }
     */
    @PatchMapping("/{batteryID}/{transactionID}/status")
    public ResponseEntity<BatteryReturnDTO> updateStatus(
            @PathVariable Integer batteryID,
            @PathVariable Integer transactionID,
            @RequestBody StatusUpdateRequest request) {
        BatteryReturnDTO updated = batteryReturnService.updateStatus(batteryID, transactionID, request.getStatus());
        return ResponseEntity.ok(updated);
    }

    // DTO cho request cập nhật status
    @lombok.Getter
    @lombok.Setter
    public static class StatusUpdateRequest {
        private String status;
    }
}