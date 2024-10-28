from app.models.member import Member
from app.repositories.member_repository import MemberRepository
from werkzeug.exceptions import BadRequest
from app.services.log_service import LogService
from app.repositories.job_application_repository import JobApplicationRepository
from app.repositories.saved_jobs_repository import SavedJobsRepository

class MemberService:
    @staticmethod
    def create_member(name, phone, email, password, role='member'):
        """ Create a new member with validation and logic for assigning roles """
        # Check if the email or phone already exists
        if Member.query.filter_by(phone=phone).first():
            raise BadRequest("Phone number already exists")
        if Member.query.filter_by(email=email).first():
            raise BadRequest("Email already exists")

        # Create new member
        new_member = Member(name=name, phone=phone, email=email, role=role)
        new_member.set_password(password)
        
        # Save the new member to the database
        MemberRepository.save(new_member)

        # Log the action
        LogService.log_action(f"New member '{new_member.name}' registered")

        return new_member

    @staticmethod
    def update_member(member, name=None, phone=None, email=None):
        """ Update member's information """
        if name:
            member.name = name
        if phone:
            # Check if the phone number already exists
            if Member.query.filter_by(phone=phone).first():
                raise BadRequest("Phone number already exists")
            member.phone = phone
        if email:
            # Check if the email already exists
            if Member.query.filter_by(email=email).first():
                raise BadRequest("Email already exists")
            member.email = email

        # Save updated member to the database
        MemberRepository.save(member)

        # Log the action
        LogService.log_action(f"Admin updated member '{member.name}'")
        return member

    @staticmethod
    def soft_delete_member(member):
        """ Soft delete a member by setting is_active=False """
        if not member.is_active:
            raise BadRequest("Member is already soft-deleted")
        
        member.is_active = False
        # Save the updated member
        MemberRepository.save(member)
        # Log the action
        LogService.log_action(f"Admin soft-deleted member '{member.name}'")
        return member

    @staticmethod
    def restore_member(member):
        """ Restore a soft-deleted member """
        if member.is_active:
            raise BadRequest("Member is already active")

        member.is_active = True
        # Save the restored member
        MemberRepository.save(member)
        # Log the action
        LogService.log_action(f"Admin restored member '{member.name}'")
        return member

    @staticmethod
    def change_role(member, new_role):
        """ Change a member's role """
        if new_role not in Member.get_all_roles():
            raise BadRequest("Invalid role")

        # Update the role
        member.role = new_role
        MemberRepository.save(member)
        # Log the action
        LogService.log_action(f"Admin changed role of '{member.name}' to '{new_role}'")
        return member

    @staticmethod
    def get_all_members():
        """ Get all active members """
        members = MemberRepository.get_all_active_members()
        # Log the action
        LogService.log_action("Admin viewed all active members")
        return [member.to_dict() for member in members]

    @staticmethod
    def get_inactive_members():
        """ Get all inactive (soft-deleted) members """
        members = MemberRepository.get_all_inactive_members()
        # Log the action
        LogService.log_action("Admin viewed all inactive members")
        return [member.to_dict() for member in members]

    @staticmethod
    def get_member_by_id(member_id):
        """ Get a specific member by their ID """
        member = MemberRepository.get_member_by_id(member_id)
        if not member:
            raise BadRequest(f"Member with ID {member_id} not found")

        # Log the action before converting the member object to a dictionary
        LogService.log_action(f"{member.name} viewed his profile")

        return member.to_dict()  # Convert to dictionary after logging
    
    @staticmethod
    def get_saved_jobs_by_member(member_id):
        """Fetch saved jobs for a specific member."""
        LogService.log_action(f"Fetching saved jobs for member ID {member_id}")
        saved_jobs = SavedJobsRepository.get_saved_jobs_by_member(member_id)
        if not saved_jobs:
            LogService.log_action("No saved jobs found")
        return [job.to_dict() for job in saved_jobs] if saved_jobs else []

    @staticmethod
    def get_applications(member_id):
        """Fetch job applications for a specific member."""
        LogService.log_action(f"Fetching applications for member ID {member_id}")
        applications = JobApplicationRepository.get_applications_by_member(member_id)
        if not applications:
            LogService.log_action("No applications found")
        return [app.to_dict() for app in applications] if applications else []
