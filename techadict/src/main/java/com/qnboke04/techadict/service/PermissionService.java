package com.qnboke04.techadict.service;

import com.qnboke04.techadict.entity.Permissions;
import com.qnboke04.techadict.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static lombok.AccessLevel.PRIVATE;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
@Transactional
public class PermissionService {

    PermissionRepository permissionRepository;

    public List<Permissions> getAll() {
        return permissionRepository.findAll();
    }

    public Optional<Permissions> getByName(String name) {
        return permissionRepository.findById(name);
    }

    public Permissions create(Permissions permission) {
        if (permissionRepository.existsById(permission.getName())) {
            throw new RuntimeException("Permission already exists: " + permission.getName());
        }
        return permissionRepository.save(permission);
    }

    public Permissions update(String name, Permissions updatedPermission) {
        Permissions existing = permissionRepository.findById(name)
                .orElseThrow(() -> new RuntimeException("Permission not found: " + name));

        existing.setDescription(updatedPermission.getDescription());
        return permissionRepository.save(existing);
    }

    public void delete(String name) {
        if (!permissionRepository.existsById(name)) {
            throw new RuntimeException("Permission not found: " + name);
        }
        permissionRepository.deleteById(name);
    }
}
