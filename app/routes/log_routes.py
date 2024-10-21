from flask import Blueprint
from flask_restful import Api
from app.controllers.log_controller import LogResource

log_bp = Blueprint('log_bp', __name__)
api = Api(log_bp)

# Define the route for fetching logs (for admins only)
api.add_resource(LogResource, '/logs')
