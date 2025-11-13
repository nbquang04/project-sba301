package com.qnboke04.techadict.controller;

import com.qnboke04.techadict.dto.request.ApiResponse;
import com.qnboke04.techadict.entity.Permissions;
import com.qnboke04.techadict.service.PermissionService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static lombok.AccessLevel.PRIVATE;

@RestController
@RequestMapping("/permissions")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class PermissionController {

    PermissionService permissionService;

    @GetMapping
    public ApiResponse<List<Permissions>> getAll() {
        return ApiResponse.<List<Permissions>>builder()
                .result(permissionService.getAll())
                .build();
    }

    @GetMapping("/{name}")
    public ApiResponse<Permissions> getByName(@PathVariable String name) {
        return ApiResponse.<Permissions>builder()
                .result(permissionService.getByName(name).orElse(null))
                .build();
    }

    @PostMapping
    public ApiResponse<Permissions> create(@RequestBody Permissions permission) {
        return ApiResponse.<Permissions>builder()
                .result(permissionService.create(permission))
                .build();
    }

    @PutMapping("/{name}")
    public ApiResponse<Permissions> update(@PathVariable String name, @RequestBody Permissions permission) {
        return ApiResponse.<Permissions>builder()
                .result(permissionService.update(name, permission))
                .build();
    }

    @DeleteMapping("/{name}")
    public ApiResponse<String> delete(@PathVariable String name) {
        permissionService.delete(name);
        return ApiResponse.<String>builder()
                .result("Deleted permission: " + name)
                .build();
    }
}
