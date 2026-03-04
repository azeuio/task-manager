package org.acme.model.projects_stats;

public record MostNewTasksDTO(long projectId, String projectName, String color, long taskCount) {
}
