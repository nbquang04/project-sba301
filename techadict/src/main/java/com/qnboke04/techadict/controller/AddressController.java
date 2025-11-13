package com.qnboke04.techadict.controller;

import com.qnboke04.techadict.dto.request.ApiResponse;
import com.qnboke04.techadict.entity.Address;
import com.qnboke04.techadict.service.AddressService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static lombok.AccessLevel.PRIVATE;

@RestController
@RequestMapping("/addresses")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class AddressController {

    AddressService addressService;

    @GetMapping("/user/{userId}")
    public ApiResponse<List<Address>> getByUser(@PathVariable String userId) {
        return ApiResponse.<List<Address>>builder()
                .result(addressService.getAllByUser(userId))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<Address> getById(@PathVariable String id) {
        return ApiResponse.<Address>builder()
                .result(addressService.getById(id).orElse(null))
                .build();
    }

    @PostMapping
    public ApiResponse<Address> create(@RequestBody Address address) {
        return ApiResponse.<Address>builder()
                .result(addressService.create(address))
                .message("Created successfully")
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<Address> update(@PathVariable String id, @RequestBody Address address) {
        return ApiResponse.<Address>builder()
                .result(addressService.update(id, address))
                .message("Updated successfully")
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable String id) {
        addressService.delete(id);
        return ApiResponse.<String>builder()
                .result("Deleted successfully")
                .build();
    }
}
