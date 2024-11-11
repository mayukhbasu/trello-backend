package com.trello.board.service;

import com.trello.board.models.Board;
import com.trello.board.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BoardService {

    @Autowired
    private BoardRepository boardRepository;

    public Board createBoard(Board board) {
        return boardRepository.save(board);
    }

    public List<Board> getAllBoards() {
        return boardRepository.findAll();
    }

    public Optional<Board> getBoardById(Long id) {
        return boardRepository.findById(id);
    }

    public Board updateBoard(Long id, Board updatedBoard) {
        return boardRepository.findById(id).map(board -> {
            board.setName(updatedBoard.getName());
            board.setDescription(updatedBoard.getDescription());
            return boardRepository.save(board);
        }).orElseThrow(() -> new RuntimeException("Board not found"));
    }

    public void deleteBoard(Long id) {
        boardRepository.deleteById(id);
    }
}
