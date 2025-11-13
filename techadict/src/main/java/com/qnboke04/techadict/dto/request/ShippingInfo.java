package com.qnboke04.techadict.dto.request;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShippingInfo {
    private String fullName;
    private String phone;
    private String detail;
    private String ward;
    private String district;
    private String city;
}
