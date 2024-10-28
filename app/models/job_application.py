from app import db
from datetime import datetime

class JobApplication(db.Model):
    __tablename__ = 'job_applications'

    id = db.Column(db.Integer, primary_key=True)
    resume = db.Column(db.Text, nullable=False)  # Store resume content or path to uploaded file
    cover_letter = db.Column(db.Text, nullable=False)
    member_id = db.Column(db.Integer, db.ForeignKey('member.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    member = db.relationship('Member', backref='job_applications')
    job = db.relationship('Job', backref='job_applications')

    def to_dict(self):
        return {
            'id': self.id,
            'resume': self.resume,
            'cover_letter': self.cover_letter,
            'member_id': self.member_id,
            'job_id': self.job_id,
            'created_at': self.created_at.isoformat()
        }