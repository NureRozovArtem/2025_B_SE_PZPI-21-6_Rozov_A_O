package ua.nure.imemory.Cotrollers;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.nure.imemory.dto.GameResultRequest;
import ua.nure.imemory.dto.TopPlayerDto;
import ua.nure.imemory.models.Exercise;
import ua.nure.imemory.models.User;
import ua.nure.imemory.models.UserProgress;
import ua.nure.imemory.repositories.ExerciseRepo;
import ua.nure.imemory.repositories.UserProgressRepo;
import ua.nure.imemory.repositories.UserRepository;
import ua.nure.imemory.services.GameService;
import ua.nure.imemory.utils.JwtUtil;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/submit")
    public ResponseEntity<?> submitResult(@RequestBody GameResultRequest request,
                                          @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.extractUsername(token);
            User user = userRepository.findByEmail(email);

            if (user == null) {
                return ResponseEntity.status(401).body("Користувача не знайдено");
            }

            request.setUserId(user.getId());
            gameService.processGameResult(request);

            return ResponseEntity.ok("Результат збережено");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Помилка при обробці результату гри: " + e.getMessage());
        }
    }

    @GetMapping("/words")
    public ResponseEntity<List<String>> getRandomWords(@RequestParam int count) {
        List<String> words = gameService.getRandomWords(count);
        return ResponseEntity.ok(words);
    }

    @GetMapping("/top-players")
    public ResponseEntity<List<TopPlayerDto>> getTopPlayers() {
        return ResponseEntity.ok(gameService.getTopPlayers());
    }

}
