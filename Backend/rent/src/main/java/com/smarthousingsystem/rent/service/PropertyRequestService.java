package com.smarthousingsystem.rent.service;

import com.smarthousingsystem.rent.model.Property;
import com.smarthousingsystem.rent.model.PropertyRequest;
import com.smarthousingsystem.rent.model.User;
import com.smarthousingsystem.rent.repository.PropertyRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PropertyRequestService {

    private final PropertyRequestRepository propertyRequestRepository;

    public List<PropertyRequest> getAllRequests() {
        return propertyRequestRepository.findAll();
    }

    public Optional<PropertyRequest> getRequestById(Long id) {
        return propertyRequestRepository.findById(id);
    }

    public PropertyRequest createRequest(PropertyRequest request) {
        return propertyRequestRepository.save(request);
    }

    public List<PropertyRequest> getRequestsForLandlord(User landlord) {
        return propertyRequestRepository.findByPropertyOwner(landlord);
    }

    public List<PropertyRequest> getRequestsForTenant(User tenant) {
        return propertyRequestRepository.findByTenant(tenant);
    }

    public PropertyRequest updateRequestStatus(Long id, String status) {
        PropertyRequest request = propertyRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status);
        return propertyRequestRepository.save(request);
    }
}
