package com.anuska.library.libraryms.service;

import com.anuska.library.libraryms.exception.BadRequestException;
import com.anuska.library.libraryms.exception.ResourceNotFoundException;
import com.anuska.library.libraryms.dto.UserSummaryResponse;
import com.anuska.library.libraryms.dto.RegisterRequest;
import com.anuska.library.libraryms.model.Role;
import com.anuska.library.libraryms.model.User;
import com.anuska.library.libraryms.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void register(RegisterRequest request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new BadRequestException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setEnabled(true);
        userRepository.save(user);
    }

    public List<UserSummaryResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toSummary)
                .toList();
    }

    public UserSummaryResponse updateRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        String normalizedRole = role == null ? "" : role.trim().toUpperCase();
        try {
            Role.valueOf(normalizedRole);
        } catch (Exception ex) {
            throw new BadRequestException("Role must be USER or ADMIN");
        }

        user.setRole(normalizedRole);
        return toSummary(userRepository.save(user));
    }

    public UserSummaryResponse updateEnabled(Long id, boolean enabled) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        user.setEnabled(enabled);
        return toSummary(userRepository.save(user));
    }

    public void deleteUser(Long id, String currentUsername) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        if (user.getUsername().equals(currentUsername)) {
            throw new BadRequestException("You cannot delete your own account");
        }

        userRepository.deleteById(id);
    }

    private UserSummaryResponse toSummary(User user) {
        return new UserSummaryResponse(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                user.isEnabled()
        );
    }
}
