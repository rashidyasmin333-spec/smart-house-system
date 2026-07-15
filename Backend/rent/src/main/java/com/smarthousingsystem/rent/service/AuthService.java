package com.smarthousingsystem.rent.service;

import com.smarthousingsystem.rent.model.User;
import com.smarthousingsystem.rent.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public User register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!password.equals(user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        return user;
    }

    public void forgotPassword(String email) {
        // Mocked or removed
        System.out.println("Forgot password for " + email);
    }

    public void resetPassword(String token, String newPassword) {
        // Mocked or removed
    }
}
