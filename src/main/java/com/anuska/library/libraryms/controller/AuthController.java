package com.anuska.library.libraryms.controller;

import com.anuska.library.libraryms.dto.LoginRequest;
import com.anuska.library.libraryms.dto.LoginResponse;
import com.anuska.library.libraryms.dto.RegisterRequest;
import com.anuska.library.libraryms.service.AuthService;
import com.anuska.library.libraryms.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        userService.register(request);
        return ResponseEntity.ok("User registered successfully");
    }
}
