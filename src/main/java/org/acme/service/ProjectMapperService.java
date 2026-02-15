package org.acme.service;

import org.acme.model.project.Project;
import org.acme.model.project.ProjectDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "cdi")
public interface ProjectMapperService {
    @Mapping(source = "owner.id", target = "ownerId")

    ProjectDTO toDTO(Project project);

    Project toEntity(ProjectDTO projectDTO);
}
