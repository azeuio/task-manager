package org.acme.service;

import org.acme.model.project_member.ProjectMember;
import org.acme.model.project_member.ProjectMemberDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "cdi")
public interface ProjectMemberMapperService {
    @Mapping(source = "project.id", target = "projectId")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.username", target = "username", ignore = true)
    ProjectMemberDTO toDTO(ProjectMember projectMember);

    @Mapping(source = "projectId", target = "project.id")
    @Mapping(source = "userId", target = "user.id")
    // @Mapping(source = "username", target = "user.username")
    ProjectMember toEntity(ProjectMemberDTO projectMemberDTO);
}
