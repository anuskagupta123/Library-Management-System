package com.anuska.library.libraryms.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class BookSchemaInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(BookSchemaInitializer.class);

    private final JdbcTemplate jdbcTemplate;

    public BookSchemaInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            jdbcTemplate.execute("ALTER TABLE book ADD COLUMN IF NOT EXISTS category VARCHAR(100)");
        } catch (Exception ex) {
            log.debug("Skipping category column add: {}", ex.getMessage());
        }

        try {
            jdbcTemplate.execute("ALTER TABLE book ALTER COLUMN category TYPE VARCHAR(100) USING category::VARCHAR");
        } catch (Exception ex) {
            log.debug("Skipping category type normalization: {}", ex.getMessage());
        }
    }
}
