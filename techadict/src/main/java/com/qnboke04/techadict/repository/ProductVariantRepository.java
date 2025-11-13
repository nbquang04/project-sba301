package com.qnboke04.techadict.repository;

import com.qnboke04.techadict.entity.ProductVariants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariants,String> {
}
