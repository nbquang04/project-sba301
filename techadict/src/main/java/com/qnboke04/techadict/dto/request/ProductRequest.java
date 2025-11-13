package com.qnboke04.techadict.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {
    private String id;
    private String name;
    private String description;
    private BigDecimal origin_price;
    private Integer quantity;
    private Boolean featured;

    private String categoryId;
    private String brandId;

    private List<String> images;
    private List<VariantRequest> variants;
}
