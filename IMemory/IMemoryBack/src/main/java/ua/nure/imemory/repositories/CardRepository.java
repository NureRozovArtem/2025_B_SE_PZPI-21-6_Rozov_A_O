package ua.nure.imemory.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.imemory.models.Card;

public interface CardRepository extends JpaRepository<Card, Long> {
}
