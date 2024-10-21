from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.employer_services import EmployerService
from app.utils.authentication import authenticate_admin, authenticate_employer
from app.models.employer import Employer
from app import db 
from datetime import datetime
from app.services.log_service import LogService

class EmployerRegistrationResource(Resource):
    def post(self):
        """Register a new employer"""
        data = request.get_json()  # Get the JSON data from the request
        return EmployerService.register_employer(data)

class EmployerSelfResource(Resource):
    @jwt_required()
    @authenticate_employer()
    def get(self):
        """Get the current employer's own details."""
        current_user = get_jwt_identity()
        employer = EmployerService.get_employer_by_unique_identifier(current_user['email'])
        if not employer:
            return {"error": "Employer not found"}, 404
        return employer, 200

    @jwt_required()
    @authenticate_employer()
    def put(self):
        """Update the current employer's own details."""
        data = request.get_json()
        current_user = get_jwt_identity()
        employer = EmployerService.get_employer_by_unique_identifier(current_user['email'])
        if not employer:
            return {"error": "Employer not found"}, 404

        updated_employer = EmployerService.update_employer(employer['id'], data)
        if not updated_employer:
            return {"error": "Failed to update employer details"}, 400
        return updated_employer, 200


class EmployerAdminResource(Resource):
    # @jwt_required() 
    # @authenticate_admin() 
    # def get(self):
    #     """Get all employers (Admin only)"""
    #     employers, status_code = EmployerService.get_all_employers()
    #     return employers, status_code
    
    @jwt_required()
    @authenticate_admin()
    def get(self, employer_id=None):
        """Admin gets an employer account by ID or all employers if no ID is provided."""
        if employer_id is None:
            # Get all employers from the service
            employers = Employer.query.all()
            # Ensure that employers is a list of Employer objects
            LogService.log_action("Admin viewed all employers")
            return [employer.to_dict() for employer in employers], 200  # Serialize each employer
        else:
            employer = EmployerService.get_employer_by_id(employer_id)
            if employer:
                LogService.log_action(f"Admin viewed employer {employer_id}")
                return employer.to_dict(), 200  # Serialize the specific employer
            else:
                return {'message': 'Employer not found'}, 404  # Handle not found case

    @jwt_required()
    @authenticate_admin()
    def post(self):
        """Admin creates a new employer."""
        data = request.get_json()
        new_employer = EmployerService.create_employer(data)
        if new_employer:
            return new_employer, 201
        return {"error": "Failed to create employer"}, 400

    @jwt_required()
    @authenticate_admin()
    def put(self, employer_id):
        data = request.get_json()
        employer = Employer.query.get(employer_id)
        
        if not employer:
            return {"message": "Employer not found"}, 404
        
        # Check if the email is being updated
        new_email = data.get('email', employer.email)  # Get new email or current email
        if new_email != employer.email:  # Only check if email is being changed
            existing_employer = Employer.query.filter_by(email=new_email).first()
            if existing_employer and existing_employer.id != employer_id:
                return {"message": "Email already in use by another employer"}, 400
        
        # Update the employer's details
        employer.company_name = data.get('company_name', employer.company_name)
        employer.email = data.get('email', employer.email)
        employer.phone = data.get('phone', employer.phone)
        employer.about = data.get('about', employer.about)
        employer.updated_at = datetime.utcnow()  # Ensure to import datetime if you haven't already

        LogService.log_action(f"Admin updated employer {employer.company_name}")

        try:
            db.session.commit()
            return {"message": "Employer updated successfully"}, 200
        except Exception as e:
            db.session.rollback()  # Rollback in case of error
            return {"message": "Error updating employer", "error": str(e)}, 500

    @jwt_required()
    @authenticate_admin()
    def delete(self, employer_id):
        """Admin deletes an employer account."""
        return EmployerService.delete_employer(employer_id)
