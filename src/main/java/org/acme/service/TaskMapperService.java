package org.acme.service;

import org.acme.model.task.Task;
import org.acme.model.task.TaskDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "cdi")
public interface TaskMapperService {
    @Mapping(source = "project.id", target = "projectId")
    @Mapping(source = "assignedTo.id", target = "assignedToId")
    @Mapping(source = "createdBy.id", target = "createdById")
    TaskDTO toDTO(Task task);

    @Mapping(source = "projectId", target = "project.id")
    @Mapping(source = "assignedToId", target = "assignedTo.id")
    @Mapping(source = "createdById", target = "createdBy.id")
    Task toEntity(TaskDTO taskDTO);
}
