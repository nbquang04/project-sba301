package com.qnboke04.techadict.entity;
import com.qnboke04.techadict.enums.PaymentMethod;
import com.qnboke04.techadict.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment extends BaseEntity {

    @Id
    private String id;

    private Double amount;

    @Enumerated(EnumType.STRING)
    private PaymentMethod method; // COD, BANK, MOMO, VNPAY,...

    @Enumerated(EnumType.STRING)
    private PaymentStatus status; // PENDING, SUCCESS, FAILED

    private String transactionId; // Mã giao dịch ngân hàng hoặc ví điện tử
    private LocalDateTime paymentDate;

    // ✅ Mỗi Payment thuộc 1 Order
    @OneToOne
    @JoinColumn(name = "order_id", unique = true)
    private Orders order;
}
