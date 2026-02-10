package com.anuska.library.libraryms.service;

import com.anuska.library.libraryms.model.Book;
import com.anuska.library.libraryms.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository repo;

    public BookService(BookRepository repo) {
        this.repo = repo;
    }

    public List<Book> getAllBooks() {
        return repo.findAll();
    }

    public Book saveBook(Book book) {
        return repo.save(book);
    }

    public void deleteBook(Long id) {
        Book book = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (!book.isAvailable()) {
            throw new RuntimeException("Book is issued");
        }

        repo.deleteById(id);
    }

    // ✅ BORROW
    public Book borrowBook(Long id, String username) {
        Book book = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (!book.isAvailable()) {
            throw new RuntimeException("Book already issued");
        }

        book.setAvailable(false);
        book.setIssuedTo(username);

        return repo.save(book);
    }

    // ✅ RETURN
    public Book returnBook(Long id) {
        Book book = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setAvailable(true);
        book.setIssuedTo(null);

        return repo.save(book);
    }

    
    public long totalBooks() {
    return repo.count();
    }

    public long availableBooks() {
        return repo.countByAvailableTrue();
    }

    public long issuedBooks() {
        return repo.countByAvailableFalse();
    }

    public List<Book> myBooks(String username) {
        return repo.findByIssuedTo(username);
    }

}
