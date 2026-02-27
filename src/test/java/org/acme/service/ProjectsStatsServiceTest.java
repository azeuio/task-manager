package org.acme.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.acme.model.projects_stats.ProjectsStatsDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ProjectsStatsServiceTest {

    private ProjectsStatsService service;
    private Instant now;
    private Instant earlier;

    @BeforeEach
    void setUp() {
        service = new ProjectsStatsService();
        now = Instant.now();
        earlier = now.minus(30, ChronoUnit.DAYS);
    }

    private ProjectsStatsDTO createStats(long tasksCreated, long completedTasks,
            long membersJoined, Instant from) {
        return new ProjectsStatsDTO(
                1L, "Project", from, now,
                10L, tasksCreated, completedTasks, 0L,
                5L, membersJoined);
    }

    @Test
    void compareStats_higherTasksCreatedFirst() {
        ProjectsStatsDTO stats1 = createStats(5, 3, 2, earlier);
        ProjectsStatsDTO stats2 = createStats(10, 3, 2, earlier);

        int result = service.compareStats(stats1, stats2);
        assertTrue(result > 0, "stats2 with more tasksCreated should sort first");
    }

    @Test
    void compareStats_lowerTasksCreatedSecond() {
        ProjectsStatsDTO stats1 = createStats(10, 3, 2, earlier);
        ProjectsStatsDTO stats2 = createStats(5, 3, 2, earlier);

        int result = service.compareStats(stats1, stats2);
        assertTrue(result < 0, "stats1 with more tasksCreated should sort first");
    }

    @Test
    void compareStats_sameTasksCreated_compareByCompletedTasks() {
        ProjectsStatsDTO stats1 = createStats(5, 2, 2, earlier);
        ProjectsStatsDTO stats2 = createStats(5, 8, 2, earlier);

        int result = service.compareStats(stats1, stats2);
        assertTrue(result > 0, "stats2 with more completedTasks should sort first");
    }

    @Test
    void compareStats_sameTasksAndCompleted_compareByMembersJoined() {
        ProjectsStatsDTO stats1 = createStats(5, 3, 1, earlier);
        ProjectsStatsDTO stats2 = createStats(5, 3, 4, earlier);

        int result = service.compareStats(stats1, stats2);
        assertTrue(result > 0, "stats2 with more membersJoined should sort first");
    }

    @Test
    void compareStats_allSame_compareByFrom() {
        Instant from1 = now.minus(60, ChronoUnit.DAYS);
        Instant from2 = now.minus(30, ChronoUnit.DAYS);

        ProjectsStatsDTO stats1 = createStats(5, 3, 2, from1);
        ProjectsStatsDTO stats2 = createStats(5, 3, 2, from2);

        int result = service.compareStats(stats1, stats2);
        assertTrue(result > 0, "stats2 with later 'from' should sort first");
    }

    @Test
    void compareStats_identicalStats() {
        ProjectsStatsDTO stats1 = createStats(5, 3, 2, earlier);
        ProjectsStatsDTO stats2 = createStats(5, 3, 2, earlier);

        int result = service.compareStats(stats1, stats2);
        assertEquals(0, result);
    }

    @Test
    void compareStats_zeroValues() {
        ProjectsStatsDTO stats1 = createStats(0, 0, 0, earlier);
        ProjectsStatsDTO stats2 = createStats(0, 0, 0, earlier);

        int result = service.compareStats(stats1, stats2);
        assertEquals(0, result);
    }

    @Test
    void compareStats_firstDiffWins_tasksCreatedOverCompleted() {
        // stats2 has more tasksCreated but fewer completedTasks
        // tasksCreated diff should take priority
        ProjectsStatsDTO stats1 = createStats(3, 10, 5, earlier);
        ProjectsStatsDTO stats2 = createStats(7, 1, 0, earlier);

        int result = service.compareStats(stats1, stats2);
        assertTrue(result > 0, "tasksCreated difference should take priority");
    }
}
