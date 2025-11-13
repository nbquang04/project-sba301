package com.qnboke04.techadict.dto.response;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private String id;
    private String userId;
    private String userName;
    private Double totalPrice;
    private List<CartItemResponse> items;
}
