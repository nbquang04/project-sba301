package com.qnboke04.techadict.entity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address extends BaseEntity {

    @Id
    private String id;

    private String fullName;
    private String phone;
    private String detail;
    private String ward;
    private String district;
    private String city;
    private Boolean isDefault;
    @Column(name = "user_id")
    private String userId;

}