package ua.nure.imemory.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.imemory.models.Exercise;

public interface ExerciseRepo extends JpaRepository<Exercise, Long> {
}

