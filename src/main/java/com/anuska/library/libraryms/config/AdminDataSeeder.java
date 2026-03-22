package com.anuska.library.libraryms.config;

import com.anuska.library.libraryms.model.User;
import com.anuska.library.libraryms.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * AdminDataSeeder initializes demo admin accounts on application startup.
 * This ensures a known admin login is always available for demos and interviews.
 * 
 * Demo Credentials:
 * - Username: admin
 *   Password: admin123
 * - Username: demoAdmin
 *   Password: demo123
 * 
 * For production deployments, disable this or ensure these credentials are changed immediately.
 */
@Component
public class AdminDataSeeder implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminDataSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminDataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            // Create primary demo admin account
            createAdminUserIfNotExists("admin", "admin123", "Primary Demo Admin Account");
            
            // Create secondary demo admin account (for interview scenarios)
            createAdminUserIfNotExists("demoAdmin", "demo123", "Secondary Demo Admin Account");
            
            logger.info("========================================");
            logger.info("DEMO ADMIN ACCOUNTS INITIALIZED");
            logger.info("========================================");
            logger.info("Available Admin Logins:");
            logger.info("  - Username: admin");
            logger.info("    Password: admin123");
            logger.info("  - Username: demoAdmin");
            logger.info("    Password: demo123");
            logger.info("========================================");
            logger.info("NOTE: Change these credentials in production!");
            logger.info("========================================");
        } catch (Exception ex) {
            logger.error("Error during admin data seeding - application will continue without admin accounts", ex);
        }
    }

    /**
     * Creates an admin user if it doesn't already exist in the database.
     * 
     * @param username the username of the admin account
     * @param password the plain text password (will be hashed using BCrypt)
     * @param description a description of the account for logging
     */
    private void createAdminUserIfNotExists(String username, String password, String description) {
        try {
            if (userRepository.findByUsername(username).isEmpty()) {
                User adminUser = new User();
                adminUser.setUsername(username);
                adminUser.setPassword(passwordEncoder.encode(password));
                adminUser.setRole("ADMIN");
                adminUser.setEnabled(true);
                
                userRepository.save(adminUser);
                logger.debug("Created admin user: {} ({})", username, description);
            } else {
                logger.debug("Admin user already exists: {}", username);
            }
        } catch (Exception ex) {
            logger.warn("Failed to create admin user '{}': {}", username, ex.getMessage());
        }
    }
}
