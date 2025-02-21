from dotenv import load_dotenv
from db import get_db, Sequence, Thread
from sqlalchemy.exc import SQLAlchemyError


# load env variables
load_dotenv()


def create_sequence(room, steps=None):
    db = next(get_db())
    # if steps is None:
    #     steps = [{"stepNumber": 1, "message": "Hello world"}]
    try:
        print("Attempting to create a sequence")

        new_sequence = (
            Sequence(thread_id=room, steps=steps) if steps else Sequence(thread_id=room)
        )
        db.add(new_sequence)
        db.commit()
        db.refresh(new_sequence)
        return new_sequence
    except SQLAlchemyError as error:
        print(f"Error creating sequence: {error}")
        db.rollback()  # Rollback the transaction in case of error
        return None


# Update the steps in a given sequence
def update_sequence(id, steps):
    db = next(get_db())
    try:
        db.query(Sequence).filter(Sequence.id == id).update({"steps": steps})
        db.commit()
        updated_sequence = db.query(Sequence).filter(Sequence.id == id).first()
        return updated_sequence
    except SQLAlchemyError as error:
        print(f"Error updating sequence: {error}")
        db.rollback()
        return None


def get_sequence(thread_id):
    db = next(get_db())
    try:
        sequence = db.query(Sequence).filter(Sequence.thread_id == thread_id).first()
        if sequence:
            print(f"DB GET SEQUENCE, RETURNING STEPS: {sequence}")
            return sequence
        else:
            print("DB GET SEQUENCE, RETURNING NONE")
            return None
    except SQLAlchemyError as error:
        print(f"Error getting sequence: {error}")
        return None
