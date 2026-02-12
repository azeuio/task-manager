package org.acme.project;

public class ProjectResponse {
    public long id;
    public String name;
    public String description;
    public String status;
    public long ownerId;

    public ProjectResponse(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.status = project.getStatus().name();
        this.ownerId = project.getOwner().id;
    }
}
