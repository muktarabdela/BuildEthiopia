-- Users Table
create table public.profiles (
  id uuid not null,
  name text null,
  bio text null,
  github_url text null,
  linkedin_url text null,
  contact_visible boolean null default false,
  profile_picture text null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
  username text null,
  telegram_url text null,
  email text null,
  is_verify_email boolean null default false,
  constraint profiles_pkey primary key (id),
  constraint profiles_email_key unique (email),
  constraint profiles_username_key unique (username),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

-- Projects Table
create table public.projects (
  id uuid not null default extensions.uuid_generate_v4 (),
  title text not null,
  description text not null,
  category text not null,
  post_content text not null,
  images text[] null,
  logo_url text null,
  youtube_video_url text null,
  tech_stack text[] null,
  github_url text null,
  live_url text null,
  developer_id uuid not null,
  upvotes_count integer null default 0,
  comments_count integer null default 0,
  is_open_source boolean null default true,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint projects_pkey primary key (id),
  constraint projects_developer_id_fkey foreign KEY (developer_id) references profiles (id) on delete CASCADE
) TABLESPACE pg_default;

-- Votes Table
create table public.upvotes (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  project_id uuid null,
  constraint upvotes_pkey primary key (id),
  constraint upvotes_user_id_project_id_key unique (user_id, project_id),
  constraint upvotes_user_id_fkey foreign KEY (user_id) references profiles (id) on delete CASCADE
) TABLESPACE pg_default;

-- Comments Table
create table public.comments (
  id serial not null,
  project_id uuid not null,
  user_id uuid not null,
  content text not null,
  created_at timestamp with time zone null default now(),
  constraint comments_pkey primary key (id),
  constraint comments_project_id_fkey foreign KEY (project_id) references projects (id) on delete CASCADE,
  constraint comments_user_id_fkey foreign KEY (user_id) references profiles (id)
) TABLESPACE pg_default;


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

-- Featured Projects Table
CREATE TABLE featured_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    featured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
    UNIQUE (project_id)
);

-- Add index for efficient querying
CREATE INDEX idx_featured_projects_expires ON featured_projects(expires_at);
CREATE INDEX idx_featured_projects_project ON featured_projects(project_id);

-- Remove featured column from projects table
ALTER TABLE projects DROP COLUMN IF EXISTS featured;
