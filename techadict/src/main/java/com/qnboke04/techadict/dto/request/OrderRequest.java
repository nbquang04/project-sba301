package com.qnboke04.techadict.dto.request;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    private String userId;
    private String addressId;              // nếu chọn địa chỉ có sẵn
    private ShippingInfo shippingInfo;     // nếu nhập mới trực tiếp
    private List<OrderItemRequest> items;
}
