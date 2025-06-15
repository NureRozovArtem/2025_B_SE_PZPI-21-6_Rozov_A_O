package ua.nure.imemory.dto;

public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String role;
    private int currentLevel;
    private String avatarUrl;
    private Integer difficulty;

    public UserDTO(Long id, String username, String email, String role, int currentLevel, String avatarUrl, int difficulty) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.currentLevel = currentLevel;
        this.avatarUrl = avatarUrl;
        this.difficulty = difficulty;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public int getCurrentLevel() {
        return currentLevel;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public Integer getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Integer difficulty) {
        this.difficulty = difficulty;
    }

}
