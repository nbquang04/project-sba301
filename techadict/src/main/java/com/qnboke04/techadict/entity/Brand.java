package com.qnboke04.techadict.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Brand extends BaseEntity {

    @Id
    private String id;
    private String name;
    private String country;
    private String logoUrl;

}
