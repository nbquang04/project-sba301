package com.qnboke04.techadict.repository;

import com.qnboke04.techadict.entity.Users;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, String> {
    boolean existsByEmail(String username);
    Optional<Users> findByEmail(String username);
}
