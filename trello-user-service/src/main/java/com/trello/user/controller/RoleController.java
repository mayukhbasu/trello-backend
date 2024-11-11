package com.trello.user.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trello.user.model.Role;
import com.trello.user.service.RoleService;
import com.trello.user.service.UserService;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

	private final RoleService roleService;

	
	public RoleController(RoleService roleService, UserService userService) {
		// TODO Auto-generated constructor stub
		this.roleService = roleService;
	}
	
	@PostMapping
	public ResponseEntity<Role> createRole(@RequestBody Role role) {
		Role createdRole = roleService.createRole(role);
		return ResponseEntity.ok(createdRole);
	}
	
	@PutMapping("/{roleId}")
    public ResponseEntity<Role> updateRole(@PathVariable Long roleId, @RequestBody Role updatedRole) {
        Role role = roleService.updateRole(roleId, updatedRole);
        return ResponseEntity.ok(role);
    }
	
	@GetMapping
	public ResponseEntity<List<Role>> getAllRoles() {
		return ResponseEntity.ok(roleService.getAllRoles());
	}
	@GetMapping("/{roleId}")
	public ResponseEntity<Optional<Role>> findRoleByID(@PathVariable("roleId") Long id) {
		return ResponseEntity.ok(roleService.findRoleById(id));
	}

}
