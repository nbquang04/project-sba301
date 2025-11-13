package com.qnboke04.techadict.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VariantRequest {
    private String id;
    private String name;
    private String color;
    private String storage;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;
}
