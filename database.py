import os
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.environ.get("DATABASE_URL")


def get_db_connection():
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL environment variable is not set")

    connection = psycopg2.connect(
        DATABASE_URL,
        cursor_factory=RealDictCursor
    )

    return connection


def create_tables():

    connection = get_db_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            date TEXT NOT NULL,
            description TEXT
        )
    """)

    connection.execute("""
        CREATE TABLE IF NOT EXISTS participants (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            college_id TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL,
            contact TEXT
        )
    """)

    connection.execute("""
        CREATE TABLE IF NOT EXISTS attendance (
            id SERIAL PRIMARY KEY,
            event_id INTEGER NOT NULL,
            participant_id INTEGER NOT NULL,
            status TEXT NOT NULL DEFAULT 'Absent',
            registration_token TEXT,
            FOREIGN KEY (event_id) REFERENCES events(id),
            FOREIGN KEY (participant_id) REFERENCES participants(id),
            UNIQUE (event_id, participant_id)
        )
    """)

    connection.execute("""
        CREATE TABLE IF NOT EXISTS organizers (
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()
