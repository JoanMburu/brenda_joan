from app.models.employer import Employer
from app.repositories.employer_repository import EmployerRepository
from app import db
from app.services.log_service import LogService

class EmployerService:
    @staticmethod
    def get_employer_by_unique_identifier(identifier):
        """Retrieve the employer based on a unique identifier like email."""
        employer = EmployerRepository.find_by_identifier(identifier)
        return employer.to_dict() if employer else None  # Return as dictionary

    @staticmethod
    def register_employer(data):
        """Register a new employer based on provided data."""
        required_fields = ['company_name', 'email', 'phone', 'password', 'about']
        for field in required_fields:
            if field not in data or not data[field]:
                return {"error": f"'{field}' is required"}, 400

        # Check if the email or phone is already in use
        if EmployerRepository.find_by_email_or_phone(data['email'], data['phone']):
            return {"error": "Email or Phone already exists"}, 400

        try:
            # Create the new employer instance without directly setting `password`
            new_employer = Employer(
                company_name=data['company_name'],
                email=data['email'],
                phone=data['phone'],
                about=data['about']
            )
            new_employer.set_password(data['password'])  # Ensure password is hashed
        
            # Save the employer to the database
            EmployerRepository.save(new_employer)

            # Log the action
            LogService.log_action(f"Employer '{new_employer.company_name}' registered by admin")

            return {"message": "Employer registered successfully", "employer": new_employer.to_dict()}, 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

    @staticmethod
    def update_employer(employer_id, data):
        """Update an employer's details."""
        employer = EmployerRepository.find_by_id(employer_id)
        if not employer:
            return None
        
        employer.company_name = data.get('company_name', employer.company_name)
        employer.email = data.get('email', employer.email)
        employer.phone = data.get('phone', employer.phone)
        employer.about = data.get('about', employer.about)
        
        try:
            updated_employer = EmployerRepository.save(employer)      
            return updated_employer.to_dict()  # Return as dictionary
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

    @staticmethod
    def delete_employer(employer_id):
        """Delete an employer account."""
        employer = EmployerRepository.find_by_id(employer_id)
        if not employer:
            return {"error": "Employer not found"}, 404
        
        try:
            EmployerRepository.delete(employer_id)  # Pass employer_id here instead of employer object
            LogService.log_action(f"Employer '{employer.company_name}' deleted by admin")
            return {"message": "Employer account deleted successfully"}, 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

    @staticmethod
    def get_all_employers():
        """Get all employers."""
        try:
            employers = EmployerRepository.get_all_employers()
            LogService.log_action("Admin viewed all employers")
            return [employer.to_dict() for employer in employers]
        except Exception as e:
            return {"error": str(e)}, 500

    @staticmethod
    def get_employer_by_id(employer_id):
        """Get an employer by ID."""
        employer = EmployerRepository.get_employer_by_id(employer_id)
        if not employer:
            return {"error": "Employer not found"}, 404
        
        LogService.log_action(f"Admin viewed employer '{employer.company_name}'")
        return employer.to_dict()

    @staticmethod
    def create_employer(data):
        """Create a new employer- admin."""
        required_fields = ['company_name', 'email', 'phone', 'password', 'about']
        for field in required_fields:
            if field not in data or not data[field]:
                return {"error": f"'{field}' is required"}, 400

        # Check if the email or phone is already in use
        if EmployerRepository.find_by_email_or_phone(data['email'], data['phone']):
            return {"error": "Email or Phone already exists"}, 400

        try:
            # Create the new employer instance
            new_employer = Employer(
                company_name=data['company_name'],
                email=data['email'],
                phone=data['phone'],
                about=data['about']
            )
            new_employer.set_password(data['password'])  # Hash the password

            # Save the employer to the database
            EmployerRepository.save(new_employer)

            # Log the action
            LogService.log_action(f"Admin created employer {new_employer.company_name}")

            return {"message": "Employer created successfully", "employer": new_employer.to_dict()}, 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
