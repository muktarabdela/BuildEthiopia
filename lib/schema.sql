-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Stored securely (hashed)
    name TEXT NOT NULL,
    bio TEXT,
    profile_picture TEXT,
    github_link TEXT,
    linkedin_link TEXT,
    role TEXT CHECK (role IN ('user', 'moderator', 'admin')) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Projects Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[],
    live_demo_link TEXT,
    github_link TEXT,
    cover_image TEXT,
    tags TEXT[],
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Votes Table
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    vote_type TEXT CHECK (vote_type IN ('upvote', 'downvote')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, project_id) -- Ensures a user can vote only once per project
);

-- Comments Table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For threaded comments
    content TEXT NOT NULL,
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Comment Votes Table
CREATE TABLE comment_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    vote_type TEXT CHECK (vote_type IN ('upvote', 'downvote')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, comment_id)
);

-- Portfolios Table
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, project_id) -- Prevents duplicate entries in portfolio
);

-- Saved Projects Table
CREATE TABLE saved_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, project_id)
);

-- Authentication (Using Better Auth, separate users table required)

-- Indexes for Performance
CREATE INDEX idx_projects_tech_stack ON projects USING GIN (tech_stack);
CREATE INDEX idx_projects_tags ON projects USING GIN (tags);
CREATE INDEX idx_comments_project_id ON comments(project_id);
CREATE INDEX idx_users_email ON users(email);

-- Triggers for vote updates
CREATE FUNCTION update_project_votes() RETURNS TRIGGER AS $$
BEGIN
    UPDATE projects
    SET upvotes = (SELECT COUNT(*) FROM votes WHERE project_id = NEW.project_id AND vote_type = 'upvote'),
        downvotes = (SELECT COUNT(*) FROM votes WHERE project_id = NEW.project_id AND vote_type = 'downvote')
    WHERE id = NEW.project_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_project_votes
AFTER INSERT OR DELETE OR UPDATE ON votes
FOR EACH ROW EXECUTE FUNCTION update_project_votes();
