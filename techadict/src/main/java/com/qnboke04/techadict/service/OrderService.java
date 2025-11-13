package com.qnboke04.techadict.service;

import com.qnboke04.techadict.dto.request.OrderItemRequest;
import com.qnboke04.techadict.dto.request.OrderRequest;
import com.qnboke04.techadict.dto.request.ShippingInfo;
import com.qnboke04.techadict.dto.response.OrderResponse;
import com.qnboke04.techadict.entity.*;
import com.qnboke04.techadict.enums.OrderStatus;
import com.qnboke04.techadict.enums.PaymentMethod;
import com.qnboke04.techadict.enums.PaymentStatus;
import com.qnboke04.techadict.mapper.OrderMapper;
import com.qnboke04.techadict.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderService {

    OrderRepository ordersRepository;
    OrderItemRepository orderItemRepository;
    ProductVariantRepository variantsRepository;
    UserRepository usersRepository;
    AddressRepository addressRepository;
    PaymentRepository paymentRepository;
    OrderMapper orderMapper;
    IdGenerator idGenerator;

    // ✅ 1. Tạo đơn hàng mới
    public OrderResponse create(OrderRequest request) {
        // 🔹 Lấy thông tin người dùng
        Users user = usersRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔹 Xử lý địa chỉ giao hàng (có thể chọn sẵn hoặc nhập mới)
        Address address;
        if (request.getAddressId() != null) {
            // 🧩 Nếu có sẵn addressId → dùng lại
            address = addressRepository.findById(request.getAddressId())
                    .orElseThrow(() -> new RuntimeException("Address not found"));
        } else if (request.getShippingInfo() != null) {
            // 🧩 Nếu người dùng nhập địa chỉ mới → tạo mới
            ShippingInfo info = request.getShippingInfo();
            address = Address.builder()
                    .id(idGenerator.generate("ADDR"))
                    .fullName(info.getFullName())
                    .phone(info.getPhone())
                    .detail(info.getDetail())
                    .ward(info.getWard())
                    .district(info.getDistrict())
                    .city(info.getCity())
                    .isDefault(false)
                    .userId(request.getUserId())
                    .build();
            addressRepository.save(address);
        } else {
            throw new RuntimeException("Address information is required");
        }

        // 🔹 Tạo đối tượng Order
        Orders order = Orders.builder()
                .id(idGenerator.generate("ORD"))
                .user(user)
                .shippingAddress(address)
                .status(OrderStatus.PENDING)
                .build();

        // 🔹 Tạo danh sách OrderItem
        List<OrderItem> items = request.getItems().stream().map(reqItem -> {
            ProductVariants variant = variantsRepository.findById(reqItem.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant not found"));

            // ✅ Kiểm tra tồn kho an toàn
            int currentQty = Optional.ofNullable(variant.getQuantity()).orElse(0);
            int newStock = currentQty - reqItem.getQuantity();
            if (newStock < 0) {
                throw new RuntimeException("Not enough stock for product: " + variant.getName());
            }

            // 🔹 Snapshot giá và tính subtotal
            BigDecimal price = variant.getPrice();
            BigDecimal subtotal = price.multiply(BigDecimal.valueOf(reqItem.getQuantity()));

            // 🔹 Cập nhật tồn kho
            variant.setQuantity(newStock);
            variantsRepository.save(variant);

            // 🔹 Tạo OrderItem
            return OrderItem.builder()
                    .id(idGenerator.generate("OI"))
                    .variant(variant)
                    .order(order)
                    .price(price)
                    .quantity(reqItem.getQuantity())
                    .subtotal(subtotal)
                    .build();
        }).toList();

        // 🔹 Tính tổng tiền
        BigDecimal totalAmount = items.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 🔹 Gán vào order
        order.setItems(items);
        order.setTotalAmount(totalAmount);

        // 🔹 Tạo payment mặc định (COD, PENDING)
        Payment payment = Payment.builder()
                .id(idGenerator.generate("PAY"))
                .amount(totalAmount.doubleValue())
                .method(PaymentMethod.COD)
                .status(PaymentStatus.PENDING)
                .paymentDate(LocalDateTime.now())
                .order(order)
                .build();

        order.setPayment(payment);

        // 🔹 Lưu order và payment
        ordersRepository.save(order);
        paymentRepository.save(payment);

        // 🔹 Trả về DTO
        return orderMapper.toOrderResponse(order);
    }

    // ✅ 2. Cập nhật trạng thái đơn hàng (Admin)
    public OrderResponse updateStatus(String orderId, String status) {
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        ordersRepository.save(order);
        return orderMapper.toOrderResponse(order);
    }

    // ✅ 3. Cập nhật trạng thái thanh toán (COD -> SUCCESS)
    public OrderResponse updatePayment(String orderId, String status) {
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getPayment() != null) {
            order.getPayment().setStatus(PaymentStatus.valueOf(status.toUpperCase()));
            paymentRepository.save(order.getPayment());
        }

        return orderMapper.toOrderResponse(order);
    }

    // ✅ 4. Lấy chi tiết 1 đơn hàng
    public OrderResponse getById(String orderId) {
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return orderMapper.toOrderResponse(order);
    }

    // ✅ 5. Lấy tất cả đơn hàng (Admin)
    public List<OrderResponse> getAll() {
        return orderMapper.toOrderResponseList(ordersRepository.findAll());
    }

    // ✅ 6. Lấy danh sách đơn theo User ID
    public List<OrderResponse> getByUser(String userId) {
        return orderMapper.toOrderResponseList(ordersRepository.findByUserId(userId));
    }
}
