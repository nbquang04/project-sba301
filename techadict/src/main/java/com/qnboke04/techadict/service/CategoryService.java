package com.qnboke04.techadict.service;

import com.qnboke04.techadict.entity.Category;
import com.qnboke04.techadict.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final IdGenerator idGenerator;
    // 🔹 Tạo category mới
    public Category create(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new IllegalArgumentException("Category name already exists");
        }
        if (category.getId() == null || category.getId().isEmpty()) {
            category.setId(idGenerator.generate("CAT")); // Tạo ID kiểu CAT-xxxx
        }
        return categoryRepository.save(category);
    }

    // 🔹 Lấy tất cả categories
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    // 🔹 Lấy category theo ID
    public Category getById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
    }

    // 🔹 Cập nhật category
    public Category update(String id, Category updated) {
        Category existing = getById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setImage(updated.getImage());
        return categoryRepository.save(existing);
    }

    // 🔹 Xóa category
    public void delete(String id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Category not found");
        }
        categoryRepository.deleteById(id);
    }
}
