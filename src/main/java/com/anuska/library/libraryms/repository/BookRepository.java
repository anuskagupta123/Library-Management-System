package com.anuska.library.libraryms.repository;

import com.anuska.library.libraryms.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    long countByAvailableTrue();

    long countByAvailableFalse();

    List<Book> findByIssuedTo(String username);
}
