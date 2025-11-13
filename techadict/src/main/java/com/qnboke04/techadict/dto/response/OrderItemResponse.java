package com.qnboke04.techadict.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private String variantId;
    private String variantName;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subtotal;
}
