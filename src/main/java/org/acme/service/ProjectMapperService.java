package org.acme.service;

import org.acme.model.project.Project;
import org.acme.model.project.ProjectDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "cdi")
public interface ProjectMapperService {
    ProjectDTO toDTO(Project project);

    Project toEntity(ProjectDTO projectDTO);
}
