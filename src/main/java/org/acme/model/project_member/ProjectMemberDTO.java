package org.acme.model.project_member;

public record ProjectMemberDTO(
        Long id,
        Long projectId,
        Long userId,
        ProjectMemberRole role,
        String joinedAt) {

}
