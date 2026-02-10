package com.anuska.library.libraryms.controller;

import com.anuska.library.libraryms.model.Book;
import com.anuska.library.libraryms.service.BookService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final BookService bookService;

    public DashboardController(BookService bookService) {
        this.bookService = bookService;
    }

    // ADMIN stats
    @GetMapping("/admin")
    public Map<String, Long> adminStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", bookService.totalBooks());
        stats.put("available", bookService.availableBooks());
        stats.put("issued", bookService.issuedBooks());
        return stats;
    }

    // USER books
    @GetMapping("/my-books")
    public List<Book> myBooks(
            @AuthenticationPrincipal UserDetails user
    ) {
        return bookService.myBooks(user.getUsername());
    }
}
