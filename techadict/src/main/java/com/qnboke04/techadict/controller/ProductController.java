package com.qnboke04.techadict.controller;

import com.qnboke04.techadict.dto.request.ApiResponse;
import com.qnboke04.techadict.dto.request.ProductRequest;
import com.qnboke04.techadict.dto.response.ProductResponse;
import com.qnboke04.techadict.service.ProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {
    ProductService productService;

    @PostMapping
    ApiResponse<ProductResponse> createProduct (@RequestBody ProductRequest productRequest) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.create(productRequest))
                .build();
    }

    @GetMapping
    ApiResponse<List<ProductResponse>> getAllProducts() {
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<ProductResponse> getProductById(@PathVariable("id") String id) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ProductResponse> updateProduct(
            @PathVariable("id") String id,
            @RequestBody ProductRequest productRequest
    ) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.update(id, productRequest))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteProductById(@PathVariable String id) {
        productService.delete(id);
        return ApiResponse.<String>builder()
                .result("Product with ID " + id + " deleted successfully!")
                .build();
    }
}
