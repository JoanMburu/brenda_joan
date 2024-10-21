
from app.models.employer import Employer
from app import db

class EmployerRepository:
    @staticmethod
    def find_by_identifier(identifier):
        """Find an employer by a unique identifier like email or username."""
        return Employer.query.filter_by(email=identifier).first()

    @staticmethod
    def find_by_id(employer_id):
        """Find an employer by their ID."""
        return Employer.query.get(employer_id)

    @staticmethod
    def save(employer):
        """Save an employer to the database."""
        db.session.add(employer)
        db.session.commit()
        return employer
    
    @staticmethod
    def create_employer(employer):
        db.session.add(employer)
        db.session.commit()

    @staticmethod
    def get_all_employers():
        return Employer.query.all()

    @staticmethod
    def get_employer_by_id(id):
        return Employer.query.get(id)

    @staticmethod
    def update_employer():
        db.session.commit()

    @staticmethod
    def find_by_email_or_phone(email, phone):
        return Employer.query.filter((Employer.email == email) | (Employer.phone == phone)).first()

    @staticmethod
    def delete(employer_id):
        """Delete an employer by their ID."""
        employer = EmployerRepository.find_by_id(employer_id)
        if employer:
            db.session.delete(employer)
            db.session.commit()
            return {"message": "Employer deleted successfully"}, 204  
        else:
            return {"message": "Employer not found"}, 404