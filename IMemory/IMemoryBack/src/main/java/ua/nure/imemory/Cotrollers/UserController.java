package ua.nure.imemory.Cotrollers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.nure.imemory.dto.UserDTO;
import ua.nure.imemory.dto.UserProgressDTO;
import ua.nure.imemory.models.Exercise;
import ua.nure.imemory.models.Level;
import ua.nure.imemory.models.User;
import ua.nure.imemory.models.UserProgress;
import ua.nure.imemory.repositories.ExerciseRepo;
import ua.nure.imemory.repositories.LevelRepository;
import ua.nure.imemory.repositories.UserProgressRepo;
import ua.nure.imemory.repositories.UserRepository;
import ua.nure.imemory.utils.JwtUtil;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserProgressRepo progressRepo;

    @Autowired
    private ExerciseRepo exerciseRepo;

    @Autowired
    private UserProgressRepo userProgressRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private LevelRepository levelRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.extractUsername(token);

            User user = userRepo.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Користувач не знайдений");
            }

            int levelId = user.getCurrentLevel();
            int difficulty = levelRepo.findById(levelId)
                    .map(Level::getDifficulty)
                    .orElse(1);

            UserDTO userDTO = new UserDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole(),
                    levelId,
                    user.getAvatarUrl(),
                    difficulty
            );

            return ResponseEntity.ok()
                    .header("Cache-Control", "no-cache, no-store, must-revalidate")
                    .header("Pragma", "no-cache")
                    .header("Expires", "0")
                    .body(userDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Сталася помилка при отриманні користувача");
        }
    }

    @GetMapping("/progress")
    public ResponseEntity<List<Map<String, Object>>> getUserProgress(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);

        User user = userRepo.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        List<UserProgress> progressList = userProgressRepo.findByUser(user);

        List<Map<String, Object>> response = progressList.stream().map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("date", p.getCompletedAt());
            map.put("result", p.getScore());

            String title = Optional.ofNullable(p.getExercise())
                    .map(Exercise::getTitle)
                    .orElse("Невідоме завдання");

            map.put("exerciseTitle", title);
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

}

