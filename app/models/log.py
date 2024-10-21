from app import db
from datetime import datetime

class Log(db.Model):
    __tablename__ = 'logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)  # Nullable in case there's no user logged in
    user_role = db.Column(db.String(50), nullable=True)  # e.g., admin, employer, member
    action = db.Column(db.String(255), nullable=False)  # Description of the action performed
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)  # When the action was logged

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user_role": self.user_role,
            "action": self.action,
            "timestamp": self.timestamp.isoformat()
        }