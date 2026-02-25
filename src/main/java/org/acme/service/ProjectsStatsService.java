package org.acme.service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

import org.acme.model.project.Project;
import org.acme.model.project_member.ProjectMember;
import org.acme.model.projects_stats.ProjectsStatsDTO;
import org.acme.model.task.Task;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProjectsStatsService {
    public ProjectsStatsDTO toDTO(Long projectId, Long monthDelta) {
        Project project = Project.findById(projectId);
        Instant from = Instant.now().minus(Duration.ofDays((monthDelta + 1) * 30));
        Instant to = Instant.now().minus(Duration.ofDays(monthDelta * 30));
        // Total members in the project at the given monthDelta
        Long totalMembers = ProjectMember.find("project.id", projectId).stream()
                .map(pm -> (ProjectMember) pm)
                .filter(pm -> pm.getJoinedAt().isBefore(to))
                .count();
        // Members who joined in the given monthDelta
        Long membersJoined = ProjectMember.find("project.id", projectId).stream()
                .map(pm -> (ProjectMember) pm)
                .filter(pm -> pm.getJoinedAt().isAfter(from)
                        && pm.getJoinedAt().isBefore(to))
                .count();
        // Total tasks in the project at the given monthDelta
        List<Task> tasks = Task.find("project.id", projectId).stream()
                .map(task -> (Task) task)
                .filter(task -> task.getCreatedAt().isBefore(to))
                .toList();
        // Total tasks created in the given monthDelta
        Long tasksCreated = tasks.stream()
                .filter(task -> (task.getCreatedAt().isAfter(from)))
                .count();

        // print all tasks for debugging
        System.out.println("Tasks for project " + projectId + " from " + from + " to " + to + ":");
        tasks.forEach(task -> System.out.println("- " + task.getTitle() + " (created at " + task.getCreatedAt()
                + ", completed: " + task.isCompleted() + ", overdue: " + task.isOverdue() + ", is relevant: "
                + task.getCreatedAt().isAfter(from) + ")"));

        ProjectsStatsDTO stats = new ProjectsStatsDTO(
                projectId, // projectId
                project.getName(), // projectName
                from, // from
                to, // to
                tasks.size(), // totalTasks
                tasksCreated, // taskCreated
                tasks.stream().filter(Task::isCompleted).count(), // completedTasks
                tasks.stream().filter(Task::isOverdue).count(), // overdueTasks
                totalMembers, // totalMembers
                membersJoined // membersJoined
        );
        return stats;
    }

    public int compareStats(ProjectsStatsDTO stats1, ProjectsStatsDTO stats2) {
        Long taskCreatedDiff = stats2.tasksCreated() - stats1.tasksCreated();
        if (taskCreatedDiff != 0) {
            return taskCreatedDiff.intValue();
        }

        Long completedTasksDiff = stats2.completedTasks() - stats1.completedTasks();
        if (completedTasksDiff != 0) {
            return completedTasksDiff.intValue();
        }

        Long membersJoinedDiff = stats2.membersJoined() - stats1.membersJoined();
        if (membersJoinedDiff != 0) {
            return membersJoinedDiff.intValue();
        }

        return stats2.from().compareTo(stats1.from());
    }
}
