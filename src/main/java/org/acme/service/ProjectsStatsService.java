package org.acme.service;

import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
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
        Instant now = Instant.now();
        ZonedDateTime nowZoned = now.atZone(ZoneId.systemDefault()).withDayOfMonth(1);
        int yearDelta = nowZoned.minus(Duration.ofDays(monthDelta * 30)).getYear() - nowZoned.getYear();
        int year = nowZoned.getYear() + yearDelta;
        int month = nowZoned.minus(Duration.ofDays(monthDelta * 30)).getMonthValue();
        Instant from = nowZoned.withYear(year).withMonth(month).withDayOfMonth(1).toInstant();
        Instant to = from.plus(Duration.ofDays(35)).atZone(ZoneId.systemDefault()).withDayOfMonth(1)
                .minus(Duration.ofDays(1)).toInstant();

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
                .filter(task -> (task.getCreatedAt().isAfter(from)) && (task.getCreatedAt().isBefore(to)))
                .count();
        // Total tasks completed in the given monthDelta
        Long tasksCompleted = tasks.stream()
                .filter(Task::isCompleted)
                .filter(task -> task.isCompleted() && task.getStatusChangedAt().isAfter(from)
                        && task.getStatusChangedAt().isBefore(to))
                .count();

        Long overdueTasks = tasks.stream()
                .filter(task -> !task.isCompleted() && task.getDueDate() != null
                        && task.getDueDate().isBefore(Instant.now()) && task.getCreatedAt().isBefore(to)
                        && task.getDueDate().isBefore(to))
                .count();

        // // print all tasks for debugging
        // System.out.println("Stats for project " + project.getName() + " from " + from
        // + " to " + to + "(monthDelta="
        // + monthDelta + "):");
        // System.out.println("- Total members: " + totalMembers);
        // System.out.println("- Members joined: " + membersJoined);
        // System.out.println("- Total tasks: " + tasks.size());
        // System.out.println("- Tasks created: " + tasksCreated);
        // System.out.println("- Tasks completed: " + tasksCompleted);
        // System.out.println("- Overdue tasks: " + overdueTasks);

        ProjectsStatsDTO stats = new ProjectsStatsDTO(
                projectId, // projectId
                project.getName(), // projectName
                from, // from
                to, // to
                tasks.size(), // totalTasks
                tasksCreated, // taskCreated
                tasksCompleted, // completedTasks
                overdueTasks, // overdueTasks
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
