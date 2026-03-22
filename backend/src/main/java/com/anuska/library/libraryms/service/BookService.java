package com.anuska.library.libraryms.service;

import com.anuska.library.libraryms.exception.BadRequestException;
import com.anuska.library.libraryms.exception.ResourceNotFoundException;
import com.anuska.library.libraryms.model.Book;
import com.anuska.library.libraryms.model.BorrowActivity;
import com.anuska.library.libraryms.repository.BorrowActivityRepository;
import com.anuska.library.libraryms.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository repo;
    private final BorrowActivityRepository activityRepository;
    private static final int BORROW_DAYS = 5;
    private static final double FINE_PER_DAY = 1.0;

    public BookService(BookRepository repo, BorrowActivityRepository activityRepository) {
        this.repo = repo;
        this.activityRepository = activityRepository;
    }

    public List<Book> getAllBooks() {
        List<Book> books = repo.findAll();
        books.forEach(this::enrichLiveFine);
        return books;
    }

    public Book getBookById(Long id) {
        Book book = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + id));
        enrichLiveFine(book);
        return book;
    }

    public List<Book> searchByTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new BadRequestException("Title cannot be empty");
        }
        List<Book> books = repo.searchByTitle(title);
        books.forEach(this::enrichLiveFine);
        return books;
    }

    public List<Book> searchByAuthor(String author) {
        if (author == null || author.trim().isEmpty()) {
            throw new BadRequestException("Author cannot be empty");
        }
        List<Book> books = repo.searchByAuthor(author);
        books.forEach(this::enrichLiveFine);
        return books;
    }

    public List<Book> filterBooks(String title, String author, Boolean available, String category) {
        String safeTitle = normalizeFilter(title);
        String safeAuthor = normalizeFilter(author);
        String safeCategory = normalizeFilter(category);

        List<Book> books = getAllBooks();

        if (safeTitle != null) {
            books = books.stream()
                    .filter(book -> book.getTitle() != null)
                    .filter(book -> book.getTitle().toLowerCase().contains(safeTitle.toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (safeAuthor != null) {
            books = books.stream()
                    .filter(book -> book.getAuthor() != null)
                    .filter(book -> book.getAuthor().toLowerCase().contains(safeAuthor.toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (available != null) {
            books = books.stream()
                    .filter(book -> book.isAvailable() == available)
                    .collect(Collectors.toList());
        }

        if (safeCategory != null) {
            books = books.stream()
                    .filter(book -> book.getCategory() != null)
                    .filter(book -> safeCategory.equalsIgnoreCase(book.getCategory().trim()))
                    .collect(Collectors.toList());
        }

        books.forEach(this::enrichLiveFine);
        return books;
    }

    public Book searchByIsbn(String isbn) {
        if (isbn == null || isbn.trim().isEmpty()) {
            throw new BadRequestException("ISBN cannot be empty");
        }
        Book book = repo.findByIsbn(isbn)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ISBN: " + isbn));
        enrichLiveFine(book);
        return book;
    }

    public Book saveBook(Book book) {
        if (book.getTitle() == null || book.getTitle().trim().isEmpty()) {
            throw new BadRequestException("Book title is required");
        }
        if (book.getAuthor() == null || book.getAuthor().trim().isEmpty()) {
            throw new BadRequestException("Book author is required");
        }
        if (book.getIsbn() == null || book.getIsbn().trim().isEmpty()) {
            throw new BadRequestException("Book ISBN is required");
        }
        return repo.save(book);
    }

    public Book updateBook(Long id, Book bookDetails) {
        Book book = getBookById(id);
        
        if (bookDetails.getTitle() != null && !bookDetails.getTitle().trim().isEmpty()) {
            book.setTitle(bookDetails.getTitle());
        }
        if (bookDetails.getAuthor() != null && !bookDetails.getAuthor().trim().isEmpty()) {
            book.setAuthor(bookDetails.getAuthor());
        }
        if (bookDetails.getIsbn() != null && !bookDetails.getIsbn().trim().isEmpty()) {
            book.setIsbn(bookDetails.getIsbn());
        }
        if (bookDetails.getCategory() != null && !bookDetails.getCategory().trim().isEmpty()) {
            book.setCategory(bookDetails.getCategory());
        }
        if (bookDetails.getImageUrl() != null && !bookDetails.getImageUrl().trim().isEmpty()) {
            book.setImageUrl(bookDetails.getImageUrl());
        }
        
        return repo.save(book);
    }

    public void deleteBook(Long id) {
        Book book = getBookById(id);

        if (!book.isAvailable()) {
            throw new BadRequestException("Cannot delete a book that is currently issued");
        }

        repo.deleteById(id);
    }

    public Book borrowBook(Long id, String username) {
        Book book = getBookById(id);

        if (!book.isAvailable()) {
            throw new BadRequestException("Book is already issued to another user");
        }

        book.setAvailable(false);
        book.setIssuedTo(username);
        book.setDueDate(LocalDateTime.now().plusDays(BORROW_DAYS));
        book.setFineAmount(0.0); 
        Book saved = repo.save(book);
        logActivity(username, saved.getTitle(), "BORROW");
        return saved;
    }

    public Book returnBook(Long id) {
        Book book = getBookById(id);

        if (book.isAvailable()) {
            throw new BadRequestException("Book is not issued and cannot be returned");
        }

        // Calculate fine if overdue
        double fine = calculateFine(id);
        book.setFineAmount(fine);

        String issuedUser = book.getIssuedTo();

        book.setAvailable(true);
        book.setIssuedTo(null);
        book.setDueDate(null);

        Book saved = repo.save(book);
        if (issuedUser != null && !issuedUser.isBlank()) {
            logActivity(issuedUser, saved.getTitle(), "RETURN");
        }
        return saved;
    }

    public double calculateFine(Long id) {
        Book book = getBookById(id);

        if (book.isAvailable() || book.getDueDate() == null) {
            return 0;
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(book.getDueDate())) {
            return 0; // No fine if returned before due date
        }

        long daysOverdue = ChronoUnit.DAYS.between(book.getDueDate(), now);
        return daysOverdue * FINE_PER_DAY;
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
        List<Book> books = repo.findByIssuedTo(username);
        books.forEach(this::enrichLiveFine);
        return books;
    }

    public List<Book> getOverdueBooks() {
        List<Book> books = repo.findByAvailableFalseAndDueDateBeforeOrderByDueDateAsc(LocalDateTime.now());
        books.forEach(this::enrichLiveFine);
        return books;
    }

    public List<BorrowActivity> getRecentActivities(int limit) {
        List<BorrowActivity> activities = activityRepository.findTop20ByOrderByTimestampDesc();
        if (limit <= 0 || activities.size() <= limit) {
            return activities;
        }
        return activities.subList(0, limit);
    }

    public List<Map<String, Object>> getBorrowTrendLastDays(int days) {
        int safeDays = days <= 0 ? 7 : days;
        LocalDate startDate = LocalDate.now().minusDays(safeDays - 1L);
        LocalDateTime startDateTime = startDate.atStartOfDay();

        Map<String, Integer> counts = new LinkedHashMap<>();
        for (int i = 0; i < safeDays; i++) {
            LocalDate date = startDate.plusDays(i);
            counts.put(date.toString(), 0);
        }

        List<BorrowActivity> activities = activityRepository
                .findByActionAndTimestampAfterOrderByTimestampAsc("BORROW", startDateTime);

        for (BorrowActivity activity : activities) {
            String day = activity.getTimestamp().toLocalDate().toString();
            if (counts.containsKey(day)) {
                counts.put(day, counts.get(day) + 1);
            }
        }

        List<Map<String, Object>> trend = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : counts.entrySet()) {
            Map<String, Object> point = new LinkedHashMap<>();
            point.put("date", entry.getKey());
            point.put("count", entry.getValue());
            trend.add(point);
        }
        return trend;
    }

    private void enrichLiveFine(Book book) {
        if (book == null) {
            return;
        }

        if (book.isAvailable() || book.getDueDate() == null) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(book.getDueDate())) {
            book.setFineAmount(0.0);
            return;
        }

        long daysOverdue = ChronoUnit.DAYS.between(book.getDueDate(), now);
        book.setFineAmount(daysOverdue * FINE_PER_DAY);
    }

    private String normalizeFilter(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return value.trim();
    }

    private void logActivity(String username, String bookTitle, String action) {
        BorrowActivity activity = new BorrowActivity();
        activity.setUsername(username);
        activity.setBookTitle(bookTitle == null ? "Unknown Book" : bookTitle);
        activity.setAction(action);
        activity.setTimestamp(LocalDateTime.now());
        activityRepository.save(activity);
    }
}
