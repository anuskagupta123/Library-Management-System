package com.anuska.library.libraryms.service;

import com.anuska.library.libraryms.exception.BadRequestException;
import com.anuska.library.libraryms.dto.LoginRequest;
import com.anuska.library.libraryms.dto.LoginResponse;
import com.anuska.library.libraryms.model.User;
import com.anuska.library.libraryms.repository.UserRepository;
import com.anuska.library.libraryms.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(
            user.getUsername(),
            user.getRole()   // ADMIN / USER
        );

        return new LoginResponse(token, user.getRole());
    }
}