package ua.nure.imemory.dto;

import java.util.List;

public class CardOrderRequest {
    private List<Long> submittedIds;
    private List<Long> correctIds;

    public List<Long> getSubmittedIds() {
        return submittedIds;
    }

    public void setSubmittedIds(List<Long> submittedIds) {
        this.submittedIds = submittedIds;
    }

    public List<Long> getCorrectIds() {
        return correctIds;
    }

    public void setCorrectIds(List<Long> correctIds) {
        this.correctIds = correctIds;
    }
}
