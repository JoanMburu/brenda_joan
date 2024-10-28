from app.models.job_application import JobApplication
from app import db
from app.models.job import Job

class JobApplicationRepository:
    @staticmethod
    def create_application(member_id, job_id, resume, cover_letter):
        new_application = JobApplication(
            member_id=member_id,
            job_id=job_id,
            resume=resume,
            cover_letter=cover_letter
        )
        db.session.add(new_application)
        db.session.commit()
        return new_application

    @staticmethod
    def get_application_by_member_and_job(member_id, job_id):
        return JobApplication.query.filter_by(member_id=member_id, job_id=job_id).first()
    

    @staticmethod
    def get_applications_by_member(member_id):
        """Retrieve all applications made by a specific member, including job titles."""
        # Query to join JobApplication with Job to fetch job titles
        applications = (
            db.session.query(JobApplication, Job.title.label("job_title"))
            .join(Job, JobApplication.job_id == Job.id)
            .filter(JobApplication.member_id == member_id)
            .all()
        )