package com.qnboke04.techadict.repository;

import com.qnboke04.techadict.entity.Carts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Carts, String> {
    Optional<Carts> findByUserId(String userId);
}
