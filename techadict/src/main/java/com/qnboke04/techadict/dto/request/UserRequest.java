package com.qnboke04.techadict.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    private String firstName;
    private String lastName;
    @Email(message = "Invalid email")
    private String email;
    @Size(min = 5, message = "INVALID_PASSWORD")
    private String password;
    private String phone;
    private Set<String> roles;
}
