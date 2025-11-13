package com.qnboke04.techadict.mapper;

import com.qnboke04.techadict.dto.request.UserRequest;
import com.qnboke04.techadict.dto.request.UserUpdateRequest;
import com.qnboke04.techadict.dto.response.UserResponse;
import com.qnboke04.techadict.entity.Roles;
import com.qnboke04.techadict.entity.Users;
import org.mapstruct.*;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // ✅ Entity → DTO
    @Mapping(target = "roles", source = "roles")
    UserResponse toUserResponse(Users user);

    // ✅ Helper method — MapStruct sẽ tự gọi
    default Set<String> mapRolesToStrings(Set<Roles> roles) {
        if (roles == null) return null;
        return roles.stream().map(Roles::getName).collect(Collectors.toSet());
    }

    // ✅ DTO → Entity (Create)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "cart", ignore = true)
    Users toUser(UserRequest req);

    // ✅ DTO → Entity (Update)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "cart", ignore = true)
    void updateUserFromRequest(UserUpdateRequest req, @MappingTarget Users user);
}
