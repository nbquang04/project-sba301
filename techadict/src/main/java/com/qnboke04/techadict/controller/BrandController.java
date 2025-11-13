package com.qnboke04.techadict.controller;

import com.qnboke04.techadict.dto.request.ApiResponse;
import com.qnboke04.techadict.entity.Brand;
import com.qnboke04.techadict.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/brands")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BrandController {

    private final BrandService brandService;

    @PostMapping
    public ApiResponse<Brand> create(@RequestBody Brand brand) {
        return ApiResponse.<Brand>builder()
                .result(brandService.create(brand))
                .build();
    }

    @GetMapping
    public ApiResponse<List<Brand>> getAll() {
        return ApiResponse.<List<Brand>>builder()
                .result(brandService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<Brand> getById(@PathVariable String id) {
        return ApiResponse.<Brand>builder()
                .result(brandService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<Brand> update(@PathVariable String id, @RequestBody Brand brand) {
        return ApiResponse.<Brand>builder()
                .result(brandService.update(id, brand))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable String id) {
        brandService.delete(id);
        return ApiResponse.<String>builder()
                .result("Brand deleted successfully!")
                .build();
    }
}
