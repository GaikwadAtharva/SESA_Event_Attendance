import os
import psycopg2
from psycopg2.extras import DictCursor

DATABASE_URL = os.environ.get("DATABASE_URL")


class PostgreSQLCursor:
    def __init__(self, cursor):
        self.cursor = cursor
        self._lastrowid = None

    @property
    def lastrowid(self):
        return self._lastrowid

    def fetchone(self):
        return self.cursor.fetchone()

    def fetchall(self):
        return self.cursor.fetchall()

    def __iter__(self):
        return iter(self.cursor)


class PostgreSQLConnection:
    def __init__(self):
        self.connection = psycopg2.connect(
            DATABASE_URL,
            cursor_factory=DictCursor
        )

    def execute(self, query, params=None):
        query = query.replace("?", "%s")

        cursor = self.connection.cursor()

        is_insert = query.strip().upper().startswith("INSERT")

        if is_insert and "RETURNING" not in query.upper():
            query = query.rstrip(";") + " RETURNING id"

        cursor.execute(query, params)

        wrapped_cursor = PostgreSQLCursor(cursor)

        if is_insert:
            row = cursor.fetchone()

            if row:
                wrapped_cursor._lastrowid = row["id"]

        return wrapped_cursor

    def commit(self):
        self.connection.commit()

    def rollback(self):
        self.connection.rollback()

    def close(self):
        self.connection.close()


def get_db_connection():
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL environment variable is not set")

    return PostgreSQLConnection()


def create_tables():

    connection = get_db_connection()

    # Events
    connection.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            date TEXT NOT NULL,
            description TEXT
        )
    """)

    # Participants
    connection.execute("""
        CREATE TABLE IF NOT EXISTS participants (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            college_id TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL,
            contact TEXT
        )
    """)

    # Attendance
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

    # Organizers
    connection.execute("""
        CREATE TABLE IF NOT EXISTS organizers (
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()
