package com.qnboke04.techadict.dto.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VariantResponse {
    private String id;
    private String name;
    private String color;
    private String storage;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;
}
