from app.db import Base, engine
from app.models import auth_models, game_models  # Import all models to register them


# Explicitly define creation order
from app.models.auth_models import User
from app.models.game_models import Location, Game, Round, UserRound

Base.metadata.create_all(bind=engine)  # Recreate tables
print("Done!")