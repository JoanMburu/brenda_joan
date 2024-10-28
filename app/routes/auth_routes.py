from flask import Blueprint
from flask_restful import Api
from app.controllers.auth_controller import AuthResource

# Define a Blueprint for authentication
auth_bp = Blueprint('auth_bp', __name__)
auth_api = Api(auth_bp)

# Register the AuthResource to the auth_api
auth_api.add_resource(AuthResource, '/login')

# This blueprint will be registered in the main app
