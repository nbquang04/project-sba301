package com.qnboke04.techadict.repository;

import com.qnboke04.techadict.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends JpaRepository<Brand, String> {
    boolean existsByName(String name);
}
