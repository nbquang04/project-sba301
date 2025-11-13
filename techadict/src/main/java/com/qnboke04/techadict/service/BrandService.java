package com.qnboke04.techadict.service;

import com.qnboke04.techadict.entity.Brand;
import com.qnboke04.techadict.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BrandService {

    private final BrandRepository brandRepository;
    private final IdGenerator idGenerator;

    // 🔹 Tạo brand mới
    public Brand create(Brand brand) {
        if (brandRepository.existsByName(brand.getName())) {
            throw new IllegalArgumentException("Brand name already exists");
        }
        if (brand.getId() == null || brand.getId().isEmpty()) {
            brand.setId(idGenerator.generate("BR"));
        }
        return brandRepository.save(brand);
    }

    // 🔹 Lấy tất cả brands
    public List<Brand> getAll() {
        return brandRepository.findAll();
    }

    // 🔹 Lấy brand theo ID
    public Brand getById(String id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Brand not found"));
    }

    // 🔹 Cập nhật brand
    public Brand update(String id, Brand updated) {
        Brand existing = getById(id);
        existing.setName(updated.getName());
        existing.setCountry(updated.getCountry());
        existing.setLogoUrl(updated.getLogoUrl());
        return brandRepository.save(existing);
    }

    // 🔹 Xóa brand
    public void delete(String id) {
        if (!brandRepository.existsById(id)) {
            throw new IllegalArgumentException("Brand not found");
        }
        brandRepository.deleteById(id);
    }
}
