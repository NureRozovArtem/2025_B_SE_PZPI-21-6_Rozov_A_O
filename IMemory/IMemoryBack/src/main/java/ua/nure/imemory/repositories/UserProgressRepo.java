package ua.nure.imemory.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.imemory.models.User;
import ua.nure.imemory.models.UserProgress;

import java.util.List;

public interface UserProgressRepo extends JpaRepository<UserProgress, Long> {
    List<UserProgress> findByUserId(Long userId);

    List<UserProgress> findByUser(User user);
}

