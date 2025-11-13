package com.qnboke04.techadict.service;

import com.qnboke04.techadict.dto.request.AuthenticationRequest;
import com.qnboke04.techadict.dto.request.IntrospectRequest;
import com.qnboke04.techadict.dto.request.LogoutRequest;
import com.qnboke04.techadict.dto.request.UserRequest;
import com.qnboke04.techadict.dto.response.AuthenticationResponse;
import com.qnboke04.techadict.dto.response.IntrospectResponse;
import com.qnboke04.techadict.entity.InvalidatedToken;
import com.qnboke04.techadict.entity.Roles;
import com.qnboke04.techadict.entity.Users;
import com.qnboke04.techadict.exception.AppException;
import com.qnboke04.techadict.exception.ErrorCode;
import com.qnboke04.techadict.repository.InvalidatedRepository;
import com.qnboke04.techadict.repository.RoleRepository;
import com.qnboke04.techadict.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    UserRepository userRepository;
    InvalidatedRepository invalidatedRepository;
    private final RoleRepository roleRepository;
    private final IdGenerator idGenerator;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    // ✅ Kiểm tra token hợp lệ
    public IntrospectResponse introspect(IntrospectRequest request)
            throws JOSEException, ParseException {
        var token = request.getToken();
        boolean valid = true;
        try {
            verifyToken(token);
        } catch (AppException e) {
            valid = false;
        }

        return IntrospectResponse.builder()
                .valid(valid)
                .build();
    }

    // ✅ Đăng nhập -> sinh token
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!authenticated)
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        var token = generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    // ✅ Đăng xuất -> lưu token vào danh sách vô hiệu hóa
    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        var signToken = verifyToken(request.getToken());
        String jid = signToken.getJWTClaimsSet().getJWTID();
        Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(jid)
                .expiryTime(expiryTime)
                .build();

        invalidatedRepository.save(invalidatedToken);
    }

    // ✅ Kiểm tra token có hợp lệ không
    private SignedJWT verifyToken(String token) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        boolean verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date()))) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        if (invalidatedRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return signedJWT;
    }

    // ✅ Sinh token JWT mới
    private String generateToken(Users user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer("techadict.com")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    // ✅ Tạo scope từ Roles & Permissions
    private String buildScope(Users user) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions())) {
                    role.getPermissions().forEach(permission ->
                            stringJoiner.add(permission.getName()));
                }
            });
        }
        return stringJoiner.toString();
    }

    public AuthenticationResponse register(UserRequest request) {
        // Kiểm tra email tồn tại
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        // Mã hóa password
        var passwordEncoder = new BCryptPasswordEncoder(10);

        // Xử lý roles
        Set<Roles> roles = new HashSet<>();
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            request.getRoles().forEach(roleName ->
                    roleRepository.findById(roleName).ifPresent(roles::add)
            );
        } else {
            // Nếu không gửi roles, gán mặc định là ROLE_USER
            roleRepository.findById("USER").ifPresent(roles::add);
        }

        // Tạo user mới
        var user = Users.builder()
                .id(idGenerator.generate("USER"))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .roles(roles)
                .build();

        userRepository.save(user);

        return AuthenticationResponse.builder()
                .authenticated(true)
                .build();
    }
}
