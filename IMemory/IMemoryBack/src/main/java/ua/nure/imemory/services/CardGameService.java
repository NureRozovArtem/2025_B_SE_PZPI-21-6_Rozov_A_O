package ua.nure.imemory.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ua.nure.imemory.dto.CardDto;
import ua.nure.imemory.repositories.CardRepository;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class CardGameService {

    private final GameService userService;
    private final CardRepository cardRepository;

    public List<CardDto> getRandomCardsForUser(String username) {
        int level = userService.getUserLevel(username);
        int numberOfCards = calculateNumberOfCards(level);

        List<CardDto> cards = loadAllCards();
        Collections.shuffle(cards);
        return cards.subList(0, numberOfCards);
    }

    private int calculateNumberOfCards(int level) {
        return 6 + level;
    }

    private List<CardDto> loadAllCards() {
        return cardRepository.findAll().stream()
                .map(card -> new CardDto(card.getId(), card.getName(), card.getImageUrl()))
                .collect(Collectors.toList());
    }

    public List<CardDto> getRandomCards(int count) {
        List<CardDto> cards = loadAllCards();
        Collections.shuffle(cards);
        if (count > cards.size()) {
            count = cards.size();
        }
        return cards.subList(0, count);
    }

    public boolean checkCardOrder(List<Long> submittedIds, List<Long> correctIds) {
        return submittedIds.equals(correctIds);
    }

}