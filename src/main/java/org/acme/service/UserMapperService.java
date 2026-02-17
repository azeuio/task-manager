package org.acme.service;

import java.util.Set;

import org.acme.model.project_member.ProjectMember;
import org.acme.model.user.User;
import org.acme.model.user.UserDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "cdi")
public interface UserMapperService {
    @Mapping(source = "projectMemberships", target = "projectIds", qualifiedByName = "projectMembershipsToProjectIds")
    UserDTO toDTO(User user);

    @Mapping(source = "projectIds", target = "projectMemberships", ignore = true) // Handle memberships separately
    User toEntity(UserDTO userDTO);

    @Named("projectMembershipsToProjectIds")
    public static Long[] projectMembershipsToProjectIds(Set<ProjectMember> memberships) {
        return memberships.stream()
                .map(member -> member.getProject().id)
                .toArray(Long[]::new);
    }
}
