from flask import Blueprint
from flask_restful import Api
from app.controllers.employer_controller import EmployerSelfResource, EmployerAdminResource, EmployerRegistrationResource

employer_bp = Blueprint('employer', __name__)
api = Api(employer_bp)

# Routes for employers to manage their own account
api.add_resource(EmployerSelfResource, '/self')  # For employers to get/update their own account

# Get employers
api.add_resource(EmployerAdminResource, '/admin', '/admin/<int:employer_id>')  

# Route for employer registration
api.add_resource(EmployerRegistrationResource, '/register')
