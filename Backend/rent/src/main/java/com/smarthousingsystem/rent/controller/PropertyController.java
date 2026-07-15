package com.smarthousingsystem.rent.controller;


import com.smarthousingsystem.rent.model.Property;
import com.smarthousingsystem.rent.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "*") // Allows your frontend to make requests to this backend
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    // Endpoint: GET /api/properties
    @GetMapping
    public ResponseEntity<List<Property>> getAllProperties() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    // Endpoint: GET /api/properties/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
        return propertyService.getPropertyById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<List<Property>> getPropertiesByLandlord(@PathVariable Long landlordId) {
        return ResponseEntity.ok(propertyService.getPropertiesByLandlord(landlordId));
    }

    // Endpoint: POST /api/properties
    @PostMapping
    public ResponseEntity<Property> createProperty(@RequestBody Property property) {
        try {
            Property newProperty = propertyService.createProperty(property);
            return new ResponseEntity<>(newProperty, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(@PathVariable Long id, @RequestBody Property property) {
        try {
            return ResponseEntity.ok(propertyService.updateProperty(id, property));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        try {
            propertyService.deleteProperty(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/request")
    public ResponseEntity<Property> requestProperty(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(propertyService.requestProperty(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/rent")
    public ResponseEntity<Property> markAsRented(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(propertyService.markPropertyAsRented(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint: PUT /api/properties/{id}/status
    @PutMapping("/{id}/status")
    public ResponseEntity<Property> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Property updatedProperty = propertyService.updatePropertyStatus(id, status);
            return ResponseEntity.ok(updatedProperty);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
