package com.anuska.library.libraryms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LibraryManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(LibraryManagementSystemApplication.class, args);
    }

    // Admin data seeding is now handled by AdminDataSeeder component
    // See: com.anuska.library.libraryms.config.AdminDataSeeder
}
