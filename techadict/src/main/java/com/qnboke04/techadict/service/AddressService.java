package com.qnboke04.techadict.service;

import com.qnboke04.techadict.entity.Address;
import com.qnboke04.techadict.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static lombok.AccessLevel.PRIVATE;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class AddressService {

    AddressRepository addressRepository;
    IdGenerator idGenerator;

    public List<Address> getAllByUser(String userId) {
        return addressRepository.findByUserId(userId);
    }

    public Optional<Address> getById(String id) {
        return addressRepository.findById(id);
    }

    public Address create(Address address) {
        address.setId(idGenerator.generate("ADDR"));
        if (address.getIsDefault() == null)
            address.setIsDefault(false);

        // ✅ đảm bảo userId không null
        if (address.getUserId() == null || address.getUserId().isBlank())
            throw new IllegalArgumentException("UserId is required for address creation.");

        return addressRepository.save(address);
    }

    public Address update(String id, Address update) {
        return addressRepository.findById(id)
                .map(existing -> {
                    existing.setFullName(update.getFullName());
                    existing.setPhone(update.getPhone());
                    existing.setDetail(update.getDetail());
                    existing.setWard(update.getWard());
                    existing.setDistrict(update.getDistrict());
                    existing.setCity(update.getCity());
                    existing.setIsDefault(update.getIsDefault());
                    // ✅ cập nhật userId nếu cần
                    if (update.getUserId() != null) {
                        existing.setUserId(update.getUserId());
                    }
                    return addressRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Address not found with id: " + id));
    }

    public void delete(String id) {
        addressRepository.deleteById(id);
    }
}
