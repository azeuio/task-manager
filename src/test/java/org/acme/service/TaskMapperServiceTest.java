package org.acme.service;

import java.time.Instant;

import org.acme.model.project.Project;
import org.acme.model.project.ProjectStatus;
import org.acme.model.task.Task;
import org.acme.model.task.TaskDTO;
import org.acme.model.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TaskMapperServiceTest {

    private TaskMapperService mapper;

    @BeforeEach
    void setUp() {
        mapper = new TaskMapperServiceImpl();
    }

    @Test
    void toDTO_mapsAllFields() {
        User creator = new User("creator");
        creator.setId(10L);
        User assignee = new User("assignee");
        assignee.setId(20L);

        Project project = new Project("Test", "Desc", ProjectStatus.ACTIVE, creator);
        project.id = 5L;

        Instant now = Instant.now();
        Instant dueDate = now.plusSeconds(86400);

        Task task = new Task("My Task", "Description", 1, 2, project, creator);
        task.setId(1L);
        task.setAssignedTo(assignee);
        task.setDueDate(dueDate);
        task.setCreatedAt(now);
        task.setUpdatedAt(now);

        TaskDTO dto = mapper.toDTO(task);

        assertEquals(1L, dto.id());
        assertEquals("My Task", dto.title());
        assertEquals("Description", dto.description());
        assertEquals(1, dto.status());
        assertEquals(2, dto.priority());
        assertEquals(5L, dto.projectId());
        assertEquals(10, dto.createdById());
        assertEquals(20, dto.assignedToId());
        assertEquals(dueDate, dto.dueDate());
        assertEquals(now, dto.createdAt());
        assertEquals(now, dto.updatedAt());
    }

    @Test
    void toDTO_handlesNullAssignee() {
        User creator = new User("creator");
        creator.setId(10L);
        Project project = new Project("Test", "Desc", ProjectStatus.ACTIVE, creator);
        project.id = 5L;

        Task task = new Task("Task", "Desc", 0, 1, project, creator);
        task.setId(2L);

        TaskDTO dto = mapper.toDTO(task);

        assertNull(dto.assignedToId());
        assertEquals(10, dto.createdById());
    }

    @Test
    void toDTO_handlesNullCreator() {
        Project project = new Project();
        project.id = 5L;

        Task task = new Task();
        task.setId(3L);
        task.setTitle("Orphan Task");
        task.setProject(project);

        TaskDTO dto = mapper.toDTO(task);

        assertNull(dto.createdById());
        assertNull(dto.assignedToId());
        assertEquals(5L, dto.projectId());
    }

    @Test
    void toEntity_mapsAllFields() {
        Instant now = Instant.now();
        TaskDTO dto = new TaskDTO(
                1L, "Task Title", "Task Desc", 2, 3,
                10L, now.plusSeconds(86400),
                5, 8,
                now, now);

        Task task = mapper.toEntity(dto);

        assertEquals(1L, task.getId());
        assertEquals("Task Title", task.getTitle());
        assertEquals("Task Desc", task.getDescription());
        assertEquals(2, task.getStatus());
        assertEquals(3, task.getPriority());
        assertEquals(10L, task.getProject().id);
        assertEquals(5L, task.getCreatedBy().id);
        assertEquals(8L, task.getAssignedTo().id);
    }

    @Test
    void toEntity_handlesNullIds() {
        TaskDTO dto = new TaskDTO(
                null, "Task", "Desc", 0, 1,
                5L, null,
                null, null,
                null, null);

        Task task = mapper.toEntity(dto);

        assertEquals("Task", task.getTitle());
        // MapStruct creates intermediate objects with null IDs for nested mappings
        assertNull(task.getCreatedBy().getId());
        assertNull(task.getAssignedTo().getId());
        assertNull(task.getDueDate());
    }

    @Test
    void roundTrip_preservesData() {
        User creator = new User("creator");
        creator.setId(10L);
        User assignee = new User("assignee");
        assignee.setId(20L);
        Project project = new Project("Test", "Desc", ProjectStatus.ACTIVE, creator);
        project.id = 5L;

        Task original = new Task("Round Trip", "Testing", 1, 2, project, creator);
        original.setId(100L);
        original.setAssignedTo(assignee);

        TaskDTO dto = mapper.toDTO(original);
        Task restored = mapper.toEntity(dto);

        assertEquals(original.getId(), restored.getId());
        assertEquals(original.getTitle(), restored.getTitle());
        assertEquals(original.getDescription(), restored.getDescription());
        assertEquals(original.getStatus(), restored.getStatus());
        assertEquals(original.getPriority(), restored.getPriority());
        assertEquals(original.getProject().id, restored.getProject().id);
    }
}
