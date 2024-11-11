package com.trello.user.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.trello.user.model.Role;
import com.trello.user.repository.RoleRepository;

@Service
public class RoleService {
	
	private final RoleRepository roleRepository;
	
	
	public RoleService(RoleRepository roleRepository) {
		// TODO Auto-generated constructor stub
		this.roleRepository = roleRepository;
	}
	
	public Role createRole(Role role) {
		return this.roleRepository.save(role);
	}
	
	public Role updateRole(Long roleId, Role updatedRole) {
		Optional<Role> existingRole = roleRepository.findById(roleId);
        if (existingRole.isPresent()) {
            Role role = existingRole.get();
            role.setName(updatedRole.getName());
            role.setDescription(updatedRole.getDescription());
            return roleRepository.save(role);
        }
        throw new RuntimeException("Role not found");
	}
	
	
	public List<Role> getAllRoles() {
		return roleRepository.findAll();
	}
	
	public Optional<Role> findRoleById(Long id) {
		return roleRepository.findById(id);
	}

}
