package com.qnboke04.techadict.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariants extends BaseEntity {

    @Id
    private String id;

    private String name;
    private String color;
    private String storage;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;

    // ✅ Mỗi variant thuộc về một product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonBackReference
    private Products product;
}

