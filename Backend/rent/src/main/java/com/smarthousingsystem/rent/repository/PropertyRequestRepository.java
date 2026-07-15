package com.smarthousingsystem.rent.repository;

import com.smarthousingsystem.rent.model.Property;
import com.smarthousingsystem.rent.model.PropertyRequest;
import com.smarthousingsystem.rent.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRequestRepository extends JpaRepository<PropertyRequest, Long> {
    List<PropertyRequest> findByPropertyOwner(User owner);
    List<PropertyRequest> findByTenant(User tenant);
    List<PropertyRequest> findByProperty(Property property);
}
