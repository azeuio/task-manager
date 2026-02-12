package org.acme.service;

import org.acme.model.user.User;
import org.acme.model.user.UserDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "cdi")
public interface UserMapperService {
    UserDTO toDTO(User user);

    User toEntity(UserDTO userDTO);
}
