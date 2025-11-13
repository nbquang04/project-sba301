package com.qnboke04.techadict.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.apache.catalina.User;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Carts extends BaseEntity {

    @Id
    private String id;

    // ✅ 1 Cart thuộc 1 User
    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    @JsonBackReference
    private Users user;

    // ✅ 1 Cart có nhiều CartItems
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items;
}