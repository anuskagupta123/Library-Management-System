package com.anuska.library.libraryms.config;

import com.anuska.library.libraryms.model.Book;
import com.anuska.library.libraryms.repository.BookRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Seeds sample books when the catalog is empty.
 * This keeps the app usable even when SQL init scripts are not executed.
 */
@Component
public class BookDataSeeder implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(BookDataSeeder.class);
    private static final int MIN_BOOK_COUNT = 60;

    private final BookRepository bookRepository;

    public BookDataSeeder(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            long beforeCount = bookRepository.count();
            List<Book> missingBooks = new ArrayList<>();

            for (Book book : sampleCatalog()) {
                if (bookRepository.findByIsbn(book.getIsbn()).isEmpty()) {
                    missingBooks.add(book);
                }
            }

            if (!missingBooks.isEmpty()) {
                bookRepository.saveAll(missingBooks);
            }

            long afterCount = bookRepository.count();
            logger.info("Book seeding complete. Added {} books. Catalog size: {}", missingBooks.size(), afterCount);

            if (afterCount < MIN_BOOK_COUNT) {
                logger.warn("Catalog has {} books which is below target minimum {}", afterCount, MIN_BOOK_COUNT);
            }

            if (beforeCount > 0 && missingBooks.isEmpty()) {
                logger.info("Book catalog already had all seeded entries. No changes needed.");
            }
        } catch (Exception ex) {
            logger.error("Error while seeding sample books", ex);
        }
    }

    private List<Book> sampleCatalog() {
        return Arrays.asList(
                book("The Great Gatsby", "F. Scott Fitzgerald", "9780743273565", "Fiction", cover("9780743273565")),
                book("To Kill a Mockingbird", "Harper Lee", "9780061120084", "Fiction", cover("9780061120084")),
                book("1984", "George Orwell", "9780451524935", "Science Fiction", cover("9780451524935")),
                book("The Catcher in the Rye", "J.D. Salinger", "9780316769174", "Fiction", cover("9780316769174")),
                book("Pride and Prejudice", "Jane Austen", "9780141439518", "Fiction", cover("9780141439518")),
                book("Moby-Dick", "Herman Melville", "9780142437247", "Fiction", cover("9780142437247")),
                book("The Lord of the Rings", "J.R.R. Tolkien", "9780544003415", "Fantasy", cover("9780544003415")),
                book("Harry Potter and the Sorcerer Stone", "J.K. Rowling", "9780439708180", "Fantasy", cover("9780439708180")),
                book("The Hobbit", "J.R.R. Tolkien", "9780547928227", "Fantasy", cover("9780547928227")),
                book("Dune", "Frank Herbert", "9780441013593", "Science Fiction", cover("9780441013593")),
                book("Brave New World", "Aldous Huxley", "9780060850521", "Science Fiction", cover("9780060850521")),
                book("Fahrenheit 451", "Ray Bradbury", "9781451673317", "Science Fiction", cover("9781451673317")),
                book("The Odyssey", "Homer", "9780140268867", "History", cover("9780140268867")),
                book("The Iliad", "Homer", "9780140275366", "History", cover("9780140275366")),
                book("Crime and Punishment", "Fyodor Dostoevsky", "9780143058144", "Fiction", cover("9780143058144")),
                book("War and Peace", "Leo Tolstoy", "9780199232765", "History", cover("9780199232765")),
                book("Anna Karenina", "Leo Tolstoy", "9780143035008", "Fiction", cover("9780143035008")),
                book("The Brothers Karamazov", "Fyodor Dostoevsky", "9780374528379", "Fiction", cover("9780374528379")),
                book("Les Miserables", "Victor Hugo", "9780451419439", "History", cover("9780451419439")),
                book("Don Quixote", "Miguel de Cervantes", "9780060934347", "Fiction", cover("9780060934347")),
                book("The Divine Comedy", "Dante Alighieri", "9780140448955", "History", cover("9780140448955")),
                book("A Tale of Two Cities", "Charles Dickens", "9780486406510", "History", cover("9780486406510")),
                book("Great Expectations", "Charles Dickens", "9780141439563", "Fiction", cover("9780141439563")),
                book("The Picture of Dorian Gray", "Oscar Wilde", "9780141439570", "Fiction", cover("9780141439570")),
                book("Dracula", "Bram Stoker", "9780141439846", "Fiction", cover("9780141439846")),
                book("Frankenstein", "Mary Shelley", "9780143131847", "Science Fiction", cover("9780143131847")),
                book("The Time Machine", "H.G. Wells", "9780553213515", "Science Fiction", cover("9780553213515")),
                book("The Invisible Man", "H.G. Wells", "9780553213539", "Science Fiction", cover("9780553213539")),
                book("The War of the Worlds", "H.G. Wells", "9780553213386", "Science Fiction", cover("9780553213386")),
                book("The Alchemist", "Paulo Coelho", "9780062315007", "Fiction", cover("9780062315007")),
                book("The Kite Runner", "Khaled Hosseini", "9781594631931", "Fiction", cover("9781594631931")),
                book("A Thousand Splendid Suns", "Khaled Hosseini", "9781594483851", "Fiction", cover("9781594483851")),
                book("The Book Thief", "Markus Zusak", "9780375842207", "History", cover("9780375842207")),
                book("The Help", "Kathryn Stockett", "9780399155345", "Fiction", cover("9780399155345")),
                book("Gone Girl", "Gillian Flynn", "9780307588371", "Fiction", cover("9780307588371")),
                book("The Girl on the Train", "Paula Hawkins", "9781594634024", "Fiction", cover("9781594634024")),
                book("The Da Vinci Code", "Dan Brown", "9780307474278", "Fiction", cover("9780307474278")),
                book("Angels and Demons", "Dan Brown", "9780743493468", "Fiction", cover("9780743493468")),
                book("Digital Fortress", "Dan Brown", "9780312944926", "Tech", cover("9780312944926")),
                book("Clean Code", "Robert C. Martin", "9780132350884", "Tech", cover("9780132350884")),
                book("Clean Architecture", "Robert C. Martin", "9780134494166", "Tech", cover("9780134494166")),
                book("Refactoring", "Martin Fowler", "9780134757599", "Tech", cover("9780134757599")),
                book("Design Patterns", "Erich Gamma", "9780201633610", "Tech", cover("9780201633610")),
                book("Effective Java", "Joshua Bloch", "9780134685991", "Tech", cover("9780134685991")),
                book("Java Concurrency in Practice", "Brian Goetz", "9780321349606", "Tech", cover("9780321349606")),
                book("Spring in Action", "Craig Walls", "9781617297571", "Tech", cover("9781617297571")),
                book("Head First Design Patterns", "Eric Freeman", "9780596007126", "Tech", cover("9780596007126")),
                book("The Pragmatic Programmer", "Andrew Hunt", "9780135957059", "Tech", cover("9780135957059")),
                book("Code Complete", "Steve McConnell", "9780735619678", "Tech", cover("9780735619678")),
                book("Introduction to Algorithms", "Thomas H. Cormen", "9780262046305", "Tech", cover("9780262046305")),
                book("The Mythical Man-Month", "Frederick P. Brooks Jr.", "9780201835953", "Tech", cover("9780201835953")),
                book("Soft Skills", "John Sonmez", "9781617292392", "Tech", cover("9781617292392")),
                book("Deep Work", "Cal Newport", "9781455586691", "Tech", cover("9781455586691")),
                book("Atomic Habits", "James Clear", "9780735211292", "General", cover("9780735211292")),
                book("Thinking Fast and Slow", "Daniel Kahneman", "9780374533557", "General", cover("9780374533557")),
                book("Sapiens", "Yuval Noah Harari", "9780062316097", "History", cover("9780062316097")),
                book("Homo Deus", "Yuval Noah Harari", "9780062464316", "History", cover("9780062464316")),
                book("Educated", "Tara Westover", "9780399590504", "Biography", cover("9780399590504")),
                book("Becoming", "Michelle Obama", "9781524763138", "Biography", cover("9781524763138")),
                book("Steve Jobs", "Walter Isaacson", "9781451648539", "Biography", cover("9781451648539")),
                book("The Lean Startup", "Eric Ries", "9780307887894", "Business", cover("9780307887894")),
                book("Zero to One", "Peter Thiel", "9780804139298", "Business", cover("9780804139298")),
                book("Good to Great", "Jim Collins", "9780066620992", "Business", cover("9780066620992")),
                book("Thinking in Systems", "Donella H. Meadows", "9781603580557", "General", cover("9781603580557")),
                book("The Psychology of Money", "Morgan Housel", "9780857197689", "Business", cover("9780857197689")),
                book("Rich Dad Poor Dad", "Robert Kiyosaki", "9781612681139", "Business", cover("9781612681139")),
                book("The Intelligent Investor", "Benjamin Graham", "9780060555665", "Business", cover("9780060555665")),
                book("Man's Search for Meaning", "Viktor E. Frankl", "9780807014295", "General", cover("9780807014295"))
        );
    }

    private String cover(String isbn) {
        return "https://covers.openlibrary.org/b/isbn/" + isbn + "-M.jpg";
    }

    private Book book(String title, String author, String isbn, String category, String imageUrl) {
        Book book = new Book();
        book.setTitle(title);
        book.setAuthor(author);
        book.setIsbn(isbn);
        book.setCategory(category);
        book.setImageUrl(imageUrl);
        book.setAvailable(true);
        book.setFineAmount(0.0);
        return book;
    }
}
