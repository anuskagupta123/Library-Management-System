package com.anuska.library.libraryms.controller;

import com.anuska.library.libraryms.model.Book;
import com.anuska.library.libraryms.service.BookService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class BookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BookService bookService;

    @Autowired
    private ObjectMapper objectMapper;

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
    @WithMockUser
    public void testGetAllBooks() throws Exception {
        when(bookService.getAllBooks()).thenReturn(Arrays.asList(testBook));

        mockMvc.perform(get("/api/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Book"));

        verify(bookService, times(1)).getAllBooks();
    }

    @Test
    @WithMockUser
    public void testGetBookById() throws Exception {
        when(bookService.getBookById(1L)).thenReturn(testBook);

        mockMvc.perform(get("/api/books/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Book"));

        verify(bookService, times(1)).getBookById(1L);
    }

    @Test
    @WithMockUser
    public void testSearchByTitle() throws Exception {
        when(bookService.searchByTitle("Test")).thenReturn(Arrays.asList(testBook));

        mockMvc.perform(get("/api/books/search/title?title=Test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Book"));

        verify(bookService, times(1)).searchByTitle("Test");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testAddBook() throws Exception {
        when(bookService.saveBook(any(Book.class))).thenReturn(testBook);

        mockMvc.perform(post("/api/books")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(testBook)))
                .andExpect(status().isCreated());

        verify(bookService, times(1)).saveBook(any(Book.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testUpdateBook() throws Exception {
        when(bookService.updateBook(eq(1L), any(Book.class))).thenReturn(testBook);

        mockMvc.perform(put("/api/books/1")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(testBook)))
                .andExpect(status().isOk());

        verify(bookService, times(1)).updateBook(eq(1L), any(Book.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testDeleteBook() throws Exception {
        doNothing().when(bookService).deleteBook(1L);

        mockMvc.perform(delete("/api/books/1"))
                .andExpect(status().isNoContent());

        verify(bookService, times(1)).deleteBook(1L);
    }

    @Test
    @WithMockUser
    public void testBorrowBook() throws Exception {
        testBook.setAvailable(false);
        testBook.setIssuedTo("user");
        testBook.setDueDate(java.time.LocalDateTime.now().plusDays(5));

        when(bookService.borrowBook(eq(1L), any(String.class))).thenReturn(testBook);

        mockMvc.perform(put("/api/books/1/borrow"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(bookService, times(1)).borrowBook(eq(1L), any(String.class));
    }

    @Test
    @WithMockUser
    public void testReturnBook() throws Exception {
        when(bookService.returnBook(1L)).thenReturn(testBook);

        mockMvc.perform(put("/api/books/1/return"))
                .andExpect(status().isOk());

        verify(bookService, times(1)).returnBook(1L);
    }

    @Test
    @WithMockUser
    public void testCalculateFine() throws Exception {
        when(bookService.calculateFine(1L)).thenReturn(5.0);

        mockMvc.perform(get("/api/books/1/fine"))
                .andExpect(status().isOk())
                .andExpect(content().string("5.0"));

        verify(bookService, times(1)).calculateFine(1L);
    }

    @Test
    public void testAddBook_Unauthorized() throws Exception {
        mockMvc.perform(post("/api/books")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(testBook)))
                .andExpect(status().isForbidden());
    }
}
