package com.trello.board.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import com.trello.board.models.BoardUserRole;
import com.trello.board.repository.BoardUserRoleRepository;

@Service
public class BoardRoleService {
	
	private static final Logger logger = LoggerFactory.getLogger(BoardRoleService.class);

	private final BoardUserRoleRepository boardUserRoleRepository;
	private final RestTemplate restTemplate;

	public BoardRoleService(BoardUserRoleRepository boardUserRoleRepository, RestTemplate restTemplate) {
        this.boardUserRoleRepository = boardUserRoleRepository;
        this.restTemplate = restTemplate;
    }
	
	public BoardUserRole assignRoleToUser(Long boardId, Long userId, Long roleId) {
		String roleUrl = "http://localhost:8080/api/roles/" + roleId;
		logger.info("Attempting to assign role with ID {} to user with ID {} on board with ID {}", roleId, userId, boardId);
		
		try {
			Object roleResponse = restTemplate.getForObject(roleUrl, Object.class);
			if (roleResponse == null) {
	            logger.error("Invalid role ID: {}", roleId);
	            throw new IllegalArgumentException("Invalid role ID");
	        }
		} catch (HttpClientErrorException e) {
			logger.error("Error fetching role from URL {}: {}", roleUrl, e.getMessage());
			throw new IllegalArgumentException("Invalid role ID");
		}

		BoardUserRole boardUserRole = new BoardUserRole();
        boardUserRole.setId(boardId);
        boardUserRole.setUserId(userId);
        boardUserRole.setRoleId(roleId);
        
        BoardUserRole savedRole = boardUserRoleRepository.save(boardUserRole);
        logger.info("Successfully assigned role ID {} to user ID {} on board ID {}", roleId, userId, boardId);
        
        return savedRole;
	}
	
	public List<BoardUserRole> getRolesForBoard(Long boardId) {
		logger.info("Fetching roles for board with ID {}", boardId);
		return boardUserRoleRepository.findByBoardId(boardId);
	}
	
	public List<BoardUserRole> getRolesForUser(Long userId) {
		logger.info("Fetching roles for user with ID {}", userId);
		return boardUserRoleRepository.findByUserId(userId);
	}
}
