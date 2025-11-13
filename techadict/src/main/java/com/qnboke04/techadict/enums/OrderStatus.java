package com.qnboke04.techadict.enums;

public enum OrderStatus {
    PENDING,      // Chờ xác nhận
    CONFIRMED,    // Đã xác nhận
    PAID,         // Đã thanh toán
    PREPARING,    // Đang chuẩn bị hàng
    SHIPPED,      // Đã giao cho bên vận chuyển
    DELIVERING,   // Đang giao
    DELIVERED,    // Giao thành công
    CANCELED     // Đã hủy
}

