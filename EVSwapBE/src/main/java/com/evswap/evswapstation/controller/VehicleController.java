package com.evswap.evswapstation.controller;

import com.evswap.evswapstation.dto.VehicleCreateRequest;
import com.evswap.evswapstation.dto.VehicleResponse;
import com.evswap.evswapstation.entity.Vehicle;
import com.evswap.evswapstation.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {
    private final VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getAll() {
        List<VehicleResponse> responses = vehicleService.getAll().stream()
                .map(VehicleResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> getById(@PathVariable Integer id) {
        return vehicleService.getById(id)
                .map(VehicleResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<VehicleResponse>> getVehiclesByUserId(@PathVariable Integer userId) {
        List<VehicleResponse> responses = vehicleService.getVehiclesByUserId(userId).stream()
                .map(VehicleResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<VehicleResponse> createVehicle(@Valid @RequestBody VehicleCreateRequest request) {
        Vehicle vehicle = vehicleService.createVehicle(request);
        return ResponseEntity.ok(VehicleResponse.fromEntity(vehicle));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> update(@PathVariable Integer id, @RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(vehicleService.update(id, vehicle));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        vehicleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}