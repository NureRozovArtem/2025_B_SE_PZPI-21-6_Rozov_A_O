package ua.nure.imemory.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.imemory.models.Level;

import java.util.Optional;

public interface LevelRepository extends JpaRepository<Level, Integer> {
    Optional<Level> findByDifficulty(int difficulty);
}
