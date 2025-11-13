package com.qnboke04.techadict.dto.response;

import com.qnboke04.techadict.enums.OrderStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private String id;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private String userId;
    private String addressId;
    private List<OrderItemResponse> items;
    private PaymentResponse payment; // ✅ thêm thông tin thanh toán
    private LocalDateTime createdAt;
}
