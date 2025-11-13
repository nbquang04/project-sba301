package com.qnboke04.techadict.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "order_items")
public class OrderItem extends BaseEntity {

    @Id
    private String id;

    @Column(nullable = false)
    private Integer quantity;

    // ✅ Giá tại thời điểm mua
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    // ✅ Tổng tiền = price × quantity
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal subtotal;

    // 🔗 Mỗi OrderItem thuộc 1 Order
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Orders order;

    // 🔗 Mỗi OrderItem thuộc 1 ProductVariant
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariants variant;

}
