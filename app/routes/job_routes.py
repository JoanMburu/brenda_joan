from flask import Blueprint
from flask_restful import Api
from app.controllers.job_controller import JobResource, SingleJobResource, MemberJobListResource
from app.controllers.job_application_controller import JobApplicationResource

job_bp = Blueprint('job', __name__)
api = Api(job_bp)

# Define routes for Job
api.add_resource(JobResource, '/')  # For listing and creating jobs
api.add_resource(SingleJobResource, '/<int:job_id>')  # For fetching, updating, and deleting a specific job
api.add_resource(JobApplicationResource, '/<int:job_id>/apply')  # Member applies for job

# Endpoint for members to view all jobs with application status
api.add_resource(MemberJobListResource, '/member/jobs')