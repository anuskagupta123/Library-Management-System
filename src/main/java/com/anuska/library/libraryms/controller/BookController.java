package com.anuska.library.libraryms.controller;

import com.anuska.library.libraryms.model.Book;
import com.anuska.library.libraryms.service.BookService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @PostMapping
    public Book addBook(@RequestBody Book book) {
        return bookService.saveBook(book);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }

    // 🔹 BORROW
    @PutMapping("/{id}/borrow")
    public Book borrow(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user
    ) {
        return bookService.borrowBook(id, user.getUsername());
    }

    // 🔹 RETURN
    @PutMapping("/{id}/return")
    public Book returnBook(@PathVariable Long id) {
        return bookService.returnBook(id);
    }
}
