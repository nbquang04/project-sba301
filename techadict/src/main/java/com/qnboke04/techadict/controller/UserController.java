package com.qnboke04.techadict.controller;

import com.qnboke04.techadict.dto.request.ApiResponse;
import com.qnboke04.techadict.dto.request.UserRequest;
import com.qnboke04.techadict.dto.request.UserUpdateRequest;
import com.qnboke04.techadict.dto.response.UserResponse;
import com.qnboke04.techadict.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserService userService;

    // ✅ Tạo user mới (admin hoặc register)
    @PostMapping
    ApiResponse<UserResponse> createUser(@RequestBody UserRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser(request))
                .build();
    }

    // ✅ Lấy danh sách tất cả user (admin)
    @GetMapping
    ApiResponse<List<UserResponse>> getAllUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getUsers())
                .build();
    }

    // ✅ Lấy user theo ID (admin)
    @GetMapping("/{id}")
    ApiResponse<UserResponse> getUserById(@PathVariable("id") String id) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUserById(id))
                .build();
    }

    // ✅ Lấy thông tin user hiện tại (profile)
    @GetMapping("/me")
    ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }

    // ✅ Cập nhật thông tin user
    @PutMapping("/{id}")
    ApiResponse<UserResponse> updateUser(
            @PathVariable("id") String id,
            @RequestBody UserUpdateRequest request
    ) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUser(id, request))
                .build();
    }

    // ✅ Xóa user theo ID
    @DeleteMapping("/{id}")
    ApiResponse<String> deleteUser(@PathVariable("id") String id) {
        userService.deleteUser(id);
        return ApiResponse.<String>builder()
                .result("User with ID " + id + " deleted successfully!")
                .build();
    }
}
