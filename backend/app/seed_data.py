import random
from service.auth import get_password_hash
from dependencies import get_db
from model.client_model import Listing, Group, User
from sqlalchemy.orm import Session
from datetime import datetime

def random_preferences():
    return {
        "language": random.sample(["English", "Polish", "German", "Spanish", "Turkish"], k=random.randint(1, 2)),
        "nationality": random.choice(["Polish", "German", "Spanish", "Turkish", "Italian"]),
        "smoking": random.choice([True, False]),
        "pet_friendly": random.choice([True, False]),
        "party_friendly": random.choice([True, False]),
        "preferred_sex_of_the_flat": random.sample(["male", "female", "non-binary"], k=random.randint(1, 2)),
        "quiet_hours": {"start": "22:00", "end": "07:00"},
        "vegan": random.choice([True, False])
    }

def seed_database():
    db: Session = next(get_db())

    if db.query(Listing).first():
        print("Database already seeded.")
        return

    existing_admin = db.query(User).filter(User.email == "admin@flatclub.com").first()
    if existing_admin:
        print("admin already exists... skipping the seeding admimn...")
        return

    # -- create admin ---
    admin = User(
        name="Admin",
        surname="User",
        username="admin",
        email="admin@flatclub.com",
        phone_number="+000000000",
        password=get_password_hash("admin123"), 
        role="admin"
    )
    db.add(admin)
    db.flush()

    # Create test user
    user = User(
        name="Anna",
        surname="Nowak",
        username="anna.nowak",
        email="anna.nowak@example.com",
        phone_number="+48123123123",
        password="password",  
        role="user"
    )
    db.add(user)
    db.flush()

    cities = ["Warsaw", "Krakow", "Gdansk", "Wroclaw", "Lublin", "Poznan", "Lodz", "Elblag"]
    titles = ["Cozy Apartment", "Modern Studio", "Spacious Flat", "Student Room", "Shared House"]
    listings = []

    for i in range(20):
        image_choices = [f"flat{n}.png" for n in random.sample(range(1, 7), k=random.randint(1, 3))]
        images = [f"uploads/{img}" for img in image_choices]

        listing = Listing(
            title=f"{random.choice(titles)} #{i+1}",
            description=f"A beautiful {random.choice(['sunny', 'quiet', 'central', 'modern'])} space perfect for {random.choice(['students', 'young professionals', 'internationals'])}.",
            price=random.randint(1500, 3500),
            location=random.choice(cities),
            isRental=bool(random.getrandbits(1)),
            owner_id=user.user_id,
            created=datetime.utcnow(),
            updated=datetime.utcnow(),
            images=images,
            preferences=random_preferences()
        )
        listings.append(listing)

    db.add_all(listings)
    db.flush()

    groups = []
    for i, listing in enumerate(listings):
        group = Group(
            name=f"Group #{i+1}",
            description=f"Flatmates interested in: {listing.title.lower()} in {listing.location}. Let's find a match!",
            listing_id=listing.listing_id,
            owner_id=user.user_id,
            created_at=datetime.utcnow()
        )
        groups.append(group)

    db.add_all(groups)
    db.commit()
    print("Inital data base is empty. For content seed_data.py will seed 20 listings, 20 groups, and asigned random images + preferences...")

if __name__ == "__main__":
    seed_database()
