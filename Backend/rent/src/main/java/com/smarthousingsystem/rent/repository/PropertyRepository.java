package com.smarthousingsystem.rent.repository;

import com.smarthousingsystem.rent.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smarthousingsystem.rent.model.User;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByOwner(User owner);
}
