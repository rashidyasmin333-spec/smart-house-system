package com.smarthousingsystem.rent.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data 
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private String phone;
    private String password;
    
    @Enumerated(EnumType.STRING)
    private Role role; 

    public enum Role {
        TENANT, LANDLORD, ADMINISTRATOR
    }
}
