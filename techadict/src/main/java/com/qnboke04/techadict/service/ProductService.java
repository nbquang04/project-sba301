package com.qnboke04.techadict.service;

import com.qnboke04.techadict.dto.request.ProductRequest;
import com.qnboke04.techadict.dto.request.VariantRequest;
import com.qnboke04.techadict.dto.response.ProductResponse;
import com.qnboke04.techadict.entity.Brand;
import com.qnboke04.techadict.entity.Category;
import com.qnboke04.techadict.entity.ProductVariants;
import com.qnboke04.techadict.entity.Products;
import com.qnboke04.techadict.exception.AppException;
import com.qnboke04.techadict.exception.ErrorCode;
import com.qnboke04.techadict.mapper.ProductMapper;
import com.qnboke04.techadict.mapper.ProductVariantMapper;
import com.qnboke04.techadict.repository.BrandRepository;
import com.qnboke04.techadict.repository.CategoryRepository;
import com.qnboke04.techadict.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {
    ProductRepository productRepository;
    CategoryRepository categoryRepository;
    BrandRepository brandRepository;
    IdGenerator idGenerator;
    ProductMapper productMapper;
    ProductVariantMapper productVariantMapper;

    public ProductResponse create(ProductRequest dto) {
        // Map từ DTO sang entity
        Products product = productMapper.toProduct(dto);
        product.setId(idGenerator.generate("PROD"));

        // Gán category
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid category ID"));
            product.setCategory(category);
        }

        // Gán brand
        if (dto.getBrandId() != null) {
            Brand brand = brandRepository.findById(dto.getBrandId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid brand ID"));
            product.setBrand(brand);
        }

        // Map danh sách variants (nếu có)
        if (dto.getVariants() != null && !dto.getVariants().isEmpty()) {
            List<ProductVariants> variants = dto.getVariants().stream()
                    .map(productVariantMapper::toEntity)
                    .peek(v -> {
                        v.setProduct(product);
                        v.setId(idGenerator.generate("VAR"));
                    })
                    .toList();
            product.setVariants(variants);
        }

        // Map danh sách ảnh
        product.setImages(dto.getImages());

        Products saved = productRepository.save(product);
        return productMapper.toProductResponse(saved);
    }

    public List<ProductResponse> getAll() {
        return productRepository.findAll()
                .stream()
                .map(productMapper::toProductResponse)
                .toList();
    }

    public ProductResponse getById(String id) {
        Products product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
        return productMapper.toProductResponse(product);
    }

    public void delete(String id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Product not found: " + id);
        }
        productRepository.deleteById(id);
    }

    public ProductResponse update(String id, ProductRequest dto) {
        Products existing = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));

        // 🔹 Cập nhật thông tin cơ bản
        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setOrigin_price(dto.getOrigin_price());
        existing.setFeatured(dto.getFeatured());
        existing.setImages(dto.getImages());

        // 🔹 Category
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid category ID"));
            existing.setCategory(category);
        }

        // 🔹 Brand
        if (dto.getBrandId() != null) {
            Brand brand = brandRepository.findById(dto.getBrandId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid brand ID"));
            existing.setBrand(brand);
        }

        // 🔹 Cập nhật danh sách variants
        if (dto.getVariants() != null) {
            // Biến tạm cho variant hiện có (đã lưu trong DB)
            Map<String, ProductVariants> existingVariantMap = existing.getVariants().stream()
                    .collect(Collectors.toMap(ProductVariants::getId, v -> v));

            List<ProductVariants> updatedVariants = new ArrayList<>();

            for (VariantRequest vDto : dto.getVariants()) {
                ProductVariants variant;
                if (vDto.getId() != null && existingVariantMap.containsKey(vDto.getId())) {
                    // ✅ Nếu variant đã tồn tại → update fields
                    variant = existingVariantMap.get(vDto.getId());
                    variant.setName(vDto.getName());
                    variant.setColor(vDto.getColor());
                    variant.setStorage(vDto.getStorage());
                    variant.setPrice(vDto.getPrice());
                    variant.setQuantity(vDto.getQuantity() != null ? vDto.getQuantity() : 0);
                    variant.setImageUrl(vDto.getImageUrl());
                } else {
                    // ✅ Nếu variant mới → tạo mới
                    variant = ProductVariants.builder()
                            .id(idGenerator.generate("VAR"))
                            .product(existing)
                            .name(vDto.getName())
                            .color(vDto.getColor())
                            .storage(vDto.getStorage())
                            .price(vDto.getPrice())
                            .quantity(vDto.getQuantity() != null ? vDto.getQuantity() : 0)
                            .imageUrl(vDto.getImageUrl())
                            .build();
                }
                updatedVariants.add(variant);
            }

            // 🔹 Gán lại list variants
            existing.getVariants().clear();
            existing.getVariants().addAll(updatedVariants);
        }

        // ✅ Tính lại tổng quantity từ variants
        int totalQuantity = existing.getVariants().stream()
                .map(v -> v.getQuantity() == null ? 0 : v.getQuantity())
                .reduce(0, Integer::sum);
        existing.setQuantity(totalQuantity);

        Products updated = productRepository.save(existing);
        return productMapper.toProductResponse(updated);
    }




}
