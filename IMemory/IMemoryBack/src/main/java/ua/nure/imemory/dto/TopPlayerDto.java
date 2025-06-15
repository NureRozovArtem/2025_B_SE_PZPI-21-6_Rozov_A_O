package ua.nure.imemory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopPlayerDto {
    private String username;
    private int totalScore;
}