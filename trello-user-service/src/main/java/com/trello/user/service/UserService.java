package com.trello.user.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.trello.user.exception.RoleNotFoundException;
import com.trello.user.exception.UserNotFoundException;
import com.trello.user.model.Role;
import com.trello.user.model.User;
import com.trello.user.repository.RoleRepository;
import com.trello.user.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private RoleRepository roleRepository;
	
	public List<User> getAllUsers() {
		return userRepository.findAll();
	}
	
	public Optional<User> getUserById(Long id) {
		return userRepository.findById(id);
	}
	
	public User createUser(User user) {
		return userRepository.save(user);
	}
	
	public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
	
	@Transactional
    public void assignRole(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User with ID " + userId + " not found"));

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RoleNotFoundException("Role with ID " + roleId + " not found"));

        user.getRoles().add(role);
        userRepository.save(user);
    }

}
