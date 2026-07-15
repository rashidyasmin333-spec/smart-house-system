package com.smarthousingsystem.rent.service;

import com.smarthousingsystem.rent.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    void registerAndLoginUserFlow() {
        User user = new User();
        user.setName("Alice");
        user.setEmail("alice@example.com");
        user.setPassword("secret123");
        user.setRole(User.Role.TENANT);

        User registered = userService.registerUser(user);
        assertNotNull(registered.getUserId());

        Optional<User> loggedIn = userService.login("alice@example.com", "secret123");
        assertTrue(loggedIn.isPresent());
    }
}
