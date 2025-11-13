package com.qnboke04.techadict.dto.request;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemRequest {
    private String variantId;
    private Integer quantity;
    private BigDecimal price; // FE gửi lên, backend sẽ xác nhận lại
}
