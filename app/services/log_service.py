from app.models.log import Log
from app import db
from flask_jwt_extended import get_jwt_identity

class LogService:
    @staticmethod
    def log_action(action):
        """
        Log an action performed in the system by capturing the user id, role, and the action.
        """
        try:
            current_user = get_jwt_identity()
            user_id = current_user.get('id') if current_user else None
            user_role = current_user.get('role') if current_user else None

            # Create a new log entry
            log = Log(user_id=user_id, user_role=user_role, action=action)
            db.session.add(log)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Error logging action: {str(e)}")  # Ensure you capture logging errors

    @staticmethod
    def get_all_logs():
        """
        Fetch all logs from the system ordered by timestamp.
        """
        try:
            logs = Log.query.order_by(Log.timestamp.desc()).all()
            return [log.to_dict() for log in logs]
        except Exception as e:
            print(f"Error retrieving logs: {str(e)}")
            return []
