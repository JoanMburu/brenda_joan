from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.job_services import JobService
from app.services.employer_services import EmployerService
from app.utils.authentication import authenticate_admin, authenticate_employer

class JobResource(Resource):
    @jwt_required()
    @authenticate_employer()
    def post(self):
        """Post a new job for the employer."""
        data = request.get_json()

        current_user = get_jwt_identity()
        employer = EmployerService.get_employer_by_id(current_user['id'])
        if not employer:
            return {"msg": "Employer not found"}, 404

        try:
            job, status_code = JobService.post_job(data, employer.id)
            return job, status_code
        except Exception as e:
            return {"error": str(e)}, 500  # Ensure proper error handling and JSON response

    def get(self):
        """Get all jobs."""
        try:
            jobs, status_code = JobService.get_all_jobs()
            return jobs, status_code
        except Exception as e:
            return {"error": str(e)}, 500


class SingleJobResource(Resource):
    @jwt_required()
    @authenticate_employer()
    def put(self, job_id):
        """Update an existing job posting."""
        data = request.get_json()

        current_user = get_jwt_identity()
        employer = EmployerService.get_employer_by_unique_identifier(current_user['email'])
        if not employer:
            return {"msg": "Employer not found"}, 404

        try:
            job, status_code = JobService.update_job(job_id, data)
            if not job:
                return {"msg": "Failed to update job posting"}, 400
            return job, status_code
        except Exception as e:
            return {"error": str(e)}, 500

    @jwt_required()
    def delete(self, job_id):
        """Allow admins to delete any job, and employers to delete their own jobs."""
        current_user = get_jwt_identity()

        # Check if the current user is an employer or an admin
        if current_user['role'] == 'admin':
            # Admin can delete any job
            try:
                success = JobService.delete_job(job_id)
                if not success:
                    return {"msg": "Failed to delete job posting"}, 400
                return {"msg": "Job posting deleted successfully"}, 200
            except Exception as e:
                return {"error": str(e)}, 500
        elif current_user['role'] == 'employer':
            # Employer can only delete jobs they posted
            try:
                employer_id = current_user['id']
                result, status_code = JobService.delete_job_by_employer(job_id, employer_id)
                return result, status_code
            except Exception as e:
                return {"error": str(e)}, 500
        else:
            # Other roles are not allowed to delete jobs
            return {"error": "Unauthorized"}, 403
