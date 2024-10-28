# app/models/job.py
from app import db
from datetime import datetime

class Job(db.Model):
    __tablename__ = 'jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text, nullable=False)
    salary = db.Column(db.String(20), nullable=True)
    deadline = db.Column(db.DateTime, nullable=False)
    
    # Relationship with Employer
    employer_id = db.Column(db.Integer, db.ForeignKey('employers.id'), nullable=False)
    employer = db.relationship("Employer", backref="jobs")  # Added relationship to access employer info

    # Timestamp fields
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Set on creation
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Updated when record is modified

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "salary": self.salary,
            "deadline": self.deadline.isoformat() if self.deadline else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "employer_id": self.employer_id,  # Employer ID
            "company_name": self.employer.company_name if self.employer else None  # Include employer's company name
        }
