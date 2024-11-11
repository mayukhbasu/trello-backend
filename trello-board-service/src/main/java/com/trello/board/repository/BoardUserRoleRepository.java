package com.trello.board.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trello.board.models.BoardUserRole;

public interface BoardUserRoleRepository extends JpaRepository<BoardUserRole, Long>  {
	List<BoardUserRole> findByBoardId(Long boardId);
    List<BoardUserRole> findByUserId(Long userId);
}
