package com.qnboke04.techadict.controller;

import com.qnboke04.techadict.dto.request.ApiResponse;
import com.qnboke04.techadict.dto.request.RoleRequest;
import com.qnboke04.techadict.dto.response.RoleResponse;
import com.qnboke04.techadict.service.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static lombok.AccessLevel.PRIVATE;

@RestController
@RequestMapping("/roles")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class RoleController {

    RoleService roleService;

    // ✅ Lấy danh sách tất cả roles
    @GetMapping
    public ApiResponse<List<RoleResponse>> getAll() {
        return ApiResponse.<List<RoleResponse>>builder()
                .result(roleService.getAll())
                .build();
    }

    // ✅ Lấy 1 role theo tên
    @GetMapping("/{name}")
    public ApiResponse<RoleResponse> getByName(@PathVariable String name) {
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.getByName(name).orElse(null))
                .build();
    }

    // ✅ Tạo mới role
    @PostMapping
    public ApiResponse<RoleResponse> create(@RequestBody RoleRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.create(request))
                .build();
    }

    // ✅ Cập nhật role theo tên
    @PutMapping("/{name}")
    public ApiResponse<RoleResponse> update(@PathVariable String name, @RequestBody RoleRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.update(name, request))
                .build();
    }

    // ✅ Xóa role theo tên
    @DeleteMapping("/{name}")
    public ApiResponse<String> delete(@PathVariable String name) {
        roleService.delete(name);
        return ApiResponse.<String>builder()
                .result("Deleted role: " + name)
                .build();
    }
}
