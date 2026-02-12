package org.acme.project;

import org.mapstruct.Mapper;

@Mapper(componentModel = "cdi")
public interface ProjectMapper {
    ProjectDTO toDTO(Project project);

    Project toEntity(ProjectDTO projectDTO);
}
