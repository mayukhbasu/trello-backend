package com.trello.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trello.user.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}