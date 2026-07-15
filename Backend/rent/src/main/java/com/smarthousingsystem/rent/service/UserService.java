package com.smarthousingsystem.rent.service;

import com.smarthousingsystem.rent.model.User;
import com.smarthousingsystem.rent.repository.UserRepository;
import com.smarthousingsystem.rent.repository.PropertyRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PropertyService propertyService;
    private final PropertyRequestRepository propertyRequestRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(String role) {
        try {
            User.Role enumRole = User.Role.valueOf(role.toUpperCase());
            return userRepository.findByRole(enumRole);
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User registerUser(User user) {
        if (user.getEmail() == null || user.getPassword() == null) {
            throw new IllegalArgumentException("Email and password are required");
        }
        return userRepository.save(user);
    }

    public Optional<User> login(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> password.equals(user.getPassword()));
    }

    public User updateUser(Long id, User user) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhone(user.getPhone());
        if (user.getPassword() != null && !user.getPassword().trim().isEmpty()) {
            existingUser.setPassword(user.getPassword());
        }
        existingUser.setRole(user.getRole());
        return userRepository.save(existingUser);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == User.Role.TENANT) {
            var requests = propertyRequestRepository.findByTenant(user);
            propertyRequestRepository.deleteAll(requests);
        } else if (user.getRole() == User.Role.LANDLORD) {
            var properties = propertyService.getPropertiesByLandlord(user.getUserId());
            for (var prop : properties) {
                propertyService.deleteProperty(prop.getPropertyId());
            }
        }
        
        userRepository.delete(user);
    }
}
