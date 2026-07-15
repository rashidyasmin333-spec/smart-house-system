package com.smarthousingsystem.rent.controller;

import com.smarthousingsystem.rent.model.PropertyRequest;
import com.smarthousingsystem.rent.model.User;
import com.smarthousingsystem.rent.service.PropertyRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PropertyRequestController {

    private final PropertyRequestService propertyRequestService;

    @GetMapping
    public ResponseEntity<List<PropertyRequest>> getAllRequests() {
        return ResponseEntity.ok(propertyRequestService.getAllRequests());
    }

    @PostMapping
    public ResponseEntity<PropertyRequest> createRequest(@RequestBody PropertyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(propertyRequestService.createRequest(request));
    }

    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<List<PropertyRequest>> getRequestsForLandlord(@PathVariable Long landlordId) {
        User landlord = new User();
        landlord.setUserId(landlordId);
        return ResponseEntity.ok(propertyRequestService.getRequestsForLandlord(landlord));
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<PropertyRequest>> getRequestsForTenant(@PathVariable Long tenantId) {
        User tenant = new User();
        tenant.setUserId(tenantId);
        return ResponseEntity.ok(propertyRequestService.getRequestsForTenant(tenant));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<PropertyRequest> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            return ResponseEntity.ok(propertyRequestService.updateRequestStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
