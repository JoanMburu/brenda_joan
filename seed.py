# seed.py
from faker import Faker
from app import create_app, db
from app.models.member import Member
from app.models.employer import Employer
from app.models.job import Job
from app.models.job_application import JobApplication
from app.models.saved_job import SavedJob
from app.models.log import Log
from datetime import datetime, timedelta

fake = Faker()

def seed_members(count=20):
    """Seeds the database with fake Member data."""
    for _ in range(count):
        member_data = {
            'name': fake.name(),
            'phone': fake.phone_number(),
            'email': fake.email(),
            'role': fake.random_element(elements=("member", "admin", "supervisor")),
            'is_active': True
        }
        if Member.query.filter_by(email=member_data['email']).first() or Member.query.filter_by(phone=member_data['phone']).first():
            continue
        member = Member(**member_data)
        member.set_password('password123')
        db.session.add(member)

    db.session.commit()
    print(f"Seeded {count} members.")

def seed_employers(count=10):
    """Seeds the database with fake Employer data."""
    for _ in range(count):
        employer_data = {
            'company_name': fake.company(),
            'email': fake.company_email(),
            'phone': fake.phone_number(),
            'about': fake.text(),
            'role': "employer"
        }
        if Employer.query.filter_by(email=employer_data['email']).first() or Employer.query.filter_by(phone=employer_data['phone']).first():
            continue
        employer = Employer(**employer_data)
        employer.set_password('password123')
        db.session.add(employer)

    db.session.commit()
    print(f"Seeded {count} employers.")

def seed_jobs(count=15):
    """Seeds the database with fake Job data."""
    employers = Employer.query.all()
    if not employers:
        print("Please seed employers first.")
        return

    for _ in range(count):
        job_data = {
            'title': fake.job(),
            'description': fake.text(),
            'salary': fake.random_element(elements=("50k", "60k", "70k", "80k")),
            'deadline': datetime.utcnow() + timedelta(days=fake.random_int(min=10, max=90)),
            'employer_id': fake.random_element(employers).id
            
        }
        job = Job(**job_data)
        db.session.add(job)

    db.session.commit()
    print(f"Seeded {count} jobs.")

def seed_job_applications(count=20):
    """Seeds the database with fake Job Application data."""
    members = Member.query.filter_by(role="member").all()
    jobs = Job.query.all()

    if not members or not jobs:
        print("Please seed members and jobs first.")
        return

    for _ in range(count):
        application_data = {
            'resume': fake.text(),
            'cover_letter': fake.text(),
            'member_id': fake.random_element(members).id,
            'job_id': fake.random_element(jobs).id,
            'created_at': datetime.utcnow()
        }
        job_application = JobApplication(**application_data)
        db.session.add(job_application)

    db.session.commit()
    print(f"Seeded {count} job applications.")

def seed_saved_jobs(count=20):
    """Seeds the database with fake Saved Job data for members."""
    members = Member.query.filter_by(role="member").all()
    jobs = Job.query.all()

    if not members or not jobs:
        print("Please seed members and jobs first.")
        return

    for _ in range(count):
        saved_job_data = {
            'member_id': fake.random_element(members).id,
            'job_id': fake.random_element(jobs).id
        }
        saved_job = SavedJob(**saved_job_data)
        db.session.add(saved_job)

    db.session.commit()
    print(f"Seeded {count} saved jobs.")

def seed_logs(count=50):
    """Seeds the database with fake Log data for users with specific roles."""
    users = Member.query.filter(Member.role.in_(["member", "admin", "employer"])).all()
    actions = ["Viewed job", "Applied for job", "Saved job", "Updated profile"]

    for _ in range(count):
        user = fake.random_element(users)
        log_data = {
            'user_id': user.id,
            'user_role': user.role,  # Assign the role directly from the user data
            'action': fake.random_element(actions),
            'timestamp': datetime.utcnow()
        }
        log = Log(**log_data)
        db.session.add(log)

    db.session.commit()
    print(f"Seeded {count} logs.")

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()  # Ensure tables are created
        seed_members(20)  # Seed members with different roles
        seed_employers(10)  # Seed employers
        seed_jobs(15)  # Seed jobs
        seed_job_applications(20)  # Seed job applications
        seed_saved_jobs(20)  # Seed saved jobs
        seed_logs(50)  # Seed logs

    print("Database seeded with fake data.")
