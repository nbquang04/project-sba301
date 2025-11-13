package com.qnboke04.techadict.dto.response;

import com.qnboke04.techadict.enums.PaymentMethod;
import com.qnboke04.techadict.enums.PaymentStatus;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private String id;
    private Double amount;
    private PaymentMethod method;
    private PaymentStatus status;
    private LocalDateTime paymentDate;
}
