from app.repositories.job_application_repository import JobApplicationRepository
from app.repositories.job_repository import JobRepository
from app.repositories.member_repository import MemberRepository
from app.services.log_service import LogService

class JobApplicationService:

    @staticmethod
    def apply_for_job(member_id, job_id, resume, cover_letter):
        # Ensure the job exists
        job = JobRepository.get_job_by_id(job_id)
        if not job:
            return {"error": "Job not found"}, 404

        # Ensure the member exists
        member = MemberRepository.get_member_by_id(member_id)
        if not member:
            return {"error": "Member not found"}, 404

        # Check if the member has already applied for this job
        existing_application = JobApplicationRepository.get_application_by_member_and_job(member_id, job_id)
        if existing_application:
            return {"error": "You have already applied for this job"}, 400

        # Validate completeness of application data
        if not resume or not cover_letter:
            return {"error": "Both resume and cover letter are required"}, 400

        # Create a new job application
        application = JobApplicationRepository.create_application(member_id, job_id, resume, cover_letter)

        # Log the application
        LogService.log_action(f"Member {member.email} applied for job {job.title}")

        # Send email notification (simplified for demonstration)
        # In practice, you'd integrate with an email service provider
        JobApplicationService.notify_employer_and_member(member, job)

        return {"message": "Application submitted successfully", "application": application.to_dict()}, 201

    @staticmethod
    def notify_employer_and_member(member, job):
        # Mock notification function (replace with actual email sending)
        print(f"Email sent to Employer ({job.employer.email}) - {member.name} applied for {job.title}")
        print(f"Email sent to Member ({member.email}) - You applied for {job.title}")