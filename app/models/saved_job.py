from app import db

class SavedJob(db.Model):
    __tablename__ = 'saved_jobs'

    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey('member.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    
    # Define relationships
    member = db.relationship('Member', backref='saved_jobs')
    job = db.relationship('Job', backref='saved_jobs')

    def to_dict(self):
        return {
            'id': self.id,
            'member_id': self.member_id,
            'job_id': self.job_id,
            'job_title': self.job.title  # Access the job's title for convenience
        }
