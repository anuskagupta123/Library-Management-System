package com.anuska.library.libraryms.controller;

import com.anuska.library.libraryms.model.Book;
import com.anuska.library.libraryms.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@Tag(name = "Books", description = "Book management endpoints")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    @Operation(summary = "Get all books", description = "Retrieve a list of all books in the library")
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/{id:\\d+}")
    @Operation(summary = "Get book by ID", description = "Retrieve a specific book by its ID")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @GetMapping("/search/title")
    @Operation(summary = "Search books by title", description = "Search books by partial title match")
    public ResponseEntity<List<Book>> searchByTitle(@RequestParam String title) {
        return ResponseEntity.ok(bookService.searchByTitle(title));
    }

    @GetMapping("/search/author")
    @Operation(summary = "Search books by author", description = "Search books by author name")
    public ResponseEntity<List<Book>> searchByAuthor(@RequestParam String author) {
        return ResponseEntity.ok(bookService.searchByAuthor(author));
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter books", description = "Filter books by title, author, availability, and category")
    public ResponseEntity<List<Book>> filterBooks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) String category
    ) {
        return ResponseEntity.ok(bookService.filterBooks(title, author, available, category));
    }

    @GetMapping("/search/isbn")
    @Operation(summary = "Search book by ISBN", description = "Search a book by ISBN code")
    public ResponseEntity<Book> searchByIsbn(@RequestParam String isbn) {
        return ResponseEntity.ok(bookService.searchByIsbn(isbn));
    }

    @GetMapping("/my")
    @Operation(summary = "Get my borrowed books", description = "Retrieve books currently issued to the authenticated user")
    public ResponseEntity<List<Book>> myBooks(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(bookService.myBooks(user.getUsername()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a new book", description = "Add a new book to the library (Admin only)")
    public ResponseEntity<Book> addBook(@Valid @RequestBody Book book) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.saveBook(book));
    }

    @PutMapping("/{id:\\d+}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a book", description = "Update book details (Admin only)")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @Valid @RequestBody Book book) {
        return ResponseEntity.ok(bookService.updateBook(id, book));
    }

    @DeleteMapping("/{id:\\d+}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a book", description = "Delete a book from the library (Admin only)")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id:\\d+}/borrow")
    @Operation(summary = "Borrow a book", description = "Issue/borrow a book to the authenticated user")
    public ResponseEntity<Book> borrow(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user
    ) {
        return ResponseEntity.ok(bookService.borrowBook(id, user.getUsername()));
    }

    @PutMapping("/{id:\\d+}/return")
    @Operation(summary = "Return a book", description = "Return a borrowed book to the library")
    public ResponseEntity<Book> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.returnBook(id));
    }

    @GetMapping("/{id:\\d+}/fine")
    @Operation(summary = "Calculate fine for overdue book", description = "Calculate the fine amount for overdue books")
    public ResponseEntity<Double> calculateFine(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.calculateFine(id));
    }
}
