from faker import Faker
from app import create_app, db
from app.models.member import Member
from app.models.employer import Employer
from app.models.job import Job
from datetime import datetime, timedelta

fake = Faker()

def seed_members(count=10):
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

def seed_employers(count=5):
    """Seeds the database with fake Employer data."""
    for _ in range(count):
        employer_data = {
            'company_name': fake.company(),
            'email': fake.company_email(),
            'phone': fake.phone_number(),
            'about': fake.text(),
            'password': 'password123'
        }
        if Employer.query.filter_by(email=employer_data['email']).first() or Employer.query.filter_by(phone=employer_data['phone']).first():
            continue
        employer = Employer(**employer_data)
        employer.set_password('password123')
        db.session.add(employer)
    
    db.session.commit()

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

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()  # Ensure tables are created
        seed_members(10)
        seed_employers(5)
        seed_jobs(15)

    print("Database seeded with fake member, employer, and job data.")
