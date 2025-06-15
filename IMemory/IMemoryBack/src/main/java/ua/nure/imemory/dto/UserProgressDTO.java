package ua.nure.imemory.dto;

import java.time.LocalDateTime;

public class UserProgressDTO {
    private Long exerciseId;
    private String exerciseTitle;
    private int score;
    private LocalDateTime completedAt;

    public UserProgressDTO(Long exerciseId, String exerciseTitle, int score, LocalDateTime completedAt) {
        this.exerciseId = exerciseId;
        this.exerciseTitle = exerciseTitle;
        this.score = score;
        this.completedAt = completedAt;
    }

    public Long getExerciseId() {
        return exerciseId;
    }

    public String getExerciseTitle() {
        return exerciseTitle;
    }

    public int getScore() {
        return score;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

}

