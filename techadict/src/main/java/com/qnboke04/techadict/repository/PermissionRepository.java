package com.qnboke04.techadict.repository;

import com.qnboke04.techadict.entity.Permissions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.security.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permissions, String> {
}
