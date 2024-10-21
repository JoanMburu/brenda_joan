from flask import Blueprint
from flask_restful import Api
from app.controllers.job_controller import JobResource, SingleJobResource

job_bp = Blueprint('job', __name__)
api = Api(job_bp)

# Define routes for Job
api.add_resource(JobResource, '/')  # For listing and creating jobs
api.add_resource(SingleJobResource, '/<int:job_id>')  # For fetching, updating, and deleting a specific job