# auth_controller.py

from flask import request, Blueprint
from flask_restful import Resource, Api
from app.models.member import Member
from app.models.employer import Employer
from flask_jwt_extended import create_access_token
from app.services.employer_services import EmployerService
from werkzeug.exceptions import BadRequest

auth_bp = Blueprint('auth_bp', __name__)
auth_api = Api(auth_bp)

class AuthResource(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Authenticate as either member or employer
        user = Member.query.filter_by(email=email).first() or Employer.query.filter_by(email=email).first()

        if user and user.check_password(password):
            # Generate access token
            access_token = create_access_token(identity={"id": user.id, "role": user.role})
            
            # Return token, id, role, and name (if member)
            return {
                "access_token": access_token,
                "id": user.id,
                "role": user.role,
                "name": getattr(user, 'name', None)  # Return name if available (for members)
            }, 200

        return {"error": "Invalid credentials"}, 401

# Register the AuthResource to the API
auth_api.add_resource(AuthResource, '/login')
