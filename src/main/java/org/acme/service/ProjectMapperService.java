package org.acme.service;

import java.util.Set;

import org.acme.model.project.Project;
import org.acme.model.project.ProjectDTO;
import org.acme.model.project_member.ProjectMember;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "cdi")
public interface ProjectMapperService {
    @Mapping(source = "owner.id", target = "ownerId")
    @Mapping(source = "members", target = "memberIds", qualifiedByName = "projectMembersToMemberIds")
    ProjectDTO toDTO(Project project);

    @Mapping(source = "ownerId", target = "owner.id")
    @Mapping(target = "members", ignore = true) // Handle members separately
    Project toEntity(ProjectDTO projectDTO);

    @Named("projectMembersToMemberIds")
    public static Long[] projectMembersToMemberIds(Set<ProjectMember> members) {
        return members.stream()
                .map(member -> member.getUser().id)
                .toArray(Long[]::new);
    }
}
