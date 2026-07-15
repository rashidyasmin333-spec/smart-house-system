package com.smarthousingsystem.rent.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Data
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long propertyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    private String title;
    private String location;
    private BigDecimal price;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String status;

    private String contactInfo;
    
    private String imageUrl;

    private Boolean rented;
}