package ua.nure.imemory.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.nure.imemory.dto.GameResultRequest;
import ua.nure.imemory.dto.TopPlayerDto;
import ua.nure.imemory.models.Exercise;
import ua.nure.imemory.models.Level;
import ua.nure.imemory.models.User;
import ua.nure.imemory.models.UserProgress;
import ua.nure.imemory.repositories.ExerciseRepo;
import ua.nure.imemory.repositories.LevelRepository;
import ua.nure.imemory.repositories.UserProgressRepo;
import ua.nure.imemory.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameService {

    private final UserRepository userRepository;
    private final ExerciseRepo exerciseRepository;
    private final UserProgressRepo userProgressRepository;
    private final LevelRepository levelRepository;

    //TODO
    //Перенести в бд
    //Додати більше слів
    private static final List<String> UKR_WORDS = List.of(
            "дерево", "книга", "море", "сонце", "стіл", "вікно", "хата", "ріка", "місто", "друг",
            "птах", "гора", "ніч", "дощ", "квітка", "сніг", "вогонь", "земля", "вода", "вітряк"
    );

    @Autowired
    public GameService(UserRepository userRepository,
                       ExerciseRepo exerciseRepository,
                       UserProgressRepo userProgressRepository,
                       LevelRepository levelRepository) {
        this.userRepository = userRepository;
        this.exerciseRepository = exerciseRepository;
        this.userProgressRepository = userProgressRepository;
        this.levelRepository = levelRepository;
    }

    public int getUserLevel(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        Integer levelId = user.getCurrentLevel();
        Level level = levelRepository.findById(levelId)
                .orElseThrow(() -> new RuntimeException("Level not found with id: " + levelId));

        return level.getDifficulty();
    }

    public List<TopPlayerDto> getTopPlayers() {
        List<User> users = userRepository.findAll();

        return users.stream().map(user -> {
                    List<UserProgress> progresses = userProgressRepository.findByUserId(user.getId());
                    Map<Long, Integer> bestByExercise = new HashMap<>();

                    for (UserProgress p : progresses) {
                        long exerciseId = p.getExercise().getId();
                        int result = p.getScore();
                        bestByExercise.merge(exerciseId, result, Math::max);
                    }

                    int totalScore = 0;
                    for (long id = 1; id <= 3; id++) {
                        totalScore += bestByExercise.getOrDefault(id, 0);
                    }

                    return new TopPlayerDto(user.getUsername(), totalScore);
                })
                .sorted(Comparator.comparingInt(TopPlayerDto::getTotalScore).reversed())
                .limit(10)
                .collect(Collectors.toList());
    }

    public void processGameResult(GameResultRequest request) {
        Optional<User> userOpt = userRepository.findById(request.getUserId());
        if (userOpt.isEmpty()) return;

        User user = userOpt.get();

        Integer levelId = user.getCurrentLevel();
        Level currentLevel = levelRepository.findById(levelId)
                .orElseThrow(() -> new RuntimeException("Level not found with id: " + levelId));
        int difficulty = currentLevel.getDifficulty();

        double percentage = (double) request.getCorrectAnswers() / request.getTotalQuestions();

        if (percentage < 0.6 && difficulty > 1) {
            levelRepository.findByDifficulty(difficulty - 1).ifPresent(newLevel -> {
                user.setCurrentLevel(newLevel.getId());
            });
        } else if (percentage == 1.0 && difficulty < 3) {
            levelRepository.findByDifficulty(difficulty + 1).ifPresent(newLevel -> {
                user.setCurrentLevel(newLevel.getId());
            });
        }

        userRepository.save(user);

        Exercise exercise = exerciseRepository.findById(request.getExerciseId())
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        UserProgress progress = new UserProgress();
        progress.setUser(user);
        progress.setExercise(exercise);
        progress.setScore(request.getCorrectAnswers());
        progress.setCompletedAt(LocalDateTime.now());

        userProgressRepository.save(progress);
    }

    public List<String> getRandomWords(int count) {
        List<String> mutableWords = new ArrayList<>(UKR_WORDS);
        Collections.shuffle(mutableWords);
        if (count > mutableWords.size()) count = mutableWords.size();
        return mutableWords.subList(0, count);
    }

}
