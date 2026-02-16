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

    Task toEntity(TaskDTO taskDTO);
}
