import os

from sqlalchemy import ForeignKey, create_engine, Column, Integer, JSON, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from dataclasses import dataclass


load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")

engine = create_engine(DATABASE_URL)
Base = declarative_base()


class Thread(Base):
    __tablename__ = "threads"
    id = Column(String, primary_key=True)


@dataclass
class Sequence(Base):
    __tablename__ = "sequences"
    id = Column(Integer, primary_key=True, autoincrement=True)
    thread_id = Column(String, ForeignKey('threads.id'))
    steps = Column(JSON, default=[{"stepNumber": 1, "message": "Hello world"}])


Base.metadata.create_all(engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
