package org.acme.task;

import org.mapstruct.Mapper;

@Mapper(componentModel = "cdi")
public interface TaskMapper {
    TaskDTO toDTO(Task task);

    Task toEntity(TaskDTO taskDTO);
}
