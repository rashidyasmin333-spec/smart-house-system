package com.smarthousingsystem.rent.service;

import com.smarthousingsystem.rent.model.Property;
import com.smarthousingsystem.rent.model.User;
import com.smarthousingsystem.rent.repository.PropertyRepository;
import com.smarthousingsystem.rent.repository.PropertyRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyRequestRepository propertyRequestRepository;

    // 1. Get all properties
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    // 2. Get a property by ID
    public Optional<Property> getPropertyById(Long id) {
        return propertyRepository.findById(id);
    }

    public List<Property> getPropertiesByLandlord(Long landlordId) {
        User landlord = new User();
        landlord.setUserId(landlordId);
        return propertyRepository.findByOwner(landlord);
    }

    // 3. Add a new property
    public Property createProperty(Property property) {
        if (property.getPrice() == null || property.getPrice().signum() <= 0) {
            throw new IllegalArgumentException("Property price must be greater than zero");
        }
        property.setStatus("AVAILABLE");
        property.setRented(false);
        return propertyRepository.save(property);
    }

    public Property updateProperty(Long id, Property updatedProperty) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        property.setTitle(updatedProperty.getTitle());
        property.setLocation(updatedProperty.getLocation());
        property.setPrice(updatedProperty.getPrice());
        property.setDescription(updatedProperty.getDescription());
        property.setStatus(updatedProperty.getStatus());
        property.setContactInfo(updatedProperty.getContactInfo());
        property.setImageUrl(updatedProperty.getImageUrl());
        property.setRented(updatedProperty.getRented());
        return propertyRepository.save(property);
    }

    public void deleteProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        
        // Delete associated property requests first
        var requests = propertyRequestRepository.findByProperty(property);
        propertyRequestRepository.deleteAll(requests);
        
        // Delete the property
        propertyRepository.delete(property);
    }

    public Property markPropertyAsRented(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        property.setRented(true);
        property.setStatus("RENTED");
        return propertyRepository.save(property);
    }

    public Property requestProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        property.setStatus("INTERESTED");
        return propertyRepository.save(property);
    }

    // 4. Update property status (e.g., for Administrators verifying a house)
    public Property updatePropertyStatus(Long id, String status) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        property.setStatus(status);
        return propertyRepository.save(property);
    }
}
