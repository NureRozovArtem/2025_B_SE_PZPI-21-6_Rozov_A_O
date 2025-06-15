package ua.nure.imemory.Cotrollers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.nure.imemory.dto.CardDto;
import ua.nure.imemory.dto.CardOrderRequest;
import ua.nure.imemory.models.User;
import ua.nure.imemory.repositories.UserRepository;
import ua.nure.imemory.services.CardGameService;
import ua.nure.imemory.utils.JwtUtil;

import java.util.List;

@RestController
@RequestMapping("/api/card-game")
@RequiredArgsConstructor
public class CardGameController {

    private final CardGameService cardGameService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @GetMapping("/start")
    public ResponseEntity<?> startGame(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.extractUsername(token);
            User user = userRepository.findByEmail(email);

            if (user == null) {
                return ResponseEntity.status(401).body("Користувача не знайдено");
            }

            List<CardDto> cards = cardGameService.getRandomCardsForUser(user.getEmail());
            return ResponseEntity.ok(cards);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Помилка при старті гри з картами: " + e.getMessage());
        }
    }

    @GetMapping("/images")
    public ResponseEntity<List<CardDto>> getRandomCards(@RequestParam int count) {
        List<CardDto> cards = cardGameService.getRandomCards(count);
        return ResponseEntity.ok(cards);
    }

    @PostMapping("/check")
    public ResponseEntity<?> checkResult(@RequestBody CardOrderRequest request,
                                         @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.extractUsername(token);
            User user = userRepository.findByEmail(email);

            if (user == null) {
                return ResponseEntity.status(401).body("Користувача не знайдено");
            }

            boolean correct = cardGameService.checkCardOrder(request.getSubmittedIds(), request.getCorrectIds());
            return ResponseEntity.ok(correct);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Помилка при перевірці результату: " + e.getMessage());
        }
    }

}