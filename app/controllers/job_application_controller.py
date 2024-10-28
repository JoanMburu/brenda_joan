from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.job_application_service import JobApplicationService

class JobApplicationResource(Resource):

    @jwt_required()
    def post(self, job_id):
        """Member applies for a job"""
        current_user = get_jwt_identity()

        # Ensure that the user is a member
        if current_user['role'] != 'member':
            return {"error": "Only members can apply for jobs"}, 403

        # Get application data (resume, cover letter)
        data = request.get_json()
        resume = data.get('resume')
        cover_letter = data.get('cover_letter')

        # Apply for the job using the service
        return JobApplicationService.apply_for_job(
            member_id=current_user['id'],
            job_id=job_id,
            resume=resume,
            cover_letter=cover_letter
        )