from flask_restful import Resource
from flask_jwt_extended import jwt_required
from app.services.log_service import LogService
from app.utils.authentication import authenticate_admin

class LogResource(Resource):
    @jwt_required()
    @authenticate_admin()  # Ensure only admins can view logs
    def get(self):
        """Get system logs (Admin only)"""
        logs = LogService.get_all_logs()
        return logs, 200