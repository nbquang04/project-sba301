package com.qnboke04.techadict.service;

import com.qnboke04.techadict.dto.request.UserRequest;
import com.qnboke04.techadict.dto.request.UserUpdateRequest;
import com.qnboke04.techadict.dto.response.UserResponse;
import com.qnboke04.techadict.entity.Users;
import com.qnboke04.techadict.entity.Roles;
import com.qnboke04.techadict.enums.Role;
import com.qnboke04.techadict.exception.AppException;
import com.qnboke04.techadict.exception.ErrorCode;
import com.qnboke04.techadict.mapper.UserMapper;
import com.qnboke04.techadict.repository.RoleRepository;
import com.qnboke04.techadict.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {

    UserRepository userRepository;
    RoleRepository roleRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    IdGenerator idGenerator;

    // ✅ Tạo mới user
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new AppException(ErrorCode.USER_EXISTED);

        Users user = userMapper.toUser(request);
        user.setId(idGenerator.generate("USER"));
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Nếu không có roleNames → mặc định USER
        Set<Roles> roles;
        if (request.getRoles() == null || request.getRoles().isEmpty()) {
            Roles defaultRole = roleRepository.findById(Role.USER.name())
                    .orElseThrow(() -> new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION));
            roles = new HashSet<>(Set.of(defaultRole));
        } else {
            roles = new HashSet<>(roleRepository.findAllById(request.getRoles()));
        }

        user.setRoles(roles);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    // ✅ Lấy thông tin user đang đăng nhập
    public UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userMapper.toUserResponse(user);
    }

    // ✅ Cập nhật user
    public UserResponse updateUser(String userId, UserUpdateRequest request) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userMapper.updateUserFromRequest(request, user);

        // Encode password nếu có thay đổi
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        // Cập nhật roles nếu có gửi
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            var roles = roleRepository.findAllById(request.getRoles());
            user.setRoles(new HashSet<>(roles));
        }

        Users saved = userRepository.save(user);
        return userMapper.toUserResponse(saved);
    }

    // ✅ Xóa user
    public void deleteUser(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
        userRepository.deleteById(userId);
    }

    // ✅ Lấy tất cả user
    public List<UserResponse> getUsers() {
        log.info("Fetching all users");
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    // ✅ Lấy user theo id
    public UserResponse getUserById(String id) {
        log.info("Fetching user by id: {}", id);
        return userMapper.toUserResponse(
                userRepository.findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED))
        );
    }
}
