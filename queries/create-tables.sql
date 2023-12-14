CREATE TABLE users
(
    id          SERIAL PRIMARY KEY,

    yandex_puid BIGINT UNIQUE NOT NULL,
    score       INT
);

CREATE TABLE surveys
(
    id          SERIAL PRIMARY KEY,

    user_id     INT,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,

    title       VARCHAR(128) NOT NULL,
    description VARCHAR(1024),
    is_open     BOOLEAN
);

CREATE TABLE questions
(
    id           SERIAL PRIMARY KEY,

    survey_id    INT,
    FOREIGN KEY (survey_id) REFERENCES surveys (id) ON DELETE CASCADE,

    text         VARCHAR(1024) NOT NULL,
    is_necessary BOOLEAN
);

CREATE TABLE responses
(
    id        SERIAL PRIMARY KEY,

    user_id   INT,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    survey_id INT,
    FOREIGN KEY (survey_id) REFERENCES surveys (id) ON DELETE CASCADE
);

CREATE TABLE answers
(
    id          SERIAL PRIMARY KEY,

    question_id INT,
    FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
    response_id INT,
    FOREIGN KEY (response_id) REFERENCES responses (id) ON DELETE CASCADE,

    value       VARCHAR(1024) NOT NULL
);
