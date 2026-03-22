package com.anuska.library.libraryms.controller;

import com.anuska.library.libraryms.dto.UserSummaryResponse;
import com.anuska.library.libraryms.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserSummaryResponse> getUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{id}/role")
    public UserSummaryResponse updateRole(@PathVariable Long id, @RequestParam String role) {
        return userService.updateRole(id, role);
    }

    @PutMapping("/{id}/enabled")
    public UserSummaryResponse updateEnabled(@PathVariable Long id, @RequestParam boolean enabled) {
        return userService.updateEnabled(id, enabled);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id, @AuthenticationPrincipal UserDetails user) {
        userService.deleteUser(id, user.getUsername());
    }
}
