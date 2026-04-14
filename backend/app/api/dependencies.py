import os

from neo4j import AsyncGraphDatabase

from app.db.session import SessionLocal


async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_neo4j():
    uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    user = os.getenv("NEO4J_USER", "neo4j")
    password = os.getenv("NEO4J_PASSWORD", "password")
    driver = AsyncGraphDatabase.driver(uri, auth=(user, password))
    try:
        yield driver
    finally:
        await driver.close()


def verify_iam_seal() -> str:
    # Placeholder hook for ADR-0001 IAM policy integration.
    return "director-verified"
