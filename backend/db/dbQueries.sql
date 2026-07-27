-- create users table
CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    uid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    fullname TEXT NOT NULL,
    email VARCHAR(250) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    inserted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)

-- create table session
CREATE TABLE IF NOT EXISTS sessions(
    sid VARCHAR(255) PRIMARY KEY,
    user_id INT UNIQUE,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL,
    inserted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
)

-- create table expensecategories
CREATE TABLE IF NOT EXISTS expensecategories(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    inserted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_category UNIQUE (user_id, name)
)

-- create userexpense table
CREATE TABLE IF NOT EXISTS userexpense(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INT NOT NULL,
    entity VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    paid_on DATE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    transaction_id VARCHAR(100) NOT NULL,
    inserted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(category_id) REFERENCES expensecategories(id) ON DELETE CASCADE
)

-- create userincome table
CREATE TABLE IF NOT EXISTS userincome (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INT NOT NULL,
    entity VARCHAR(255) NOT NULL,
    amount NUMERIC(19, 2) NOT NULL,
    transaction_id VARCHAR(100) NOT NULL, 
    received_on DATE NOT NULL,
    inserted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
)