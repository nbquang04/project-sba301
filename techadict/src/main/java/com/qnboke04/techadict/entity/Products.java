package com.qnboke04.techadict.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.persistence.criteria.Fetch;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Products extends BaseEntity{
    @Id
    private String id;
    private String name;
    private String description;
    private BigDecimal origin_price;
    private Integer quantity;
    private boolean featured;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ProductVariants> variants;

    @ElementCollection
    @CollectionTable(
            name = "product_images",               // tên bảng trung gian
            joinColumns = @JoinColumn(name = "product_id") // khóa ngoại tới product
    )
    @Column(name = "image_url", length = 500)
    private List<String> images;
}
