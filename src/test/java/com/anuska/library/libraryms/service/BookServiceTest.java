package com.anuska.library.libraryms.service;

import com.anuska.library.libraryms.exception.BadRequestException;
import com.anuska.library.libraryms.exception.ResourceNotFoundException;
import com.anuska.library.libraryms.model.Book;
import com.anuska.library.libraryms.repository.BookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookService bookService;

    private Book testBook;

    @BeforeEach
    public void setUp() {
        testBook = new Book();
        testBook.setId(1L);
        testBook.setTitle("Test Book");
        testBook.setAuthor("Test Author");
        testBook.setIsbn("9780123456789");
        testBook.setAvailable(true);
        testBook.setFineAmount(0.0);
    }

    @Test
    public void testGetAllBooks() {
        Book book2 = new Book();
        book2.setId(2L);
        book2.setTitle("Another Book");
        book2.setAuthor("Another Author");
        book2.setIsbn("9780987654321");

        when(bookRepository.findAll()).thenReturn(Arrays.asList(testBook, book2));

        List<Book> books = bookService.getAllBooks();

        assertEquals(2, books.size());
        verify(bookRepository, times(1)).findAll();
    }

    @Test
    public void testGetBookById_Success() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));

        Book book = bookService.getBookById(1L);

        assertNotNull(book);
        assertEquals("Test Book", book.getTitle());
        verify(bookRepository, times(1)).findById(1L);
    }

    @Test
    public void testGetBookById_NotFound() {
        when(bookRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            bookService.getBookById(999L);
        });
    }

    @Test
    public void testSearchByTitle() {
        when(bookRepository.searchByTitle("Test")).thenReturn(Arrays.asList(testBook));

        List<Book> books = bookService.searchByTitle("Test");

        assertEquals(1, books.size());
        verify(bookRepository, times(1)).searchByTitle("Test");
    }

    @Test
    public void testSearchByTitle_EmptyQuery() {
        assertThrows(BadRequestException.class, () -> {
            bookService.searchByTitle("");
        });
    }

    @Test
    public void testBorrowBook_Success() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(bookRepository.save(any(Book.class))).thenReturn(testBook);

        Book book = bookService.borrowBook(1L, "testuser");

        assertFalse(book.isAvailable());
        assertEquals("testuser", book.getIssuedTo());
        assertNotNull(book.getDueDate());
        verify(bookRepository, times(1)).save(any(Book.class));
    }

    @Test
    public void testBorrowBook_NotAvailable() {
        testBook.setAvailable(false);
        testBook.setIssuedTo("otheruser");

        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));

        assertThrows(BadRequestException.class, () -> {
            bookService.borrowBook(1L, "testuser");
        });
    }

    @Test
    public void testReturnBook_Success() {
        LocalDateTime dueDate = LocalDateTime.now().minusDays(2);
        testBook.setAvailable(false);
        testBook.setIssuedTo("testuser");
        testBook.setDueDate(dueDate);

        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(bookRepository.save(any(Book.class))).thenReturn(testBook);

        Book book = bookService.returnBook(1L);

        assertTrue(book.isAvailable());
        assertNull(book.getIssuedTo());
        assertTrue(book.getFineAmount() > 0); // Should have fine for overdue
        verify(bookRepository, times(1)).save(any(Book.class));
    }

    @Test
    public void testCalculateFine_NoFineIfOnTime() {
        LocalDateTime dueDate = LocalDateTime.now().plusDays(2);
        testBook.setAvailable(false);
        testBook.setIssuedTo("testuser");
        testBook.setDueDate(dueDate);

        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));

        double fine = bookService.calculateFine(1L);

        assertEquals(0.0, fine);
    }

    @Test
    public void testCalculateFine_WithOverduedays() {
        LocalDateTime dueDate = LocalDateTime.now().minusDays(5);
        testBook.setAvailable(false);
        testBook.setIssuedTo("testuser");
        testBook.setDueDate(dueDate);

        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));

        double fine = bookService.calculateFine(1L);

        assertTrue(fine >= 5.0); // At least 5 days fine
    }

    @Test
    public void testDeleteBook_Success() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));

        assertDoesNotThrow(() -> bookService.deleteBook(1L));
        verify(bookRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testDeleteBook_IssuedBook() {
        testBook.setAvailable(false);
        testBook.setIssuedTo("testuser");

        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));

        assertThrows(BadRequestException.class, () -> {
            bookService.deleteBook(1L);
        });
    }

    @Test
    public void testSaveBook_Success() {
        when(bookRepository.save(any(Book.class))).thenReturn(testBook);

        Book book = bookService.saveBook(testBook);

        assertNotNull(book);
        assertEquals("Test Book", book.getTitle());
        verify(bookRepository, times(1)).save(any(Book.class));
    }

    @Test
    public void testSaveBook_MissingTitle() {
        testBook.setTitle(null);

        assertThrows(BadRequestException.class, () -> {
            bookService.saveBook(testBook);
        });
    }

    @Test
    public void testTotalBooks() {
        when(bookRepository.count()).thenReturn(5L);

        long total = bookService.totalBooks();

        assertEquals(5L, total);
        verify(bookRepository, times(1)).count();
    }

    @Test
    public void testAvailableBooks() {
        when(bookRepository.countByAvailableTrue()).thenReturn(3L);

        long available = bookService.availableBooks();

        assertEquals(3L, available);
        verify(bookRepository, times(1)).countByAvailableTrue();
    }

    @Test
    public void testIssuedBooks() {
        when(bookRepository.countByAvailableFalse()).thenReturn(2L);

        long issued = bookService.issuedBooks();

        assertEquals(2L, issued);
        verify(bookRepository, times(1)).countByAvailableFalse();
    }
}
