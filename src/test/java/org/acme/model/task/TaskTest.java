package org.acme.model.task;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.acme.model.project.Project;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TaskTest {

    private Task task;
    private Project project;

    @BeforeEach
    void setUp() {
        project = new Project();
        project.setCustomStatuses(List.of("review", "blocked", "qa"));

        task = new Task();
        task.setProject(project);
    }

    @Test
    void getStatusText_todo() {
        task.setStatus(0);
        assertEquals("todo", task.getStatusText());
    }

    @Test
    void getStatusText_inProgress() {
        task.setStatus(1);
        assertEquals("in_progress", task.getStatusText());
    }

    @Test
    void getStatusText_done() {
        task.setStatus(2);
        assertEquals("done", task.getStatusText());
    }

    @Test
    void getStatusText_customStatus_first() {
        task.setStatus(3);
        assertEquals("review", task.getStatusText());
    }

    @Test
    void getStatusText_customStatus_second() {
        task.setStatus(4);
        assertEquals("blocked", task.getStatusText());
    }

    @Test
    void getStatusText_customStatus_third() {
        task.setStatus(5);
        assertEquals("qa", task.getStatusText());
    }

    @Test
    void getStatusText_unknownStatus_outOfBounds() {
        task.setStatus(6);
        assertEquals("unknown", task.getStatusText());
    }

    @Test
    void getStatusText_unknownStatus_nullCustomStatuses() {
        project.setCustomStatuses(null);
        task.setStatus(3);
        assertEquals("unknown", task.getStatusText());
    }

    @Test
    void getStatusText_unknownStatus_emptyCustomStatuses() {
        project.setCustomStatuses(List.of());
        task.setStatus(3);
        assertEquals("unknown", task.getStatusText());
    }

    @Test
    void isCompleted_true() {
        task.setStatus(2);
        assertTrue(task.isCompleted());
    }

    @Test
    void isCompleted_false_todo() {
        task.setStatus(0);
        assertFalse(task.isCompleted());
    }

    @Test
    void isCompleted_false_inProgress() {
        task.setStatus(1);
        assertFalse(task.isCompleted());
    }

    @Test
    void isCompleted_false_customStatus() {
        task.setStatus(3);
        assertFalse(task.isCompleted());
    }

    @Test
    void isOverdue_true_pastDueDateNotCompleted() {
        task.setDueDate(Instant.now().minus(1, ChronoUnit.DAYS));
        task.setStatus(0);
        assertTrue(task.isOverdue());
    }

    @Test
    void isOverdue_false_completed() {
        task.setDueDate(Instant.now().minus(1, ChronoUnit.DAYS));
        task.setStatus(2);
        assertFalse(task.isOverdue());
    }

    @Test
    void isOverdue_false_futureDueDate() {
        task.setDueDate(Instant.now().plus(1, ChronoUnit.DAYS));
        task.setStatus(0);
        assertFalse(task.isOverdue());
    }

    @Test
    void isOverdue_false_noDueDate() {
        task.setDueDate(null);
        task.setStatus(0);
        assertFalse(task.isOverdue());
    }

    @Test
    void isOverdue_inProgressWithPastDueDate() {
        task.setDueDate(Instant.now().minus(2, ChronoUnit.HOURS));
        task.setStatus(1);
        assertTrue(task.isOverdue());
    }

    @Test
    void constructor_parameterized() {
        Task t = new Task("Test Title", "Test Description", 1, 2, project, null);
        assertEquals("Test Title", t.getTitle());
        assertEquals("Test Description", t.getDescription());
        assertEquals(1, t.getStatus());
        assertEquals(2, t.getPriority());
        assertEquals(project, t.getProject());
        assertNull(t.getCreatedBy());
    }

    @Test
    void constructor_default() {
        Task t = new Task();
        assertNull(t.getTitle());
        assertNull(t.getDescription());
        assertEquals(0, t.getStatus());
        assertEquals(0, t.getPriority());
    }

    @Test
    void settersAndGetters() {
        Instant now = Instant.now();

        task.setTitle("Updated Title");
        task.setDescription("Updated Description");
        task.setStatus(1);
        task.setPriority(3);
        task.setDueDate(now);
        task.setCreatedAt(now);
        task.setUpdatedAt(now);

        assertEquals("Updated Title", task.getTitle());
        assertEquals("Updated Description", task.getDescription());
        assertEquals(1, task.getStatus());
        assertEquals(3, task.getPriority());
        assertEquals(now, task.getDueDate());
        assertEquals(now, task.getCreatedAt());
        assertEquals(now, task.getUpdatedAt());
    }

    @Test
    void setAssignedTo() {
        assertNull(task.getAssignedTo());
        task.setAssignedTo(null);
        assertNull(task.getAssignedTo());
    }

    @Test
    void setCreatedBy() {
        assertNull(task.getCreatedBy());
        task.setCreatedBy(null);
        assertNull(task.getCreatedBy());
    }
}
