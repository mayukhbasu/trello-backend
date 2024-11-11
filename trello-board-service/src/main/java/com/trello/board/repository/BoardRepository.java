package com.trello.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trello.board.models.Board;

public interface BoardRepository extends JpaRepository<Board, Long> {
}
