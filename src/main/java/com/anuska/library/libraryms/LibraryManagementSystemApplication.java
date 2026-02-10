package com.anuska.library.libraryms;

import com.anuska.library.libraryms.model.Role;
import com.anuska.library.libraryms.model.User;
import com.anuska.library.libraryms.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class LibraryManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(LibraryManagementSystemApplication.class, args);
    }

    @Bean
    CommandLineRunner createAdmin(UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {
            if (userRepository.findByUsername("Anuska").isEmpty()) {
                User user = new User();
                user.setUsername("Anuska");
                user.setPassword(encoder.encode("admin123"));
                user.setRole("ADMIN");
                user.setEnabled(true);
                userRepository.save(user);
            }
        };
    }
}