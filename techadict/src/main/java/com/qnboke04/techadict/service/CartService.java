package com.qnboke04.techadict.service;

import com.qnboke04.techadict.dto.response.CartResponse;
import com.qnboke04.techadict.entity.*;
import com.qnboke04.techadict.mapper.CartMapper;
import com.qnboke04.techadict.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static lombok.AccessLevel.PRIVATE;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
@Transactional
public class CartService {

    CartRepository cartRepository;
    CartItemRepository cartItemRepository;
    ProductVariantRepository variantRepository;
    UserRepository userRepository;
    IdGenerator idGenerator;
    CartMapper cartMapper;

    // ✅ Lấy giỏ hàng (tự tạo nếu chưa có)
    public CartResponse getCartByUser(String userId) {
        Carts cart = getOrCreateCart(userId);
        // 🔹 Nạp dữ liệu tránh lazy (variant + product)
        loadVariantRelations(cart);
        return cartMapper.toCartResponse(cart);
    }

    // ✅ Thêm sản phẩm vào giỏ
    public CartResponse addItem(String userId, String variantId, int quantity) {
        Carts cart = getOrCreateCart(userId);

        ProductVariants variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found"));

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(i -> i.getVariant().getId().equals(variantId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            item.setPrice(variant.getPrice().doubleValue() * item.getQuantity());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .id(idGenerator.generate("CITEM"))
                    .cart(cart)
                    .variant(variant)
                    .quantity(quantity)
                    .price(variant.getPrice().doubleValue() * quantity)
                    .build();
            cartItemRepository.save(newItem);
            cart.getItems().add(newItem);
        }

        // 🔹 Load quan hệ đầy đủ trước khi map
        loadVariantRelations(cart);
        return cartMapper.toCartResponse(cartRepository.save(cart));
    }

    // ✅ Cập nhật số lượng sản phẩm
    public CartResponse updateItem(String userId, String variantId, int quantity) {
        Carts cart = getOrCreateCart(userId);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getVariant().getId().equals(variantId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            cart.getItems().remove(item);
        } else {
            item.setQuantity(quantity);
            item.setPrice(item.getVariant().getPrice().doubleValue() * quantity);
            cartItemRepository.save(item);
        }

        loadVariantRelations(cart);
        return cartMapper.toCartResponse(cartRepository.save(cart));
    }

    // ✅ Xóa một item khỏi giỏ
    public CartResponse removeItem(String userId, String variantId) {
        Carts cart = getOrCreateCart(userId);
        List<CartItem> toRemove = cart.getItems().stream()
                .filter(i -> i.getVariant().getId().equals(variantId))
                .toList();

        cartItemRepository.deleteAll(toRemove);
        cart.getItems().removeAll(toRemove);

        loadVariantRelations(cart);
        return cartMapper.toCartResponse(cartRepository.save(cart));
    }

    // ✅ Xóa toàn bộ giỏ
    public CartResponse clearCart(String userId) {
        Carts cart = getOrCreateCart(userId);
        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
        return cartMapper.toCartResponse(cartRepository.save(cart));
    }

    // ✅ Private helper
    private Carts getOrCreateCart(String userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Users user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    Carts newCart = Carts.builder()
                            .id(idGenerator.generate("CART"))
                            .user(user)
                            .build();
                    return cartRepository.save(newCart);
                });
    }

    /**
     * ✅ Đảm bảo mỗi CartItem đã có variant.product được load
     *  (Tránh LazyInitializationException khi mapper truy cập)
     */
    private void loadVariantRelations(Carts cart) {
        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                ProductVariants variant = item.getVariant();
                if (variant != null && variant.getProduct() == null) {
                    variantRepository.findById(variant.getId())
                            .ifPresent(v -> item.setVariant(v)); // reload đầy đủ variant + product
                }
            }
        }
    }
}
