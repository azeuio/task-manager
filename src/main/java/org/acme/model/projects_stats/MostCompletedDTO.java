package org.acme.model.projects_stats;

public record MostCompletedDTO(long projectId, String projectName, String color, long completedCount) {
}
