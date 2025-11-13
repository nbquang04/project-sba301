package com.qnboke04.techadict.mapper;

import com.qnboke04.techadict.dto.response.*;
import com.qnboke04.techadict.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    OrderMapper INSTANCE = Mappers.getMapper(OrderMapper.class);

    // ✅ Map entity -> DTO
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "shippingAddress.id", target = "addressId")
    @Mapping(source = "items", target = "items")
    @Mapping(source = "payment", target = "payment")
    @Mapping(source = "createdAt", target = "createdAt") // 🕒 map ngày tạo đơn hàng
    OrderResponse toOrderResponse(Orders order);

    @Mapping(source = "variant.id", target = "variantId")
    @Mapping(source = "variant.name", target = "variantName")
    OrderItemResponse toOrderItemResponse(OrderItem item);

    // ✅ map Payment entity -> DTO
    PaymentResponse toPaymentResponse(Payment payment);

    List<OrderResponse> toOrderResponseList(List<Orders> orders);
}
