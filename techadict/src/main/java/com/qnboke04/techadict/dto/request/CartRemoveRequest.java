package com.qnboke04.techadict.dto.request;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartRemoveRequest {
    private String variantId;
}
