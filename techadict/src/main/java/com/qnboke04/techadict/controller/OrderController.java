package com.qnboke04.techadict.controller;

import com.qnboke04.techadict.dto.request.ApiResponse;
import com.qnboke04.techadict.dto.request.OrderRequest;
import com.qnboke04.techadict.dto.response.OrderResponse;
import com.qnboke04.techadict.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static lombok.AccessLevel.PRIVATE;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class OrderController {

    OrderService orderService;

    // ===========================
    // ✅ 1. Tạo đơn hàng mới
    // ===========================
    @PostMapping
    public ApiResponse<OrderResponse> create(@RequestBody OrderRequest request) {
        try {
            return ApiResponse.<OrderResponse>builder()
                    .result(orderService.create(request))
                    .message("Đơn hàng đã được tạo thành công")
                    .build();
        } catch (RuntimeException e) {
            return ApiResponse.<OrderResponse>builder()
                    .code(400)
                    .message("Lỗi khi tạo đơn hàng: " + e.getMessage())
                    .build();
        }
    }

    // ===========================
    // ✅ 2. Admin: lấy tất cả đơn hàng
    // ===========================
    @GetMapping
    public ApiResponse<List<OrderResponse>> getAll() {
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderService.getAll())
                .message("Danh sách tất cả đơn hàng")
                .build();
    }

    // ===========================
    // ✅ 3. Lấy đơn hàng theo user
    // ===========================
    @GetMapping("/user/{userId}")
    public ApiResponse<List<OrderResponse>> getByUser(@PathVariable String userId) {
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderService.getByUser(userId))
                .message("Danh sách đơn hàng của user " + userId)
                .build();
    }

    // ===========================
    // ✅ 4. Lấy chi tiết 1 đơn hàng
    // ===========================
    @GetMapping("/{orderId}")
    public ApiResponse<OrderResponse> getById(@PathVariable String orderId) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.getById(orderId))
                .message("Chi tiết đơn hàng " + orderId)
                .build();
    }

    // ===========================
    // ✅ 5. Admin: cập nhật trạng thái đơn
    // ===========================
    @PutMapping("/{orderId}/status")
    public ApiResponse<OrderResponse> updateStatus(
            @PathVariable String orderId,
            @RequestParam String status
    ) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.updateStatus(orderId, status))
                .message("Trạng thái đơn hàng đã cập nhật: " + status)
                .build();
    }

    // ===========================
    // ✅ 6. Admin: cập nhật payment
    // ===========================
    @PutMapping("/{orderId}/payment")
    public ApiResponse<OrderResponse> updatePayment(
            @PathVariable String orderId,
            @RequestParam String status
    ) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.updatePayment(orderId, status))
                .message("Trạng thái thanh toán đã cập nhật: " + status)
                .build();
    }

    // ===========================
    // 🚀 7. User: hủy đơn hàng
    // ===========================
    @PutMapping("/{orderId}/cancel")
    public ApiResponse<OrderResponse> cancelOrder(
            @PathVariable String orderId,
            @RequestParam String userId
    ) {
        try {
            return ApiResponse.<OrderResponse>builder()
                    .result(orderService.cancelOrder(orderId, userId))
                    .message("Đơn hàng đã được hủy thành công")
                    .build();
        } catch (RuntimeException e) {
            return ApiResponse.<OrderResponse>builder()
                    .code(400)
                    .message("Không thể hủy đơn hàng: " + e.getMessage())
                    .build();
        }
    }


}
