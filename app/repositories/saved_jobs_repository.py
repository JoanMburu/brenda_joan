from app.models.saved_job import SavedJob

class SavedJobsRepository:
    @staticmethod
    def get_saved_jobs_by_member(member_id):
        """Query to fetch all saved jobs by the member."""
        return SavedJob.query.filter_by(member_id=member_id).all()
