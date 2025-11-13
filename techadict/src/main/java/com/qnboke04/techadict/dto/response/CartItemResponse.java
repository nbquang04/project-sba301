package com.qnboke04.techadict.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private String id;
    private String variantId;
    private String variantName;
    private String productId;
    private String productName;
    private String imageUrl;
    private Double price;
    private Integer quantity;
}
