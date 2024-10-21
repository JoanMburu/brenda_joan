from app.repositories.job_repository import JobRepository
from datetime import datetime
from app.services.log_service import LogService

class JobService:
    @staticmethod
    def post_job(data, employer_id):
        """Create a new job for the employer."""
        # Validate required fields
        required_fields = ['title', 'description', 'deadline']
        for field in required_fields:
            if field not in data or not data[field]:
                return {"error": f"'{field}' is required"}, 400

        # Ensure the deadline is a valid date
        try:
            deadline = datetime.strptime(data['deadline'], '%Y-%m-%d')
        except ValueError:
            return {"error": "Invalid date format. Use YYYY-MM-DD."}, 400

        try:
            job = JobRepository.create_job(
                title=data['title'],
                description=data['description'],
                salary=data.get('salary', None),  # Optional field
                deadline=deadline,
                employer_id=employer_id
            )

            # Log the action
            LogService.log_action(f"Job '{job.title}' created by employer ID {employer_id}")

            return job.to_dict(), 201  # Return job as dictionary and status code
        except Exception as e:
            return {"error": f"Failed to create job: {str(e)}"}, 500

    @staticmethod
    def update_job(job_id, data):
        """Update an existing job posting."""
        job = JobRepository.get_job_by_id(job_id)
        if not job:
            return {"error": "Job not found"}, 404

        # Ensure the deadline is valid if provided
        if 'deadline' in data:
            try:
                data['deadline'] = datetime.strptime(data['deadline'], '%Y-%m-%d')
            except ValueError:
                return {"error": "Invalid date format. Use YYYY-MM-DD."}, 400

        try:
            updated_job = JobRepository.update_job(job_id, data)
            if updated_job:
                # Log the action
                LogService.log_action(f"Job '{job.title}' updated by employer ID {job.employer_id}")
                return updated_job.to_dict(), 200  # Return updated job
            return {"error": "Failed to update job"}, 400
        except Exception as e:
            return {"error": f"Failed to update job: {str(e)}"}, 500

    @staticmethod
    def delete_job(job_id):
        """Admin can delete any job by ID."""
        job = JobRepository.get_job_by_id(job_id)
        if not job:
            return {"error": "Job not found"}, 404

        try:
            deleted_job = JobRepository.delete_job(job_id)
            if deleted_job:
                # Log the action
                LogService.log_action(f"Admin deleted job '{job.title}'")
                return {"message": "Job deleted successfully"}, 200
            return {"error": "Failed to delete job"}, 400
        except Exception as e:
            return {"error": f"Failed to delete job: {str(e)}"}, 500

    @staticmethod
    def delete_job_by_employer(job_id, employer_id):
        """Allow employers to delete only their own jobs."""
        # Fetch the job by its ID
        job = JobRepository.get_job_by_id(job_id)

        # Check if the job exists and belongs to the current employer
        if not job:
            return {"msg": "Job not found"}, 404
        if job.employer_id != employer_id:
            return {"msg": "Unauthorized to delete this job"}, 403

        # If the job belongs to the employer, delete it
        try:
            deleted_job = JobRepository.delete_job(job_id)
            if deleted_job:
                # Log the action
                LogService.log_action(f"Employer ID {employer_id} deleted job '{job.title}'")
                return {"message": "Job deleted successfully"}, 200  # Job deleted successfully
            return {"error": "Failed to delete job"}, 400  # Failed to delete job
        except Exception as e:
            raise Exception(f"Failed to delete job: {str(e)}")

    @staticmethod
    def get_job_by_id(job_id):
        """Retrieve a job by its ID."""
        job = JobRepository.get_job_by_id(job_id)
        if job:
            # Log the action
            LogService.log_action(f"Job '{job.title}' viewed")
            return job.to_dict(), 200  # Return job as dictionary
        return {"error": "Job not found"}, 404

    @staticmethod
    def get_all_jobs():
        """Retrieve all jobs."""
        try:
            jobs = JobRepository.get_all_jobs()
            # Log the action
            LogService.log_action("Viewed all jobs")
            return [job.to_dict() for job in jobs], 200  # Return list of jobs as dictionaries
        except Exception as e:
            return {"error": f"Failed to retrieve jobs: {str(e)}"}, 500

    @staticmethod
    def get_jobs_by_employer(employer_id):
        """Retrieve all jobs posted by a specific employer."""
        try:
            jobs = JobRepository.get_jobs_by_employer(employer_id)
            # Log the action
            LogService.log_action(f"Employer ID {employer_id} viewed all their jobs")
            return [job.to_dict() for job in jobs], 200  # Return list of jobs as dictionaries
        except Exception as e:
            return {"error": f"Failed to retrieve employer's jobs: {str(e)}"}, 500
