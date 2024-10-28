from app.models.job_application import JobApplication
from app import db

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
        # Query to fetch all applications made by a specific member
        return JobApplication.query.filter_by(member_id=member_id).all()