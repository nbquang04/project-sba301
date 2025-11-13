package com.qnboke04.techadict.controller;

import com.qnboke04.techadict.dto.request.ApiResponse;
import com.qnboke04.techadict.dto.request.CartRequest;
import com.qnboke04.techadict.dto.request.CartRemoveRequest;
import com.qnboke04.techadict.dto.response.CartResponse;
import com.qnboke04.techadict.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import static lombok.AccessLevel.PRIVATE;

@RestController
@RequestMapping("/carts")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class CartController {

    CartService cartService;

    // ✅ Lấy giỏ hàng của người dùng
    @GetMapping("/{userId}")
    public ApiResponse<CartResponse> getCart(@PathVariable String userId) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.getCartByUser(userId))
                .message("Lấy giỏ hàng thành công")
                .build();
    }

    // ✅ Thêm sản phẩm vào giỏ
    @PostMapping("/{userId}/add")
    public ApiResponse<CartResponse> addItem(
            @PathVariable String userId,
            @RequestBody CartRequest request
    ) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.addItem(userId, request.getVariantId(), request.getQuantity()))
                .message("Đã thêm sản phẩm vào giỏ hàng")
                .build();
    }

    // ✅ Cập nhật số lượng sản phẩm
    @PutMapping("/{userId}/update")
    public ApiResponse<CartResponse> updateItem(
            @PathVariable String userId,
            @RequestBody CartRequest request
    ) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.updateItem(userId, request.getVariantId(), request.getQuantity()))
                .message("Cập nhật số lượng thành công")
                .build();
    }

    // ✅ Xóa một sản phẩm khỏi giỏ
    @DeleteMapping("/{userId}/remove")
    public ApiResponse<CartResponse> removeItem(
            @PathVariable String userId,
            @RequestBody CartRemoveRequest request
    ) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.removeItem(userId, request.getVariantId()))
                .message("Đã xóa sản phẩm khỏi giỏ hàng")
                .build();
    }

    // ✅ Xóa toàn bộ giỏ hàng
    @DeleteMapping("/{userId}/clear")
    public ApiResponse<CartResponse> clearCart(@PathVariable String userId) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.clearCart(userId))
                .message("Đã xóa toàn bộ giỏ hàng")
                .build();
    }
}
