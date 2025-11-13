package com.qnboke04.techadict.mapper;

import com.qnboke04.techadict.dto.response.CartItemResponse;
import com.qnboke04.techadict.dto.response.CartResponse;
import com.qnboke04.techadict.entity.Carts;
import com.qnboke04.techadict.entity.CartItem;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;
import java.util.List;

@Mapper(componentModel = "spring")
public interface CartMapper {

    CartMapper INSTANCE = Mappers.getMapper(CartMapper.class);

    // ✅ Chuyển từng CartItem → CartItemResponse
    @Mappings({
            @Mapping(source = "variant.id", target = "variantId"),
            @Mapping(source = "variant.name", target = "variantName"),
            @Mapping(source = "variant.imageUrl", target = "imageUrl"),
            @Mapping(source = "variant.product.id", target = "productId"),      // 🆕
            @Mapping(source = "variant.product.name", target = "productName")   // 🆕
    })
    CartItemResponse toCartItemResponse(CartItem item);

    List<CartItemResponse> toCartItemResponses(List<CartItem> items);

    // ✅ Chuyển Carts → CartResponse
    @Mappings({
            @Mapping(source = "user.id", target = "userId"),
            @Mapping(
                    expression = "java(cart.getUser().getFirstName() + \" \" + cart.getUser().getLastName())",
                    target = "userName"
            ),
            @Mapping(expression = "java(calculateTotal(cart))", target = "totalPrice")
    })
    CartResponse toCartResponse(Carts cart);

    // ✅ Cho phép update entity mà không overwrite null
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateCartFromEntity(Carts source, @MappingTarget CartResponse target);

    // ✅ Custom tính tổng tiền
    default Double calculateTotal(Carts cart) {
        if (cart.getItems() == null) return 0.0;
        return cart.getItems().stream()
                .mapToDouble(item -> item.getPrice() != null ? item.getPrice() : 0.0)
                .sum();
    }
}
