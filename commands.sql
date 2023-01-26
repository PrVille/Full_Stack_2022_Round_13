CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES ('Default Zero', 'www.zero-likes.com', 'No Likes');
INSERT INTO blogs (author, url, title, likes) VALUES ('Likes', 'www.i-have-likes.com', 'Likes', 5);