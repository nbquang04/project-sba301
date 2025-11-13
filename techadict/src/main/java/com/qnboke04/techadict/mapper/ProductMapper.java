package com.qnboke04.techadict.mapper;

import com.qnboke04.techadict.dto.request.ProductRequest;
import com.qnboke04.techadict.dto.response.ProductResponse;
import com.qnboke04.techadict.entity.Products;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = { ProductVariantMapper.class })
public interface ProductMapper {
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "brand.name", target = "brandName")
    ProductResponse toProductResponse(Products entity);

    @InheritInverseConfiguration
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "variants", ignore = true)
    Products toProduct(ProductRequest dto);
}
