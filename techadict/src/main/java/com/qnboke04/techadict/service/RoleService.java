package com.qnboke04.techadict.service;

import com.qnboke04.techadict.dto.request.RoleRequest;
import com.qnboke04.techadict.dto.response.PermissionResponse;
import com.qnboke04.techadict.dto.response.RoleResponse;
import com.qnboke04.techadict.entity.Permissions;
import com.qnboke04.techadict.entity.Roles;
import com.qnboke04.techadict.repository.PermissionRepository;
import com.qnboke04.techadict.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static lombok.AccessLevel.PRIVATE;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
@Transactional
public class RoleService {

    RoleRepository roleRepository;
    PermissionRepository permissionRepository;

    // ✅ Lấy tất cả roles
    public List<RoleResponse> getAll() {
        return roleRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    // ✅ Lấy role theo tên
    public Optional<RoleResponse> getByName(String name) {
        return roleRepository.findById(name)
                .map(this::toResponse);
    }

    // ✅ Tạo role mới
    public RoleResponse create(RoleRequest request) {
        if (roleRepository.existsById(request.getName())) {
            throw new RuntimeException("Role already exists: " + request.getName());
        }

        Roles role = Roles.builder()
                .name(request.getName())
                .description(request.getDescription())
                .permissions(findPermissions(request.getPermissions()))
                .build();

        return toResponse(roleRepository.save(role));
    }

    // ✅ Cập nhật role
    public RoleResponse update(String name, RoleRequest request) {
        Roles existing = roleRepository.findById(name)
                .orElseThrow(() -> new RuntimeException("Role not found: " + name));

        existing.setDescription(request.getDescription());
        existing.setPermissions(findPermissions(request.getPermissions()));

        return toResponse(roleRepository.save(existing));
    }

    // ✅ Xóa role
    public void delete(String name) {
        if (!roleRepository.existsById(name)) {
            throw new RuntimeException("Role not found: " + name);
        }
        roleRepository.deleteById(name);
    }

    // 🔹 Map entity → response
    private RoleResponse toResponse(Roles role) {
        return RoleResponse.builder()
                .name(role.getName())
                .description(role.getDescription())
                .permissions(
                        role.getPermissions().stream()
                                .map(this::toPermissionResponse)
                                .collect(Collectors.toSet())
                )
                .build();
    }

    // 🔹 Map Permission entity → PermissionResponse
    private PermissionResponse toPermissionResponse(Permissions permission) {
        return PermissionResponse.builder()
                .name(permission.getName())
                .description(permission.getDescription())
                .build();
    }

    // 🔹 Tìm danh sách Permission entity từ danh sách tên trong request
    private Set<Permissions> findPermissions(Set<String> names) {
        if (names == null || names.isEmpty()) return Set.of();

        return names.stream()
                .map(name -> permissionRepository.findById(name)
                        .orElseThrow(() -> new RuntimeException("Permission not found: " + name)))
                .collect(Collectors.toSet());
    }
}
