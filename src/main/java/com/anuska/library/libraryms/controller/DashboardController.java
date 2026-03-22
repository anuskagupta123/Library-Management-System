package com.anuska.library.libraryms.controller;

import com.anuska.library.libraryms.model.Book;
import com.anuska.library.libraryms.model.BorrowActivity;
import com.anuska.library.libraryms.service.BookService;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Long> adminStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", bookService.totalBooks());
        stats.put("available", bookService.availableBooks());
        stats.put("issued", bookService.issuedBooks());
        stats.put("overdue", (long) bookService.getOverdueBooks().size());
        return stats;
    }

    @GetMapping("/admin/borrow-trend")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String, Object>> borrowTrend() {
        return bookService.getBorrowTrendLastDays(7);
    }

    @GetMapping("/admin/recent-activity")
    @PreAuthorize("hasRole('ADMIN')")
    public List<BorrowActivity> recentActivity() {
        return bookService.getRecentActivities(8);
    }

    @GetMapping("/admin/overdue")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Book> overdueBooks() {
        return bookService.getOverdueBooks();
    }

    // USER books
    @GetMapping("/my-books")
    public List<Book> myBooks(
            @AuthenticationPrincipal UserDetails user
    ) {
        return bookService.myBooks(user.getUsername());
    }
}
