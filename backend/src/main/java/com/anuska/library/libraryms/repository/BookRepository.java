package com.anuska.library.libraryms.repository;

import com.anuska.library.libraryms.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    long countByAvailableTrue();

    long countByAvailableFalse();

    List<Book> findByIssuedTo(String username);

    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Book> searchByTitle(@Param("title") String title);

    @Query("SELECT b FROM Book b WHERE LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%'))")
    List<Book> searchByAuthor(@Param("author") String author);

    Optional<Book> findByIsbn(String isbn);

    @Query("SELECT b.isbn FROM Book b")
    List<String> findAllIsbns();

    List<Book> findByAvailableFalseAndDueDateBeforeOrderByDueDateAsc(LocalDateTime now);
}
