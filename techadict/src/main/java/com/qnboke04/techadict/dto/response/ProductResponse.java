package com.qnboke04.techadict.dto.response;

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
public class ProductResponse {
    private String id;
    private String name;
    private String description;
    private BigDecimal origin_price;
    private Integer quantity;
    private String categoryName;
    private String brandName;
    private Boolean featured;
    private List<String> images; // Danh sách ảnh sản phẩm (nếu có)
    private List<VariantResponse> variants; // Danh sách phiên bản sản phẩm
}
