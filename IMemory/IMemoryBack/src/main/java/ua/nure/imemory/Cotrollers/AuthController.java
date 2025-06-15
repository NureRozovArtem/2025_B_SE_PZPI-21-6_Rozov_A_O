package ua.nure.imemory.Cotrollers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ua.nure.imemory.models.User;
import ua.nure.imemory.repositories.UserRepository;
import ua.nure.imemory.utils.JwtUtil;

import java.time.LocalDateTime;
import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepo;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepo, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepo.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Користувач з таким email вже існує");
        }

        // TODO
        // Змінити посилання та налаштувати ави
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("user");
        user.setCurrentLevel(1);
        user.setAvatarUrl("https://example.com/default-avatar.png");

        userRepo.save(user);

        return ResponseEntity.ok("Користувача створено");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            User foundUser = userRepo.findByEmail(user.getEmail());

            if (foundUser != null && passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
                String token = jwtUtil.generateToken(foundUser.getEmail());
                return ResponseEntity.ok(Collections.singletonMap("token", token));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Невірна пошта або пароль");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Помилка сервера");
        }
    }

}
