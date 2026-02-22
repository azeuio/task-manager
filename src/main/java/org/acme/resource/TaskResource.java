package org.acme.resource;

import java.util.List;

import org.acme.model.project.Project;
import org.acme.model.task.Task;
import org.acme.model.task.TaskDTO;
import org.acme.model.user.User;
import org.acme.service.TaskMapperService;
import org.acme.service.UserService;
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
    TaskMapperService taskMapper;

    @Inject
    UserService userService;

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
    @Transactional
    public TaskDTO updateTask(@PathParam("id") Long id, TaskDTO updatedTaskDTO) {
        Task existing = Task.findById(id);

        if (existing == null) {
            throw new RuntimeException("Task not found");
        }
        if (updatedTaskDTO.title() != null) {
            existing.setTitle(updatedTaskDTO.title());
        }
        if (updatedTaskDTO.description() != null) {
            existing.setDescription(updatedTaskDTO.description());
        }
        if (updatedTaskDTO.status() != null) {
            existing.setStatus(updatedTaskDTO.status());
        }
        if (updatedTaskDTO.priority() != null) {
            existing.setPriority(updatedTaskDTO.priority());
        }
        if (updatedTaskDTO.dueDate() != null) {
            existing.setDueDate(updatedTaskDTO.dueDate());
        }
        if (updatedTaskDTO.assignedToId() != null) {
            User assignedTo = User.findById(updatedTaskDTO.assignedToId());
            if (assignedTo == null) {
                throw new RuntimeException("Assigned user not found");
            }
            existing.setAssignedTo(assignedTo);
        }
        existing.setUpdatedAt(java.time.Instant.now());
        return taskMapper.toDTO(existing);
    }

    @POST
    @Transactional
    public TaskDTO createTask(@PathParam("projectId") Long projectId, TaskDTO taskDTO) {
        Project project = Project.findById(projectId);
        if (project == null) {
            throw new RuntimeException("Project not found");
        }
        User createdBy = userService.findUser(securityIdentity.getPrincipal().getName());
        String title = taskDTO.title() != null ? taskDTO.title() : "Untitled Task";
        String description = taskDTO.description() != null ? taskDTO.description() : "";
        Integer status = taskDTO.status() != null ? taskDTO.status() : 0;
        Integer priority = taskDTO.priority() != null ? taskDTO.priority() : 0;

        Task newTask = new Task(title, description, status, priority, project,
                createdBy);
        newTask.persist();
        return taskMapper.toDTO(newTask);
    }

    @DELETE
    @Path("/{id}")
    @Transactional

    public void deleteTask(@PathParam("id") Long id) {
        Task.deleteById(id);
    }
}
