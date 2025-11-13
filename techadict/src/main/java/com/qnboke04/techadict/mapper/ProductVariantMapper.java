package com.qnboke04.techadict.mapper;
import com.qnboke04.techadict.dto.request.VariantRequest;
import com.qnboke04.techadict.dto.response.VariantResponse;
import com.qnboke04.techadict.entity.ProductVariants;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ProductVariantMapper {
    ProductVariants toEntity(VariantRequest dto);
    VariantResponse toResponse(ProductVariants entity);
}
