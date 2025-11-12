-- 초기 데이터베이스 설정
CREATE DATABASE IF NOT EXISTS app;
USE app;

-- User 테이블: 사용자 기본 정보
CREATE TABLE IF NOT EXISTS User (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    nickname VARCHAR(50),
    profile_image VARCHAR(255),
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- UserAccount 테이블: 사용자 계정 상세 정보
CREATE TABLE IF NOT EXISTS UserAccount (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    email VARCHAR(100),
    password VARCHAR(255),
    provider ENUM('LOCAL', 'GOOGLE', 'KAKAO', 'NAVER', 'GITHUB') DEFAULT 'LOCAL',
    provider_id VARCHAR(255),
    refresh_token TEXT,
    last_login_at TIMESTAMP NULL,
    login_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    UNIQUE KEY unique_provider_account (user_id, provider),
    UNIQUE KEY unique_email (email),
    INDEX idx_provider_id (provider_id), 
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- UserVisit 테이블: 사용자 방문 기록
CREATE TABLE IF NOT EXISTS UserVisit (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(255),
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_visited_at (visited_at),
    INDEX idx_ip_address (ip_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Board 테이블: 게시글
CREATE TABLE IF NOT EXISTS Board (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    board_type ENUM('GENERAL', 'NOTICE', 'QNA', 'GALLERY') DEFAULT 'GENERAL',
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    is_notice BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_board_type (board_type),
    INDEX idx_created_at (created_at),
    INDEX idx_is_notice (is_notice),
    INDEX idx_is_deleted (is_deleted),
    FULLTEXT INDEX ft_title_content (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BoardComment 테이블: 댓글
CREATE TABLE IF NOT EXISTS BoardComment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    board_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    parent_id BIGINT NULL,
    content TEXT NOT NULL,
    like_count INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES Board(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES BoardComment(id) ON DELETE CASCADE,
    INDEX idx_board_id (board_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_created_at (created_at),
    INDEX idx_is_deleted (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BoardImage 테이블: 게시글 이미지
CREATE TABLE IF NOT EXISTS BoardImage (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    board_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_name VARCHAR(255),
    image_size INT,
    mime_type VARCHAR(50),
    order_num INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES Board(id) ON DELETE CASCADE,
    INDEX idx_board_id (board_id),
    INDEX idx_order_num (order_num)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 초기 데이터 삽입

-- 테스트 사용자 생성 (비밀번호: password123 - 실제로는 해시처리 필요)
INSERT INTO User (username, nickname, status) VALUES 
('admin', '관리자', 'ACTIVE'),
('user1', '사용자1', 'ACTIVE'),
('user2', '사용자2', 'ACTIVE');

-- 사용자 계정 정보
INSERT INTO UserAccount (user_id, email, password, provider, login_count) VALUES 
(1, 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LOCAL', 0),
(2, 'user1@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LOCAL', 0),
(3, 'user2@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LOCAL', 0);

-- 샘플 게시글
INSERT INTO Board (user_id, title, content, board_type, is_notice) VALUES 
(1, '게시판 서비스 오픈 안내', '안녕하세요. 새로운 게시판 서비스가 오픈되었습니다.', 'NOTICE', TRUE),
(2, '첫 번째 자유 게시글', 'Docker Compose로 구성한 환경입니다.', 'GENERAL', FALSE),
(3, '안녕하세요!', '반갑습니다. 자유게시판에 첫 글을 남깁니다.', 'GENERAL', FALSE),
(2, 'Next.js와 MySQL 연동 방법', 'Next.js에서 MySQL을 어떻게 연동하나요?', 'QNA', FALSE);

-- 샘플 댓글
INSERT INTO BoardComment (board_id, user_id, content) VALUES 
(2, 1, '좋은 글 감사합니다!'),
(2, 3, '도움이 되었습니다.'),
(4, 1, 'Prisma나 TypeORM을 사용하시면 편리합니다.');
