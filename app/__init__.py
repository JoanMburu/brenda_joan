# __init__.py
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)

    # Enable CORS with specific origin and credentials support
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

    # Handle OPTIONS preflight requests globally
    @app.before_request
    def handle_options():
        if request.method == 'OPTIONS':
            return '', 204

    # Register blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.member_routes import member_bp
    from app.routes.employer_routes import employer_bp
    from app.routes.job_routes import job_bp
    from app.routes.log_routes import log_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(member_bp, url_prefix='/api/member')
    app.register_blueprint(employer_bp, url_prefix='/api/employers')
    app.register_blueprint(job_bp, url_prefix='/api/jobs')
    app.register_blueprint(log_bp, url_prefix='/system')

    return app
