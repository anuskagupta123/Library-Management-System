package com.anuska.library.libraryms.repository;

import com.anuska.library.libraryms.model.BorrowActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BorrowActivityRepository extends JpaRepository<BorrowActivity, Long> {

    List<BorrowActivity> findTop20ByOrderByTimestampDesc();

    List<BorrowActivity> findByActionAndTimestampAfterOrderByTimestampAsc(String action, LocalDateTime since);
}
