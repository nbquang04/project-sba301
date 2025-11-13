package com.qnboke04.techadict.controller;

import com.qnboke04.techadict.dto.request.ApiResponse;
import com.qnboke04.techadict.entity.Category;
import com.qnboke04.techadict.service.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {

    private final CategoryService categoryService;

    // 🔹 Tạo mới category
    @PostMapping
    public ApiResponse<Category> create(@RequestBody Category category) {
        return ApiResponse.<Category>builder()
                .result(categoryService.create(category))
                .build();
    }

    // 🔹 Lấy tất cả
    @GetMapping
    public ApiResponse<List<Category>> getAll() {
        return ApiResponse.<List<Category>>builder()
                .result(categoryService.getAll())
                .build();
    }

    // 🔹 Lấy theo ID
    @GetMapping("/{id}")
    public ApiResponse<Category> getById(@PathVariable String id) {
        return ApiResponse.<Category>builder()
                .result(categoryService.getById(id))
                .build();
    }

    // 🔹 Cập nhật
    @PutMapping("/{id}")
    public ApiResponse<Category> update(@PathVariable String id, @RequestBody Category category) {
        return ApiResponse.<Category>builder()
                .result(categoryService.update(id, category))
                .build();
    }

    // 🔹 Xóa
    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable String id) {
        categoryService.delete(id);
        return ApiResponse.<String>builder()
                .result("Category deleted successfully!")
                .build();
    }
}