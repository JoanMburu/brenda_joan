from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify
from functools import wraps

def authenticate_role(allowed_roles):
    """
    A decorator to protect routes based on the user's role.
    :param allowed_roles: List of roles that are allowed to access the route.
    """
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            current_user = get_jwt_identity()
            
            if not current_user:
                return jsonify({"error": "Unauthorized access. No user identity found."}), 401
            
            if 'role' not in current_user:
                return jsonify({"error": "Role not found in user information"}), 403
            
            if current_user['role'] not in allowed_roles:
                return jsonify({"error": f"Unauthorized. You must have one of the following roles: {', '.join(allowed_roles)}"}), 403

            return fn(*args, **kwargs)
        return decorator
    return wrapper

def authenticate_admin():
    return authenticate_role(['admin'])

def authenticate_supervisor():
    return authenticate_role(['admin', 'supervisor'])

def authenticate_employer():
    return authenticate_role(['employer'])

def authenticate_member():
    return authenticate_role(['member'])
