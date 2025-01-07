from pydantic import BaseModel
from typing import List, Optional

class UserPreferences(BaseModel):
    language: List[str]  # list of languages
    nationality: Optional[str] 
    smoking: Optional[bool]  # true for smoking, false for non-smoking
    pet_friendly: Optional[bool]  # true if user prefers pets, false not
    party_friendly: Optional[bool] # true if user is okay for partying indoor, false fo r not
    outgoing: Optional[bool] # true if user is socially active, false for not
    preferred_sex_to_live_with: Optional[List[str]]  # male fmale etc.
    religion: Optional[str]
    vegan: Optional[bool] # true for vegan, false for not
