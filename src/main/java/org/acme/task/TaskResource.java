package org.acme.task;

import java.util.List;

import org.acme.project.Project;
import org.acme.user.User;
import org.eclipse.microprofile.jwt.JsonWebToken;

import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/v1/projects/{projectId}/tasks")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class TaskResource {

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    JsonWebToken jwt;

    @Inject
    TaskMapper taskMapper;

    @GET
    public List<TaskDTO> getTasks(@PathParam("projectId") Long projectId) {
        List<Task> tasks = Task.list("project.id", projectId);
        return tasks.stream().map(taskMapper::toDTO).toList();
    }

    @GET
    @Path("/{id}")
    public TaskDTO getTask(@PathParam("id") Long id) {
        return taskMapper.toDTO(Task.findById(id));
    }

    @PATCH
    @Path("/{id}")
    public TaskDTO updateTask(@PathParam("id") Long id, TaskDTO updatedTaskDTO) {
        Task existing = Task.findById(id);

        if (existing == null) {
            throw new RuntimeException("Task not found");
        }
        existing.setTitle(updatedTaskDTO.title());
        existing.setDescription(updatedTaskDTO.description());
        existing.setStatus(updatedTaskDTO.status());
        existing.setPriority(updatedTaskDTO.priority());
        existing.setDueDate(updatedTaskDTO.dueDate());
        existing.setUpdatedAt(java.time.Instant.now());
        existing.persist();
        return taskMapper.toDTO(existing);
    }

    @POST
    @Transactional
    public TaskDTO createTask(@PathParam("projectId") Long projectId, TaskDTO taskDTO) {
        Project project = Project.findById(projectId);
        if (project == null) {
            throw new RuntimeException("Project not found");
        }
        User createdBy = User.findOrCreateUser(securityIdentity.getPrincipal().getName(), jwt);
        Task newTask = new Task(taskDTO.title(), taskDTO.description(), taskDTO.status(), taskDTO.priority(), project,
                createdBy);
        newTask.persist();
        return taskMapper.toDTO(newTask);
    }

    @DELETE
    @Path("/{id}")

    public void deleteTask(@PathParam("id") Long id) {
        Task.deleteById(id);
    }
}
